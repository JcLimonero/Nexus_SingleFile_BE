<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Drives tenant status transitions according to the grace-period policy.
 * Reads tenant + tenant_subscription rows from the central DB and updates
 * status. Each transition is logged to tenant_status_history.
 *
 * Policy:
 *   active   → grace      when current_period_end < now
 *   grace    → readonly   when grace_started_at  + 7d  < now
 *   readonly → suspended  when readonly_started_at + 7d  < now
 *   suspended→ terminated when suspended_at + 16d < now
 *
 * Schedule with cron (Railway / linux box):
 *   0 3 * * *  php spark tenant:lifecycle
 */
class TenantLifecycleCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:lifecycle';
    protected $description = 'Apply tenant status transitions according to the billing grace-period policy.';
    protected $usage       = 'tenant:lifecycle [--dry-run]';
    protected $options     = ['--dry-run' => 'Print decisions without writing'];

    private const GRACE_DAYS     = 7;
    private const READONLY_DAYS  = 7;
    private const SUSPENDED_DAYS = 16;

    public function run(array $params)
    {
        $dry = (bool) CLI::getOption('dry-run');
        try {
            $db = Database::connect('central');
        } catch (\Throwable $e) {
            CLI::error('Central DB unreachable: ' . $e->getMessage());
            return EXIT_ERROR;
        }

        $rows = $db->table('tenant t')
            ->select('t.id, t.slug, t.status, s.current_period_end, s.grace_started_at, s.readonly_started_at, s.suspended_at')
            ->join('tenant_subscription s', 's.id_tenant = t.id', 'left')
            ->whereIn('t.status', ['active', 'grace', 'readonly', 'suspended'])
            ->get()->getResultArray();

        $now = time();
        $changes = 0;

        foreach ($rows as $r) {
            $next = $this->decideNext($r, $now);
            if ($next === null) continue;

            CLI::write(sprintf('  %s (%s): %s → %s', $r['slug'], $r['id'], $r['status'], $next['to']),
                $next['to'] === 'terminated' ? 'red' : ($next['to'] === 'active' ? 'green' : 'yellow'));

            if ($dry) continue;

            $db->transStart();
            $update = ['status' => $next['to']];
            $subUpdate = [];
            $stamp = date('Y-m-d H:i:s', $now);
            if ($next['to'] === 'grace')     $subUpdate['grace_started_at']    = $stamp;
            if ($next['to'] === 'readonly')  $subUpdate['readonly_started_at'] = $stamp;
            if ($next['to'] === 'suspended') $subUpdate['suspended_at']        = $stamp;
            $db->table('tenant')->where('id', $r['id'])->update($update);
            if ($subUpdate) $db->table('tenant_subscription')->where('id_tenant', $r['id'])->update($subUpdate);
            $db->table('tenant_status_history')->insert([
                'id_tenant'   => $r['id'],
                'status_from' => $r['status'],
                'status_to'   => $next['to'],
                'reason'      => $next['reason'],
            ]);
            $db->transComplete();
            $changes++;
        }

        CLI::newLine();
        CLI::write(sprintf('Scanned %d tenants, %d transitions%s.',
            count($rows), $changes, $dry ? ' (dry-run)' : ''
        ), 'green');
        return EXIT_SUCCESS;
    }

    private function decideNext(array $r, int $now): ?array
    {
        $endTs        = $r['current_period_end']  ? strtotime($r['current_period_end'])  : null;
        $graceTs      = $r['grace_started_at']    ? strtotime($r['grace_started_at'])    : null;
        $readonlyTs   = $r['readonly_started_at'] ? strtotime($r['readonly_started_at']) : null;
        $suspendedTs  = $r['suspended_at']        ? strtotime($r['suspended_at'])        : null;

        switch ($r['status']) {
            case 'active':
                if ($endTs && $endTs < $now) return ['to' => 'grace', 'reason' => 'current_period_end passed'];
                return null;
            case 'grace':
                if ($graceTs && ($now - $graceTs) >= self::GRACE_DAYS * 86400) {
                    return ['to' => 'readonly', 'reason' => self::GRACE_DAYS . ' days in grace elapsed'];
                }
                return null;
            case 'readonly':
                if ($readonlyTs && ($now - $readonlyTs) >= self::READONLY_DAYS * 86400) {
                    return ['to' => 'suspended', 'reason' => self::READONLY_DAYS . ' days readonly elapsed'];
                }
                return null;
            case 'suspended':
                if ($suspendedTs && ($now - $suspendedTs) >= self::SUSPENDED_DAYS * 86400) {
                    return ['to' => 'terminated', 'reason' => self::SUSPENDED_DAYS . ' days suspended elapsed'];
                }
                return null;
        }
        return null;
    }
}
