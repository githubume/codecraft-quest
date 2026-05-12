#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
publish_dir="$(mktemp -d)"

cleanup() {
  rm -rf "$publish_dir"
}
trap cleanup EXIT

cd "$repo_root"

if [ ! -d dist ]; then
  echo "dist 不存在，请先运行 npm run build"
  exit 1
fi

cp -R dist/. "$publish_dir/"

cd "$publish_dir"
git init
git checkout -b gh-pages
git config user.name "githubume"
git config user.email "49801092+githubume@users.noreply.github.com"
http_proxy_value="$(git -C "$repo_root" config --get http.proxy || true)"
https_proxy_value="$(git -C "$repo_root" config --get https.proxy || true)"
if [ -n "$http_proxy_value" ]; then
  git config http.proxy "$http_proxy_value"
fi
if [ -n "$https_proxy_value" ]; then
  git config https.proxy "$https_proxy_value"
fi
git add .
git commit -m "Deploy CodeCraft Quest"
git remote add origin https://github.com/githubume/codecraft-quest.git
git push --force origin gh-pages

echo "已发布到 https://githubume.github.io/codecraft-quest/"
