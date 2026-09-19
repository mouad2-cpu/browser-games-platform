#!/usr/bin/env bash
# Idempotent bootstrap for the Browser Games Platform (Next.js + Prisma + MariaDB).
# Safe to run repeatedly: ensures the database is up, installs deps, syncs the
# Prisma schema, and seeds demo data.
set -euo pipefail

cd "$(dirname "$0")/.."

DB_NAME="browser_games"
DB_USER="bg_user"
DB_PASS="bg_password"

echo "==> Ensuring MariaDB is installed and running"
bash "$(dirname "$0")/db-up.sh"
sudo mariadb -e "SELECT VERSION();"

echo "==> Ensuring application database and user exist"
sudo mariadb <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

echo "==> Ensuring .env exists"
if [ ! -f .env ]; then
  AUTH_SECRET="$(openssl rand -hex 32)"
  cat > .env <<ENV
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}"
AUTH_SECRET="${AUTH_SECRET}"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV
  echo "    wrote .env"
else
  echo "    .env already present, leaving it untouched"
fi

echo "==> Installing Node dependencies"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> Generating Prisma client"
npx prisma generate

# The committed migration history starts from a squashed "rewrite" migration
# that assumes a pre-existing baseline, so it is not replayable on a fresh DB.
# The schema is the source of truth for local dev, so sync it directly.
echo "==> Syncing database schema (prisma db push)"
npx prisma db push --skip-generate

echo "==> Seeding demo data (idempotent upserts)"
npm run db:seed

echo "==> Install complete"
