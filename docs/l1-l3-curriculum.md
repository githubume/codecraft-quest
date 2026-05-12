# CodeCraft Quest 现有 10 关之后的 L1-L3 课程设计

## 先对齐现状

当前游戏已经有 10 关，不再从零开始设计。

| 当前关卡 | 已覆盖能力 | 作用 |
| --- | --- | --- |
| 1 小机器人出发 | 顺序执行 | 会按步骤控制角色 |
| 2 转弯找到宝箱 | 方向控制 | 理解 turn 和 move 的区别 |
| 3 重复采矿 | 循环 | 初步使用 repeat |
| 4 怪物前方转向 | 条件判断 | 理解 if enemy ahead |
| 5 金币积分 | 变量/分数 | 理解 score |
| 6 钥匙开门 | 状态/门禁 | 理解 key 和 door |
| 7 陷阱小路 | 生命值 | 理解 health |
| 8 自动避墙迷宫 | 传感器判断 | 理解 if wall ahead |
| 9 金币与门的选择 | 多目标规划 | 同时处理 score、key、door |
| 10 综合挑战：基地救援 | 综合调试 | 把条件、状态、路径合在一起 |

所以后续 L1-L3 的定位不是“入门 1-3 级”，而是：

```text
现有 1-10 关 = 编程闯关基础
后续 L1 = 做出第一个小游戏机制
后续 L2 = 做出完整游戏规则
后续 L3 = 做出可展示项目
```

## 后续课程总结构

| 阶段 | 对应关卡 | 主题 | 核心目标 | 最终产出 |
| --- | --- | --- | --- | --- |
| L1 | 11-22 | 从闯关到小游戏机制 | 下落、碰撞、发射、克隆、广播 | 一个“收集 + 射击 + 敌人”的小游戏雏形 |
| L2 | 23-34 | 游戏规则系统 | 生命、得分、开始/结束、波次、技能 | 一个完整防守小游戏 |
| L3 | 35-46 | 项目化冒险 | 道具、NPC、随机、解谜、Boss、多结局 | 一个可向家长展示的冒险小游戏 |

## 设计原则

1. 不重复现有 1-10 关已经掌握的基础，而是把它们用在项目里。
2. 每一关新增一个机制，最终拼成完整项目。
3. 英语词必须绑定游戏动作，不做孤立背单词。
4. 每个阶段最后一关必须是项目整合和讲解。
5. AI 教练只提示观察方向，不代写答案。

## L1：小游戏机制训练营，关卡 11-22

目标：孩子已经会控制机器人走地图，L1 要让他开始做真正小游戏常见机制：下落物、碰撞、得分、敌人、子弹、克隆、广播。

### 11：Falling Energy

| 项目 | 内容 |
| --- | --- |
| 中文名 | 下落的能量球 |
| 编程点 | 坐标变化、自动下落 |
| 复用旧知识 | move、score |
| 新机制 | energy 从上方向下移动 |
| 可用积木 | spawn energy, change y, if bottom, reset |
| 英语词 | energy 能量, fall 下落, bottom 底部, reset 重置 |
| 通关目标 | 让 5 个 energy 从上方落下并重置 |
| 项目产出 | 下落物系统 |

AI 教练提示：

```text
energy 每次到 bottom 后，应该回到哪里重新开始？
```

### 12：Catch Energy

| 项目 | 内容 |
| --- | --- |
| 中文名 | 接住能量球 |
| 编程点 | 碰撞检测 |
| 新机制 | robot 接住 energy |
| 可用积木 | if touching, collect, change score |
| 英语词 | catch 接住, touch 碰到, collect 收集, score 分数 |
| 通关目标 | 接住 5 个 energy，score 达到 5 |
| 项目产出 | 接物品小游戏核心 |

### 13：Miss And Retry

| 项目 | 内容 |
| --- | --- |
| 中文名 | 漏接要重来 |
| 编程点 | 条件分支、失败反馈 |
| 新机制 | energy 掉到底部没有被接住会 miss +1 |
| 可用积木 | if bottom, change miss, reset |
| 英语词 | miss 漏掉, retry 重试, fail 失败 |
| 通关目标 | score 达到 5 且 miss 少于 3 |
| 项目产出 | 失败反馈系统 |

### 14：Enemy Walk

| 项目 | 内容 |
| --- | --- |
| 中文名 | 敌人巡逻 |
| 编程点 | 自动移动、边界判断 |
| 新机制 | enemy 左右巡逻 |
| 可用积木 | enemy move, if edge, turn around |
| 英语词 | enemy 敌人, patrol 巡逻, edge 边缘 |
| 通关目标 | enemy 能自动巡逻 10 秒 |
| 项目产出 | 敌人行为系统 |

