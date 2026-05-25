#!/bin/bash
# ============================================================
#  NexFile WIZARD launcher (macOS)
#
#  Double-click this file from Finder to launch the desktop wizard.
#  On first run it installs npm dependencies (~3-5 minutes).
#  Subsequent runs go straight to launching Electron.
#
#  Flow: 13 pasos (Welcome → Central DB → Super-admin → Tenant →
#  Grupo → Companies → Agencias → Procesos → Catálogos → Admin →
#  Branding → Integraciones → Confirmar → Listo). El paso Confirmar
#  hace toda la provisión atómicamente con auto-rollback si algo falla.
#
#  Requirements:
#   - Node.js 20+ installed and on PATH
#   - config/central.env present at the repo root (one level up)
#     (copy from config/central.env.template and fill in the creds)
# ============================================================

set -e

# cd to the directory this script lives in
cd "$(dirname "$0")"

echo
echo "=== NexFile WIZARD ==="
echo "Directory: $(pwd)"
echo

# Verify Node is available
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js not found on PATH. Install Node 20+ from https://nodejs.org and re-run."
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

echo "Node version: $(node --version)"

# Install dependencies on first run
if [ ! -d "node_modules/@angular/core" ]; then
    echo
    echo "Dependencies missing. Running npm install..."
    echo "This takes 3-5 minutes the first time."
    echo
    npm install || {
        echo
        echo "[ERROR] npm install failed. Fix the error above and re-run."
        read -n 1 -s -r -p "Press any key to exit..."
        exit 1
    }
fi

# Warn if central.env is missing — wizard still works but Step 2 won't auto-fill
if [ ! -f "../config/central.env" ]; then
    echo
    echo "[WARN] ../config/central.env not found."
    echo "The wizard will still run, but Step 2 won't pre-fill — you'll have to"
    echo "type the central DB credentials manually."
    echo
    echo "Copy ../config/central.env.template to ../config/central.env and edit it."
    echo
    read -n 1 -s -r -p "Press any key to continue anyway..."
    echo
fi

# Kill any prior wizard instance so we always launch against the freshly built
# electron main + Angular bundle. The dev rule is: each relaunch must pick up
# the latest electron/services/db-ipc.ts changes — stale processes hide them.
echo "Cerrando instancias previas del WIZARD…"
pkill -f "electron .* NexFile" 2>/dev/null || true
pkill -f "WIZARD.*electron" 2>/dev/null || true
pkill -f "ng serve.*4300" 2>/dev/null || true

# Free port 4300 if something else (or a zombie ng serve) is holding it,
# otherwise `wait-on http://localhost:4300` hangs forever.
if command -v lsof >/dev/null 2>&1; then
    PORT_PID=$(lsof -ti tcp:4300 2>/dev/null || true)
    if [ -n "$PORT_PID" ]; then
        echo "  · Liberando puerto 4300 (pid $PORT_PID)…"
        kill -9 $PORT_PID 2>/dev/null || true
    fi
fi
sleep 1

# Launch the wizard (npm start re-compiles electron main first, then
# runs Angular dev server + electron in parallel via concurrently)
echo
echo "Launching wizard... (Ctrl+C to abort)"
echo
npm start

# Keep window open after wizard closes so the user sees any error trace
echo
read -n 1 -s -r -p "Wizard closed. Press any key to exit..."
echo
