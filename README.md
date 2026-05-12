# CodeCraft Quest

本地运行的儿童游戏化编程与 AI 协作训练 Demo。孩子通过拖放指令块控制机器人闯关，学习顺序执行、循环、条件判断、变量状态、英语词汇和调试复盘。

## 当前功能

- 10 个逐关解锁地图。
- 图形化指令块：移动、转向、循环、条件判断、收集、开门、生命值等。
- 机器人表情反馈：普通、通关笑脸、失败哭脸。
- 低音量背景音乐和游戏音效，可开关背景音乐。
- 英语词卡和过程英语提示。
- 本地学习记录和家长中心。

## 在线游玩

GitHub Pages 发布后，线上地址是：

```text
https://githubume.github.io/codecraft-quest/
```

以后更新代码后，在本地运行下面命令即可重新发布：

```bash
npm run deploy:pages
```

这个命令会构建网页，并把结果推送到 `gh-pages` 分支。

## 本地安装运行

需要先安装 Node.js。

```bash
npm install
npm start
```

浏览器会自动打开。也可以手动访问：

```text
http://127.0.0.1:5173/
```

macOS 也可以直接双击：

```text
scripts/start-game.command
```

## 构建发布版本

```bash
npm run build
npm run preview
```

## 上传到 GitHub

如果本机已经安装 Git，并且你已经在 GitHub 上创建了一个空仓库，例如：

```text
https://github.com/你的用户名/codecraft-quest.git
```

在项目目录执行：

```bash
git init
git add .
git commit -m "Initial CodeCraft Quest demo"
git branch -M main
git remote add origin https://github.com/你的用户名/codecraft-quest.git
git push -u origin main
```

如果 Git 提示没有配置用户名和邮箱，先执行：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 给别人玩

别人可以 clone 仓库后运行：

```bash
git clone https://github.com/你的用户名/codecraft-quest.git
cd codecraft-quest
npm install
npm start
```

浏览器会自动打开。也可以手动访问：

```text
http://127.0.0.1:5173/
```
