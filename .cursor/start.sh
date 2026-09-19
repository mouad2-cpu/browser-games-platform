#!/usr/bin/env bash
# Per-boot startup: ensure MariaDB is running before the dev server starts.
# Idempotent: does nothing if the server is already accepting connections.
set -euo pipefail

bash "$(dirname "$0")/db-up.sh"
