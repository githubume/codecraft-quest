#!/bin/zsh
set -e

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h}"

cd "$PROJECT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "没有找到 npm。请先安装 Node.js: https://nodejs.org/"
  read "reply?按回车关闭窗口..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "第一次运行，正在安装依赖..."
  npm install
fi

echo "正在启动 CodeCraft Quest..."
echo "浏览器会自动打开。如果没有自动打开，请访问终端里显示的 Local 地址。"
npm run dev:open -- --port 5173
