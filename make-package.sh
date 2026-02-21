#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$ROOT_DIR/dist"
EDITABLE_NAME="journey-map-resume-editable"
VIEWER_NAME="journey-map-resume-viewer"

mkdir -p "$OUT_DIR"
rm -rf "$OUT_DIR/$EDITABLE_NAME" "$OUT_DIR/$VIEWER_NAME"
mkdir -p "$OUT_DIR/$EDITABLE_NAME" "$OUT_DIR/$VIEWER_NAME"

# Editable package (for you)
cp "$ROOT_DIR/index.html" "$OUT_DIR/$EDITABLE_NAME/"
cp "$ROOT_DIR/styles.css" "$OUT_DIR/$EDITABLE_NAME/"
cp "$ROOT_DIR/app.js" "$OUT_DIR/$EDITABLE_NAME/"
cp "$ROOT_DIR/sample-journey-data.json" "$OUT_DIR/$EDITABLE_NAME/"
cp "$ROOT_DIR/journey-data-template.json" "$OUT_DIR/$EDITABLE_NAME/"
cp "$ROOT_DIR/README.md" "$OUT_DIR/$EDITABLE_NAME/"

cat > "$OUT_DIR/$EDITABLE_NAME/START_HERE.txt" <<TXT
Editable package
1) Open index.html.
2) Unlock edit mode using your passcode.
3) Edit journey steps and Export JSON.
4) You can start from journey-data-template.json.
TXT

# Viewer package (read-only by config)
cp "$ROOT_DIR/index.html" "$OUT_DIR/$VIEWER_NAME/"
cp "$ROOT_DIR/styles.css" "$OUT_DIR/$VIEWER_NAME/"
cp "$ROOT_DIR/sample-journey-data.json" "$OUT_DIR/$VIEWER_NAME/"
cp "$ROOT_DIR/journey-data-template.json" "$OUT_DIR/$VIEWER_NAME/"
cp "$ROOT_DIR/README.md" "$OUT_DIR/$VIEWER_NAME/"

# Flip the in-file toggle for a read-only distributed package.
sed 's/^const ALLOW_EDIT_MODE = true;/const ALLOW_EDIT_MODE = false;/' "$ROOT_DIR/app.js" > "$OUT_DIR/$VIEWER_NAME/app.js"

cat > "$OUT_DIR/$VIEWER_NAME/START_HERE.txt" <<TXT
Viewer package (edit mode disabled)
1) Open index.html.
2) Explore map and timeline.
3) No edit button is shown in this package.
TXT

rm -f "$OUT_DIR/${EDITABLE_NAME}.zip" "$OUT_DIR/${VIEWER_NAME}.zip"
(
  cd "$OUT_DIR"
  zip -rq "${EDITABLE_NAME}.zip" "$EDITABLE_NAME"
  zip -rq "${VIEWER_NAME}.zip" "$VIEWER_NAME"
)

echo "Created: $OUT_DIR/${EDITABLE_NAME}.zip"
echo "Created: $OUT_DIR/${VIEWER_NAME}.zip"
