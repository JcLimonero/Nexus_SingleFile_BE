# Deploy guide — Multi-tenant rollout (PR-8)

End-to-end checklist to flip the SaaS multi-tenant flag in production
and onboard the first paying tenant. Assumes PRs 1–7 are merged and
deployed.

---

## 1. Generate shared secrets

Every secret listed here must be generated ONCE and stored in your secret
manager of choice. Lose them and you lose the ability to decrypt tenant DB
passwords / verify super-admin sessions.

```bash
# TENANT_DB_ENCRYPTION_KEY — 32 bytes hex (used by BE/, ADMIN_BE/, WIZARD/).
# All three apps must use the same value or decryption fails.
php -r "echo bin2hex(random_bytes(32));"

# SUPER_ADMIN_JWT_SECRET — for ADMIN_BE only, separate from tenant JWT.
# Minimum 32 bytes; using 48 for extra margin.
php -r "echo bin2hex(random_bytes(48));"
```

Add to each `.env`:

| Var | BE/ | ADMIN_BE/ | WIZARD (user input at step 4) |
|---|---|---|---|
| `TENANT_DB_ENCRYPTION_KEY` | ✅ | ✅ | ✅ |
| `SUPER_ADMIN_JWT_SECRET`   |   | ✅ |   |
| `MULTITENANT_ENABLED`      | ✅ |   |   |

`MULTITENANT_ENABLED` stays `false` until step 7 below.

---

## 2. Provision the central DB

On your MySQL server (managed or otherwise — same server as tenant DBs is
fine for MVP):

```sql
CREATE DATABASE nexfile_central
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Optional: a dedicated user that ADMIN_BE uses with INSERT/UPDATE perms
-- on nexfile_central only.
```

Run the central migrations from ADMIN_BE:

```bash
cd ADMIN_BE
# Make sure ADMIN_BE/.env points at the central DB:
#   database.default.database = nexfile_central
php spark migrate -g central
```

You should see 5 tables created in `nexfile_central`: `tenant`,
`tenant_subscription`, `tenant_config`, `tenant_status_history`,
`super_admin_user`.

---

## 3. Seed the first super-admin

```bash
cd ADMIN_BE
php spark super-admin:seed \
  --email=root@nexusqtech.com \
  --password=<strong-password> \
  --name="Carlos"
```

Verify by hitting the login endpoint from the local machine:

```bash
curl -s -X POST http://localhost:8087/api/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"root@nexusqtech.com","password":"<strong-password>"}' | jq
```

Expected: `{success: true, data: {access_token: "...", user: {...}}}`.

---

## 4. Deploy ADMIN_BE + ADMIN web

Deploy ADMIN_BE to `api-admin.nexfile.app` and the Angular ADMIN build to
`admin.nexfile.app`. CORS in ADMIN_BE/.env:

```
CORS_ALLOWED_ORIGINS = https://admin.nexfile.app
```

Verify by logging into `https://admin.nexfile.app` with the super-admin
credentials. You should see an empty tenants list.

---

## 5. DNS wildcard

Add an `A` or `CNAME` record:

```
*.nexfile.app  →  <BE server>
```

Plus a wildcard TLS cert (Let's Encrypt: `certbot --apache -d "*.nexfile.app"`
or use a managed solution).

Test:

```bash
curl -sI https://vw.nexfile.app/  # vw doesn't exist yet — should resolve
                                  # and reach the BE, then return 404
                                  # tenant_not_found (because MULTITENANT_ENABLED=true)
                                  # or just the legacy landing page (when false).
```

---

## 6. Provision the first tenant via WIZARD

Run the desktop wizard locally (or on a NexusQTech ops machine):

```bash
cd WIZARD
npm install   # first time only
npm start
```

Complete the 15 steps:

1. Welcome
2. Central DB connection (from step 2)
3. Super-admin login (from step 3)
4. Tenant info — slug = `vw`, name = `Volkswagen México`, tenant DB
   credentials, **TENANT_DB_ENCRYPTION_KEY** from step 1
5. Schema (creates `nexfile_tenant_vw` + curated tables)
6. Client group — e.g. `Volkswagen Group`
7. Razones sociales (one or more `company` rows)
8. Agencies
9. Processes — load defaults, set order + voucher flag
10. Catalogs — load defaults, deselect rows that don't apply
11. Admin user — email + password (this is the first user that logs
    into `vw.nexfile.app`)
