#!/usr/bin/env bash
set -euo pipefail

# --- Settings ---
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
PAGES_DIR="${PAGES_DIR:-docs}"     # GitHub Pages is configured for main /docs
MSG="${1:-Deploy: site updates}"   # Optional commit message arg

# --- Sanity checks ---
if [ ! -d ".git" ]; then
  echo "Not in a git repo. cd to your repo root and try again." >&2
  exit 1
fi

if [ ! -f "$PAGES_DIR/index.html" ]; then
  echo "Expected $PAGES_DIR/index.html (Pages is set to /docs). Adjust PAGES_DIR if needed." >&2
  exit 1
fi

# --- Stage everything except macOS junk ---
git add --all -- ':!*.DS_Store'

# If nothing to commit, exit gracefully
if git diff --cached --quiet; then
  echo "No changes to commit. (Everything already up to date.)"
  exit 0
fi

# --- Commit and push ---
git commit -m "$MSG" || true
git push origin "$BRANCH"

echo "✅ Pushed to $BRANCH. GitHub Pages will redeploy from $BRANCH/$PAGES_DIR shortly."