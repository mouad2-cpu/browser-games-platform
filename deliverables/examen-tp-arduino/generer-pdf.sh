#!/usr/bin/env bash
set -euo pipefail

DOSSIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$DOSSIER/compte-rendu.html"
SORTIE="${1:-$DOSSIER/Jorf_Moaad_Examen_TP_Arduino.pdf}"
CHROME="${CHROME_BIN:-$(command -v google-chrome-stable || command -v google-chrome || command -v chromium || true)}"
PROFIL_TEMPORAIRE="$(mktemp -d)"
trap 'rm -rf "$PROFIL_TEMPORAIRE"' EXIT

if [[ -z "$CHROME" ]]; then
  echo "Erreur : Google Chrome ou Chromium est requis pour générer le PDF." >&2
  exit 1
fi

"$CHROME" \
  --headless \
  --no-sandbox \
  --disable-gpu \
  --disable-dev-shm-usage \
  --user-data-dir="$PROFIL_TEMPORAIRE" \
  --no-pdf-header-footer \
  --print-to-pdf="$SORTIE" \
  "file://$SOURCE"

echo "PDF généré : $SORTIE"
