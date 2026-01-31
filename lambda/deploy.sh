#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: ./deploy.sh <lambda-function-name> <entry-file.mjs> [zip-name] [--env KEY=VAL ...]"
  echo "Example: ./deploy.sh galleryAuth galleryAuth.mjs --env GALLERY_PASSWORD='...' GALLERY_TOKEN_SECRET='...'"
  exit 1
fi

FUNCTION_NAME="$1"
ENTRY_FILE="$2"
shift 2

ZIP_NAME="${ENTRY_FILE%.mjs}.zip"
if [ "${1:-}" != "" ] && [[ "$1" != --env ]]; then
  ZIP_NAME="$1"
  shift
fi

ENV_ARGS=()
if [ "${1:-}" = "--env" ]; then
  shift
  ENV_ARGS=("$@")
fi

if [ ! -f "$ENTRY_FILE" ]; then
  echo "Entry file not found: $ENTRY_FILE"
  exit 1
fi

if [ ! -f package-lock.json ]; then
  echo "Run this script from the lambda directory."
  exit 1
fi

npm ci --omit=dev
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" "$ENTRY_FILE" node_modules package.json package-lock.json >/dev/null

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$ZIP_NAME" >/dev/null

if [ "${#ENV_ARGS[@]}" -gt 0 ]; then
  ENV_JSON=$(node -e 'const vars={}; for (const arg of process.argv.slice(1)) { const idx=arg.indexOf("="); if (idx === -1) continue; const k=arg.slice(0, idx); const v=arg.slice(idx+1); vars[k]=v; } console.log(JSON.stringify({Variables: vars}));' "${ENV_ARGS[@]}")
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --environment "$ENV_JSON" >/dev/null
fi

echo "Deployed $FUNCTION_NAME with $ZIP_NAME"