### 15：Hit Danger

| 项目 | 内容 |
| --- | --- |
| 中文名 | 碰到敌人扣血 |
| 编程点 | 碰撞 + health 变量 |
| 复用旧知识 | health |
| 新机制 | robot touching enemy 后 health -1 |
| 可用积木 | if touching enemy, change health |
| 英语词 | hit 撞击, damage 伤害, health 生命 |
| 通关目标 | 躲开 enemy，坚持 20 秒 |
| 项目产出 | 伤害系统 |

### 16：Shoot Bullet

| 项目 | 内容 |
| --- | --- |
| 中文名 | 发射子弹 |
| 编程点 | 角色生成、方向运动 |
| 新机制 | bullet 从 robot 位置发射 |
| 可用积木 | shoot, spawn bullet, bullet move |
| 英语词 | shoot 发射, bullet 子弹, direction 方向 |
| 通关目标 | 子弹能向前飞出并消失 |
| 项目产出 | 射击系统 |

### 17：Bullet Hits Enemy

| 项目 | 内容 |
| --- | --- |
| 中文名 | 子弹击中敌人 |
| 编程点 | 双对象碰撞 |
| 新机制 | bullet touching enemy 后 enemy 消失、score +1 |
| 可用积木 | if bullet touching enemy, delete enemy, score +1 |
| 英语词 | hit 击中, delete 删除, destroy 消灭 |
| 通关目标 | 击中 3 个 enemy |
| 项目产出 | 战斗计分系统 |

### 18：Clone Enemies

| 项目 | 内容 |
| --- | --- |
| 中文名 | 生成敌人小队 |
| 编程点 | 克隆/批量生成 |
| 新机制 | 每隔一段时间 spawn enemy |
| 可用积木 | create clone, when clone starts, delete clone |
| 英语词 | clone 克隆, spawn 生成, wave 波次 |
| 通关目标 | 生成并消灭 5 个 enemy clone |
| 项目产出 | 敌人生成器 |

### 19：Broadcast Attack

| 项目 | 内容 |
| --- | --- |
| 中文名 | 广播攻击命令 |
| 编程点 | 事件通信 |
| 新机制 | 点击按钮 broadcast shoot，炮台 receive 后发射 |
| 可用积木 | broadcast, receive, shoot |
| 英语词 | broadcast 广播, receive 接收, message 消息 |
| 通关目标 | 用广播触发 3 次攻击 |
| 项目产出 | 角色通信系统 |

### 20：Power Freeze

| 项目 | 内容 |
| --- | --- |
| 中文名 | 冰冻技能 |
| 编程点 | 状态变量、计时 |
| 新机制 | enemy frozen 后暂停移动 3 秒 |
| 可用积木 | set frozen, wait, resume |
| 英语词 | freeze 冰冻, pause 暂停, resume 继续 |
| 通关目标 | 用 freeze 技能阻止 enemy 靠近 |
| 项目产出 | 技能状态系统 |

### 21：Level Builder

| 项目 | 内容 |
| --- | --- |
| 中文名 | 设计自己的小地图 |
| 编程点 | 规则设计 |
| 新机制 | 选择 wall、coin、enemy、goal 放入地图 |
| 可用积木 | place wall, place coin, place enemy, test level |
| 英语词 | build 建造, place 放置, test 测试 |
| 通关目标 | 自己设计一张能通关的地图 |
| 项目产出 | 第一张自制地图 |

### 22：L1 Project - Energy Defender

| 项目 | 内容 |
| --- | --- |
| 中文名 | 能量防守小游戏 |
| 编程点 | L1 综合 |
| 新机制 | 下落物、得分、敌人、子弹、克隆、广播合并 |
| 可用积木 | L1 全部积木 |
| 英语词 | game 游戏, rule 规则, win 胜利, explain 解释 |
| 通关目标 | 做出一个能玩 60 秒的小游戏 |
| 项目产出 | Energy Defender v1 |

复盘问题：

```text
你的游戏里有哪些 object？
哪个 object 负责 fall？哪个 object 负责 shoot？
你用了 clone 和 broadcast 做什么？
```

## L2：完整游戏规则训练营，关卡 23-34

目标：L1 做出了机制，L2 要把机制组合成真正游戏：开始界面、结束界面、生命值、波次、难度、奖励和大招。

