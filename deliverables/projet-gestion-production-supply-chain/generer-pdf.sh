#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="${SCRIPT_DIR}/rapport.html"
OUTPUT="${1:-${SCRIPT_DIR}/Jorf_Moaad_Projet_Gestion_Production_Supply_Chain.pdf}"

if [[ -x /opt/google/chrome/chrome ]]; then
  BROWSER="/opt/google/chrome/chrome"
elif command -v chromium >/dev/null 2>&1; then
  BROWSER="chromium"
elif command -v chromium-browser >/dev/null 2>&1; then
  BROWSER="chromium-browser"
elif command -v google-chrome >/dev/null 2>&1; then
  BROWSER="google-chrome"
else
  echo "Erreur : Chromium ou Google Chrome est requis." >&2
  exit 1
fi

PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

mkdir -p "$(dirname "$OUTPUT")"
OUTPUT="$(realpath -m "$OUTPUT")"

"$BROWSER" \
  --headless=new \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=2000 \
  --user-data-dir="$PROFILE" \
  --print-to-pdf="$OUTPUT" \
  "file://${SOURCE}"

if command -v pdfinfo >/dev/null 2>&1; then
  PAGES="$(pdfinfo "$OUTPUT" | awk '/^Pages:/ {print $2}')"
  echo "PDF généré : $OUTPUT ($PAGES pages)"
else
  echo "PDF généré : $OUTPUT"
fi
