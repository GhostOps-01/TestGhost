#!/usr/bin/env bash
set -euo pipefail

# --- Settings ---
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
PAGES_DIR="${PAGES_DIR:-docs}"                 # GitHub Pages serves from main:/docs
MSG="${1:-Deploy: site updates}"               # Commit message (first arg)

# --- Sanity checks ---
if [ ! -d ".git" ]; then
  echo "Not in a git repo. cd to your repo root and try again." >&2
  exit 1
fi
if [ ! -f "$PAGES_DIR/index.html" ]; then
  echo "Expected $PAGES_DIR/index.html (Pages is set to /docs). Adjust PAGES_DIR if needed." >&2
  exit 1
fi

# --- Stage everything (quietly) ---
# Silence the 'ignored by .gitignore' noise via a one-off config on this command
git -c advice.addIgnoredFile=false add --all -- ':!*.DS_Store'

# Exit early if nothing changed
if git diff --cached --quiet; then
  echo "ℹ️  No changes to commit. (Working tree is clean.)"
  exit 0
fi

# --- Commit & push ---
git commit -m "$MSG" || true
if git push -u origin "$BRANCH"; then
  # Build a nice confirmation with URLs
  ORIGIN_URL="$(git remote get-url origin 2>/dev/null || echo "")"
  # Normalize to https://github.com/<user>/<repo>
  if [[ "$ORIGIN_URL" =~ ^git@github\.com:(.+)/(.+)\.git$ ]]; then
    GH_HTTP="https://github.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
  elif [[ "$ORIGIN_URL" =~ ^https://github\.com/(.+)/(.+)(\.git)?$ ]]; then
    GH_HTTP="https://github.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
  else
    GH_HTTP="$ORIGIN_URL"
  fi

  LAST_HASH="$(git rev-parse --short HEAD)"
  LAST_MSG="$(git log -1 --pretty=%s)"

  echo "✅ Successfully pushed to origin/$BRANCH"
  echo "   Latest commit: $LAST_HASH  $LAST_MSG"
  if [[ "$GH_HTTP" == https://github.com/*/* ]]; then
    echo "   Commits: $GH_HTTP/commits/$BRANCH"
    echo "   Actions: $GH_HTTP/actions"
    echo "   Pages  : Check your repo Settings → Pages (builds from $BRANCH/$PAGES_DIR)"
  fi
else
  echo "❌ Push failed. Check your network/credentials or branch setup." >&2
  exit 1
fi