#!/usr/bin/env zsh
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: ./refresh-package-from-json.sh /absolute/path/to/journey-data.json"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT_JSON="$1"
TARGET_JSON="$ROOT_DIR/sample-journey-data.json"

if [[ ! -f "$INPUT_JSON" ]]; then
  echo "Input file not found: $INPUT_JSON"
  exit 1
fi

if [[ "$INPUT_JSON" != "$TARGET_JSON" ]]; then
  cp "$INPUT_JSON" "$TARGET_JSON"
fi
"$ROOT_DIR/make-package.sh"

echo "Updated sample data from: $INPUT_JSON"
echo "Rebuilt packages in: $ROOT_DIR/dist"
