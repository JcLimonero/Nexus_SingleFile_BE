#!/bin/bash
# ============================================================
#  NexFile WIZARD launcher (macOS)
#
#  Double-click this file from Finder to launch the desktop wizard.
#  On first run it installs npm dependencies (~3-5 minutes).
#  Subsequent runs go straight to launching Electron.
#
#  Requirements:
#   - Node.js 20+ installed and on PATH
#   - config/central.env present at the repo root (one level up)
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

# Launch the wizard
echo
echo "Launching wizard... (Ctrl+C to abort)"
echo
npm start

# Keep window open after wizard closes so the user sees any error trace
echo
read -n 1 -s -r -p "Wizard closed. Press any key to exit..."
echo