| 关卡 | 名称 | 编程点 | 英语词 | 项目产出 |
| ---: | --- | --- | --- | --- |
| 23 | Start Screen | 场景/状态切换 | start screen, button, click | 开始界面 |
| 24 | Game Over | 失败条件 | game over, lose, restart | 结束界面 |
| 25 | Health UI | 状态可视化 | heart, health, display | 生命值 UI |
| 26 | Score Board | 计分板 | score, board, record | 得分面板 |
| 27 | Enemy Wave | 波次生成 | wave, level, speed | 敌人波次 |
| 28 | Difficulty Up | 难度递增 | difficulty, faster, harder | 速度递增 |
| 29 | Coin Shop | 资源消耗 | coin, cost, buy | 商店/购买 |
| 30 | Upgrade Shooter | 升级系统 | upgrade, power, cooldown | 炮台升级 |
| 31 | Full Screen Skill | 全局技能 | clear, all, power | 清屏技能 |
| 32 | Sound Feedback | 音效反馈 | sound, effect, feedback | 音效系统 |
| 33 | Rule Test | 测试规则 | test, bug, fix | 调试清单 |
| 34 | L2 Project - Defender 2.0 | L2 综合 | publish, version, improve | 完整防守小游戏 |

L2 项目验收标准：

```text
有开始界面
有游戏过程
有生命值和得分
有失败和胜利
有至少 2 种敌人或 2 种技能
孩子能讲清楚 3 条规则
```

## L3：项目化冒险训练营，关卡 35-46

目标：L3 从“防守小游戏”转为“冒险项目”，训练孩子做任务系统、道具系统、NPC、随机、解谜、Boss、多结局和作品发布。

| 关卡 | 名称 | 编程点 | 英语词 | 项目产出 |
| ---: | --- | --- | --- | --- |
| 35 | Backpack Items | 道具状态 | item, backpack, equip | 背包系统 |
| 36 | Random Drop | 随机生成 | random, drop, chance | 随机补给 |
| 37 | NPC Talk | 对话触发 | talk, ask, answer | NPC 对话 |
| 38 | Rescue Mission | 多目标任务 | rescue, task, finish | 营救任务 |
| 39 | Puzzle Order | 顺序解谜 | order, puzzle, secret | 机关谜题 |
| 40 | Light In Dark | 可见范围 | light, dark, visible | 黑暗探索 |
| 41 | Route Choice | 路线选择 | route, risk, choose | 多路线地图 |
| 42 | Boss Phase | 状态机 | boss, phase, rage | Boss 阶段 |
| 43 | Multiple Endings | 分支结果 | choice, result, ending | 多结局 |
| 44 | Project Polish | 优化调试 | debug, fix, improve | 可展示版本 |
| 45 | English Explain | 英语表达 | present, explain, project | 英语讲解卡 |
| 46 | L3 Project - My Adventure | L3 综合 | creator, publish, review | 冒险项目发布 |

L3 项目验收标准：

```text
有一个明确故事目标
至少 1 个 NPC
至少 3 个 item
至少 1 个 puzzle
至少 1 个 boss 或最终挑战
至少 2 个 ending 或评分结果
孩子能向家长讲解项目规则和代码逻辑
```

## 后续技术改造需求

为了支持第 11 关以后，当前引擎需要扩展这些能力：

| 能力 | 目前状态 | 需要新增 |
| --- | --- | --- |
| 多角色 | 目前主要是单 robot | object/entity 系统 |
| 动态对象 | 目前地图 tile 为主 | falling energy、bullet、enemy clone |
| 时间系统 | 目前一次性执行程序 | tick/update 循环 |
| 克隆 | 暂无 | spawn/delete entity |
| 广播 | 暂无 | message/event bus |
| UI 场景 | 目前 home/map/level | start/game over/project page |
| 项目保存 | 有学习记录 | 保存作品配置和规则 |

## 与英语学习的结合

每关只新增 3-5 个词，但必须在 4 个位置重复出现：

```text
积木名：shoot
对象名：bullet
任务句：Shoot the enemy.
复盘问句：When did you use shoot?
```

中文只做弱提示。英文必须是主要视觉层级。

## 结论

最新路线应该是：

```text
1-10 关：基础闯关，已经完成
11-22 关：小游戏机制，下一步开发
23-34 关：完整游戏规则
35-46 关：项目化冒险和作品发布
```

最现实的下一步不是继续写更多文档，而是先实现第 11-14 关所需的动态对象系统：

```text
energy fall
catch energy
enemy patrol
touching enemy
```
