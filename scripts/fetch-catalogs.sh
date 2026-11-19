#!/usr/bin/env bash
# Replace each catalog's latest file in the built site with the newest copy published as a GitHub Release.
#
# The ocbc and oebc repos publish a release tagged baseline-YYYY-MM-DD every time their catalog changes.
# This script picks the newest of those releases, downloads its catalog file and writes it to
#   <dist>/<name>/catalog/v0.1/<latest file>
# so the public URL stays on openastra.org. History stays on the releases.
#
# If a release has no catalog file (OCBC's releases don't attach one yet), the copy committed under public/,
# which Vite already put in <dist>, is kept and a warning is printed.
#
# Usage: scripts/fetch-catalogs.sh [dist-dir]     (needs gh, with GH_TOKEN set in CI)
set -euo pipefail

DIST="${1:-dist}"
OWNER="sadayamuthu"
SPEC="v0.1"

# name | file pattern on the release | file name served on openastra.org
CATALOGS=(
  "ocbc|ocbc-catalog-*.json|latest.json"
  "oebc|oebc-catalog-*.json.gz|latest.json.gz"
)

validate() {
  local file="$1"
  case "$file" in
    *.gz) gzip -t "$file" && gunzip -c "$file" | jq -e '.project' >/dev/null ;;
    *)    jq -e '.project' "$file" >/dev/null ;;
  esac
}

for entry in "${CATALOGS[@]}"; do
  IFS='|' read -r name pattern served <<<"$entry"
  repo="$OWNER/$name"
  target="$DIST/$name/catalog/$SPEC/$served"

  tag=$(gh release list --repo "$repo" --limit 100 --json tagName \
          --jq '[.[].tagName | select(test("^baseline-[0-9]{4}-[0-9]{2}-[0-9]{2}$"))] | sort | last // empty')
  if [[ -z "$tag" ]]; then
    echo "::warning::$name: no baseline-* release found; serving the committed copy."
    continue
  fi

  tmp=$(mktemp -d)
  if ! gh release download "$tag" --repo "$repo" --pattern "$pattern" --dir "$tmp" 2>/dev/null \
     || [[ -z "$(ls -A "$tmp")" ]]; then
    echo "::warning::$name: release $tag has no file matching $pattern; serving the committed copy."
    rm -rf "$tmp"
    continue
  fi

  file=$(ls "$tmp"/* | head -n1)
  if ! validate "$file"; then
    echo "::error::$name: $(basename "$file") from $tag is not a valid catalog."
    exit 1
  fi

  mkdir -p "$(dirname "$target")"
  mv "$file" "$target"
  rm -rf "$tmp"
  echo "$name: served $tag ($(basename "$pattern")) as /${target#"$DIST"/}"
done
