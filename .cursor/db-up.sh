#!/usr/bin/env bash
# Idempotently ensure a local MariaDB server is installed and accepting
# connections. Shared by install.sh (build/first setup) and start.sh (per boot).
#
# Notes for sandboxed Cloud Agent build pods:
#  - InnoDB's native AIO (io_uring/libaio) syscalls are frequently blocked by the
#    build sandbox, which makes mariadbd fail to start. We force synchronous IO
#    via a persisted config file (innodb_use_native_aio=0).
#  - mariadbd runs under an AppArmor profile that forbids writing logs to
#    arbitrary paths (e.g. /tmp), so we log to /var/log/mysql, an allowed path.
set -euo pipefail

DATADIR="/var/lib/mysql"
RUNDIR="/run/mysqld"
LOGDIR="/var/log/mysql"
BOOTLOG="${LOGDIR}/cloud-agent-boot.log"
CONF="/etc/mysql/mariadb.conf.d/99-cloud-agent.cnf"

echo "==> Ensuring MariaDB server is installed"
if ! command -v mariadbd >/dev/null 2>&1 && ! command -v mysqld >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server mariadb-client
fi

echo "==> Ensuring MariaDB portability config is present"
sudo mkdir -p "$(dirname "$CONF")"
if [ ! -f "$CONF" ]; then
  sudo tee "$CONF" >/dev/null <<'CNF'
[mysqld]
# io_uring / native AIO syscalls are often blocked in sandboxed build pods,
# which makes InnoDB fail to start. Force synchronous IO for portability.
innodb_use_native_aio = 0
CNF
fi

echo "==> Preparing MariaDB directories"
sudo mkdir -p "$DATADIR" "$RUNDIR" "$LOGDIR"
sudo chown -R mysql:mysql "$DATADIR" "$RUNDIR" "$LOGDIR"

if [ ! -d "$DATADIR/mysql" ]; then
  echo "==> Initializing MariaDB data directory"
  sudo mariadb-install-db --user=mysql --datadir="$DATADIR" >/dev/null
fi

if sudo mariadb -e "SELECT 1" >/dev/null 2>&1; then
  echo "==> MariaDB already running"
  exit 0
fi

echo "==> Starting MariaDB"
sudo rm -f "${RUNDIR}/mysqld.pid" "${RUNDIR}/mysqld.sock"
sudo touch "$BOOTLOG"; sudo chown mysql:mysql "$BOOTLOG"
sudo bash -c "nohup mariadbd --user=mysql --datadir='${DATADIR}' >'${BOOTLOG}' 2>&1 &"

for _ in $(seq 1 60); do
  if sudo mariadb -e "SELECT 1" >/dev/null 2>&1; then
    echo "==> MariaDB is ready"
    exit 0
  fi
  sleep 1
done

echo "MariaDB failed to start within timeout" >&2
sudo tail -n 40 "$BOOTLOG" >&2 || true
exit 1
