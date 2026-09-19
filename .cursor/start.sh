#!/usr/bin/env bash
# Per-boot startup: ensure MariaDB is running before the dev server starts.
# Idempotent: does nothing if the server is already accepting connections.
set -euo pipefail

DATADIR="/var/lib/mysql"

sudo mkdir -p "$DATADIR" /var/run/mysqld
sudo chown -R mysql:mysql "$DATADIR" /var/run/mysqld

if sudo mariadb -e "SELECT 1" >/dev/null 2>&1; then
  echo "MariaDB already running"
  exit 0
fi

echo "Starting MariaDB..."
sudo -b mariadbd --user=mysql --datadir="$DATADIR" >/tmp/mariadbd.log 2>&1

for _ in $(seq 1 30); do
  if sudo mariadb -e "SELECT 1" >/dev/null 2>&1; then
    echo "MariaDB is ready"
    exit 0
  fi
  sleep 1
done

echo "MariaDB failed to start within timeout" >&2
tail -n 30 /tmp/mariadbd.log >&2 || true
exit 1
