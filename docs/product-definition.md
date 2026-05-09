# CodeCraft Quest 第一版产品定义表

## 产品定位

CodeCraft Quest 是一款本地运行的儿童 AI 时代创造力训练工具。它用 2D 游戏闯关、图形化编程、规则型 AI 教练、英语词汇复现、家长后台和复盘记录，训练孩子的逻辑、编程、AI 协作、英语词汇、表达复盘和项目创造能力。

第一版不做开放世界，不做复杂 AI，不做联网社区。第一版只验证一个核心问题：

孩子是否愿意连续 3 天主动挑战，并能用自己的话讲清楚至少 3 个编程概念。

## 第一版范围

| 项目 | 内容 |
| --- | --- |
| 第一版用户 | 9 岁孩子，扩展到 8-12 岁小学生 |
| 第一版平台 | 本地电脑桌面软件 |
| 第一版技术 | React + TypeScript + Blockly + Phaser + SQLite + Electron |
| 第一版内容 | 5 个基础关卡 |
| 第一版目标 | 验证拖积木控制角色闯关的学习闭环是否成立 |
| 第一版成功标准 | 孩子完成 5 关，连续 3 天愿意继续，并能讲清楚顺序、循环、条件、变量中的至少 3 个概念 |

## 必须做

1. 本地桌面应用壳。
2. 关卡地图。
3. 一个可控制的小机器人角色。
4. 5 个基础积木：move、turn left、turn right、collect、repeat。
5. 5 个基础关卡。
6. 运行按钮。
7. 通关判断。
8. 规则型提示。
9. 本地保存进度。
10. 家长查看记录。

## 暂时不做

1. 不做 3D。
2. 不做开放世界。
3. 不做联网。
4. 不做商城。
5. 不做排行榜。
6. 不做复杂 AI Agent。
7. 不做语音识别。
8. 不做复杂皮肤系统。

## 核心学习闭环

```text
接任务 -> 拆问题 -> 拖积木 -> 控制角色 -> 调试
-> 看提示 -> 完成作品 -> 英语词汇复现 -> 向家长讲解
```

## 第一版页面

### 启动页

- 开始冒险
- 我的作品
- 今日任务
- 家长中心

### 冒险地图页

- 新手村
- 迷宫森林
- 金币矿洞
- AI 实验室
- 创造工坊

第一版只开放新手村中的 5 个基础关卡，其余区域可以显示为锁定状态。

### 关卡页

```text
------------------------------------------------
顶部：关卡名 | 星级 | 金币 | 今日时间
------------------------------------------------
左侧：游戏画面
右侧：积木编程区
------------------------------------------------
底部：任务目标 | 英语词 | 提示按钮 | 运行按钮
------------------------------------------------
```

### 通关页

- 通关反馈
- 获得金币
- 学会的积木
- 学会的英语词
- 复盘问题
- 保存作品

### 家长中心

- 今日学习时长
- 完成关卡
- 重试次数
- 提示次数
- 调试次数
- 复盘记录

## 第一版工程建议

```text
Electron
  -> React + TypeScript
  -> Blockly
  -> Phaser
  -> SQLite
  -> 规则型 AI 教练
```

第一版建议优先使用 Electron，而不是 Tauri。原因是资料更多、调试更快、Blockly 和 Phaser 的前端集成路径更直接。

## 第一版数据模型

### levels

```text
id
title
world
difficulty
goal
story
map_data
allowed_blocks
english_words
win_condition
hint_rules
reflection_questions
```

### learning_records

```text
id
user_id
level_id
start_time
end_time
duration
success
retry_count
hint_count
debug_count
stars
used_blocks
```

### projects

```text
id
user_id
title
level_id
block_code
screenshot_path
reflection_text
parent_comment
created_at
```

### vocabulary

```text
id
word
meaning
sentence
level_id
review_count
mastered
```

## 下一步

先完成 5 关详细关卡设计，再进入技术 Demo。技术 Demo 只需要证明：

1. 地图能显示。
2. Blockly 能拖积木。
3. 点击运行后机器人能按动作移动。
4. 能判断通关或失败。
5. 能记录一次学习结果。