12. Branding
13. Integrations (Backblaze + Orders API, optional)
14. Confirm — runs `wizard:provision`, streams log
15. Done

Verify in ADMIN_BE:

```sql
SELECT id, slug, name, status, db_host, db_name FROM nexfile_central.tenant;
```

You should see the new tenant with `status='active'`.

---

## 7. Flip the feature flag

```diff
  # BE/.env
- MULTITENANT_ENABLED = false
+ MULTITENANT_ENABLED = true
```

**Restart the BE** so the new env value is picked up. From this moment:

- Every request with a Host header that matches a tenant slug routes to
  that tenant's DB.
- Requests to bare `nexfile.app` (no subdomain) fall back to the legacy
  `nexfile` DB — the original single-tenant install keeps working.
- Subdomains that don't match any tenant return 404 `tenant_not_found`.

---

## 8. Smoke test

```bash
# Login as the tenant admin
curl -s -X POST https://vw.nexfile.app/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@vw.com","password":"..."}' | jq

# Hit a tenant-aware endpoint (uses the resolved tenant DB transparently)
TOKEN=...
curl -s https://vw.nexfile.app/api/phase/active-for-user \
  -H "Authorization: Bearer $TOKEN" | jq
```

Open `https://vw.nexfile.app` in a browser. The Procesos dropdown should
list the phases configured in the WIZARD (not the legacy
Integración/Liquidación/Liberación).

---

## 9. Schedule the lifecycle cron

```bash
# On the BE host's crontab
0 3 * * *  cd /path/to/BE && php spark tenant:lifecycle
```

This runs daily and advances tenant status per the grace-period policy:
0-7d grace → 7-14d readonly → 14+d suspended → 30d terminated.

---

## 10. Test the gate

Simulate non-payment for the `vw` tenant from ADMIN:

```sql
-- Backdate the period_end so the next cron run will move it to grace
UPDATE nexfile_central.tenant_subscription
  SET current_period_end = NOW() - INTERVAL 1 DAY
  WHERE id_tenant = (SELECT id FROM nexfile_central.tenant WHERE slug='vw');
```

```bash
cd BE && php spark tenant:lifecycle
# Expected: vw → grace
```

Now login to `https://vw.nexfile.app`. The FE should show the grace-period
banner with "Periodo de gracia: 7 días restantes".

To test the harder states, advance the dates further and re-run the cron,
or use ADMIN_BE PATCH `/api/admin/tenants/<id>/status` with
`{"status":"readonly"}` or `{"status":"suspended"}` for immediate effect.

When suspended, every POST/PUT/PATCH/DELETE returns 402 and the FE
redirects to `/cuenta-suspendida`.

---

## Rollback

If anything goes wrong:

1. `MULTITENANT_ENABLED = false` in BE/.env → restart BE → back to
   legacy single-tenant behavior. Tenant DBs and central DB stay intact;
   nothing in them is destroyed.
2. The legacy `nexfile` DB is never touched by the multi-tenant code.
3. To fully remove the new tables: drop `nexfile_central` and run
   `php spark migrate:rollback` on the tenant DB(s) to undo the
   client_group / file_state.requires_payment_voucher additions.

---

## Known gaps

- WIZARD `migrations.ts` only covers the curated subset of tables needed
  for the wizard's INSERTs. After provisioning, point a `BE/.env` at
  the new tenant DB and run `php spark migrate` to apply the full
  schema. (Or `php spark db:clone-schema --target=nexfile_tenant_<slug>`
  from a reference tenant DB.)
- Subdomain branding is not yet implemented — BrandingService still reads
  from `assets/config/branding.json`. To make per-tenant branding work,
  swap that for a `GET /api/config/branding` call that the BE resolves
  against the current tenant's `tenant_config`.
- The generic `/fases/:slug` page is a shell — the actual files table
  per phase still lives in the legacy components. Migrate phase-by-phase
  once we validate the dynamic flow with the first tenant.
- WIZARD desktop builds (`npm run package:mac` / `package:win`) not yet
  configured / signed. For ops use, `npm start` from source works.
