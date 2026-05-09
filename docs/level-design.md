# CodeCraft Quest 第一版 5 关详细设计

## 地图符号

| 符号 | 含义 |
| --- | --- |
| S | 起点 start |
| R | 机器人 robot |
| T | 宝箱 treasure |
| G | 目标 goal |
| W | 墙 wall |
| O | 矿石 ore |
| C | 金币 coin |
| E | 怪物 enemy |
| . | 可通行地面 |

地图使用 5x5 网格。第一版尽量保持小地图，减少孩子的空间负担。

## 关卡 1：小机器人出发

### 核心概念

顺序执行：程序会按照积木从上到下依次运行。

### 故事

小机器人第一次醒来，看见前方有一个能量宝箱。请你帮它一步一步走过去。

### 地图

```text
R . . T .
. . . . .
. . . . .
. . . . .
. . . . .
```

### 初始状态

- 机器人位置：第 1 行第 1 列。
- 机器人朝向：右。
- 宝箱位置：第 1 行第 4 列。

### 可用积木

- start
- move

### 推荐解法

```text
start
move
move
move
```

### 通关条件

机器人到达宝箱位置。

### 失败条件

- 动作执行完后没有到达宝箱。
- 后续版本可加入步数上限，第一版暂不限制。

### 规则型提示

| 触发情况 | 提示 |
| --- | --- |
| 没有放 move | 机器人还没有收到移动指令，你可以试试 move。 |
| move 次数不够 | 机器人离宝箱还差几步，数一数中间有几个格子。 |
| move 太多 | 机器人已经走过宝箱了，试着少放一个 move。 |

### 英语词

| 单词 | 中文 | 例句 |
| --- | --- | --- |
| start | 开始 | Press start to run your code. |
| move | 移动 | Move the robot to the treasure. |
| goal | 目标 | The goal is to reach the treasure. |

### 通关复盘问题

1. 你用了几个 move？
2. 机器人为什么会按顺序走？
3. 如果宝箱远一点，你要改哪里？

### 家长观察点

- 孩子是否能数清楚步数。
- 孩子是否理解积木顺序会影响执行结果。

## 关卡 2：转弯找到宝箱

### 核心概念

方向控制：机器人有朝向，turn 会改变朝向，move 会沿当前朝向前进。

### 故事

宝箱藏在拐角后面。小机器人不能斜着走，它需要先前进，再转弯。

### 地图

```text
R . . . .
W W . W .
. . . W .
. W . W .
. . T . .
```

### 初始状态

- 机器人位置：第 1 行第 1 列。
- 机器人朝向：右。
- 宝箱位置：第 5 行第 3 列。

### 可用积木

- start
- move
- turn left
- turn right

### 推荐解法

```text
start
move
move
turn right
move
move
move
move
```

### 通关条件

机器人到达宝箱位置。

### 失败条件

- 撞墙。
- 走出地图。
- 动作执行完后没有到达宝箱。

### 规则型提示

| 触发情况 | 提示 |
| --- | --- |
| 撞墙 | 前面有墙时不能继续 move，先想想要不要 turn。 |
| 方向错误 | turn 只改变方向，不会移动位置。转完之后还需要 move。 |
| 路线偏离 | 先用手指在地图上走一遍路线，再把路线变成积木。 |

### 英语词

| 单词 | 中文 | 例句 |
| --- | --- | --- |
| turn | 转向 | Turn before you hit the wall. |
| left | 左 | Turn left to face a new path. |
| right | 右 | Turn right at the corner. |

### 通关复盘问题

1. turn 和 move 有什么不同？
2. 你在哪里用了 turn right？
3. 如果机器人一开始朝下，你的积木要怎么改？

### 家长观察点

- 孩子是否理解朝向。
- 孩子是否能把地图路径翻译成动作序列。

## 关卡 3：重复采矿

### 核心概念

循环：重复出现的动作可以用 repeat 表达。

### 故事

矿洞里排着 5 块矿石。小机器人要把它们全部采集回来。如果每一步都重复写，会很长。试试用 repeat。

### 地图

```text
R O O O O
. . . . O
. . . . .
. . . . .
. . . . .
```

### 初始状态

- 机器人位置：第 1 行第 1 列。
- 机器人朝向：右。
- 矿石位置：第 1 行第 2-5 列、第 2 行第 5 列。

### 可用积木

- start
- move
- collect
- repeat
- turn left
- turn right

### 推荐解法

```text
start
repeat 4 times:
  move
  collect
turn right
move
collect
```

### 通关条件

收集全部 5 块矿石。

### 失败条件

- 矿石没有收集完。
- 撞墙或走出地图。

### 星级评价

| 星级 | 条件 |
| --- | --- |
| 1 星 | 收集全部矿石 |
| 2 星 | 使用 repeat |
| 3 星 | 使用 repeat 且总积木数量不超过 7 个 |

### 规则型提示

| 触发情况 | 提示 |
| --- | --- |
| 没有使用 repeat | 你有没有发现 move 和 collect 重复出现了？重复的动作可以放进 repeat。 |
| collect 漏掉 | 走到矿石上不等于采集，还需要 collect。 |
| repeat 次数错误 | 数一数横排有几块矿石，再决定 repeat 几次。 |

### 英语词

| 单词 | 中文 | 例句 |
| --- | --- | --- |
| repeat | 重复 | Repeat the same actions. |
| collect | 收集 | Collect all the ores. |
| mine | 矿石 | The mine has five ores. |

### 通关复盘问题

1. 哪些动作是重复的？
2. repeat 帮你少写了什么？
3. 如果有 8 块矿石，repeat 次数要怎么改？

### 家长观察点

- 孩子是否能发现重复模式。
- 孩子是否只是通关，还是能主动优化积木数量。

## 关卡 4：躲开怪物

### 核心概念

条件判断：如果前方有危险，就换一种动作。

### 故事

路上出现了巡逻怪物。小机器人不能撞上怪物，它需要在危险前转向。

### 地图

```text
R . E . .
W . W . .
W . . . G
W W W . W
. . . . .
```

### 初始状态

- 机器人位置：第 1 行第 1 列。
- 机器人朝向：右。
- 怪物位置：第 1 行第 3 列。
- 目标位置：第 3 行第 5 列。

### 可用积木

- start
- move
- turn left
- turn right
- if enemy ahead

### 推荐解法

```text
start
move
if enemy ahead:
  turn right
move
move
turn left
move
move
move
```

### 通关条件

机器人到达目标点，并且没有碰到怪物。

### 失败条件

- 碰到怪物。
- 撞墙。
- 走出地图。
- 动作执行完后没有到达目标。

### 规则型提示

| 触发情况 | 提示 |
| --- | --- |
| 碰到怪物 | 前面有 enemy 的时候，不能直接 move。你可以用 if enemy ahead。 |
| if 里面为空 | if 只是判断，里面还要放一个真正要做的动作。 |
| 提前转向 | 条件判断要放在快遇到怪物的位置，不一定一开始就用。 |

### 英语词

| 单词 | 中文 | 例句 |
| --- | --- | --- |
| if | 如果 | If there is an enemy, turn. |
| enemy | 敌人 | Avoid the enemy. |
| avoid | 避开 | Avoid danger and reach the goal. |

### 通关复盘问题

1. if 是用来做什么的？
2. 你是怎么发现怪物危险的？
3. 如果怪物换到别的位置，程序还能不能用？

### 家长观察点

- 孩子是否理解 if 是判断，不是动作本身。
- 孩子是否能解释“如果发生 A，就做 B”。

## 关卡 5：金币积分

### 核心概念

变量和状态：score 会随着收集金币而变化。

### 故事

小机器人进入金币矿洞。每收集一个金币，score 就会加 1。请让 score 达到 5。

### 地图

```text
R C C . .
. W C W .
. W C W .
. . C . G
. . . . .
```

### 初始状态

- 机器人位置：第 1 行第 1 列。
- 机器人朝向：右。
- 金币位置：第 1 行第 2-3 列、第 2 行第 3 列、第 3 行第 3 列、第 4 行第 3 列。
- 目标位置：第 4 行第 5 列。
- 初始 score：0。

### 可用积木

- start
- move
- turn left
- turn right
- collect
- change score by 1

### 推荐解法

```text
start
move
collect
change score by 1
move
collect
change score by 1
turn right
move
collect
change score by 1
move
collect
change score by 1
move
collect
change score by 1
turn left
move
move
```

### 通关条件

- score >= 5。
- 机器人到达目标点。

### 失败条件

- score 小于 5。
- 没有到达目标点。
- 撞墙或走出地图。

### 星级评价

| 星级 | 条件 |
| --- | --- |
| 1 星 | 到达目标点 |
| 2 星 | score >= 5 |
| 3 星 | score >= 5 且没有多余 collect |

### 规则型提示

| 触发情况 | 提示 |
| --- | --- |
| 走到金币但没加分 | collect 负责收集金币，change score 负责改变分数。两个都要考虑。 |
| score 不够 | 看看地图上还有没有漏掉的 coin。 |
| 多次 collect 同一金币 | 同一个 coin 只能收集一次，收集后它就不在地图上了。 |

### 英语词

| 单词 | 中文 | 例句 |
| --- | --- | --- |
| score | 分数 | Your score goes up. |
| coin | 金币 | Collect each coin. |
| collect | 收集 | Collect coins to get points. |

### 通关复盘问题

1. score 一开始是多少？
2. 每收集一个 coin，score 发生了什么变化？
3. score 和 coin 有什么不同？

### 家长观察点

- 孩子是否理解 score 是会变化的数字。
- 孩子是否能解释“收集金币”和“分数增加”不是同一件事。

## 第一版提示系统规则

规则型 AI 教练不直接给完整答案，只按错误类型给方向。

| 错误类型 | 提示原则 |
| --- | --- |
| 撞墙 | 提醒观察前方和转向 |
| 步数不足 | 提醒数格子 |
| 步数过多 | 提醒比较终点位置 |
| 忘记 collect | 提醒走到物品上不等于收集 |
| 没有使用 repeat | 提醒发现重复模式 |
| if 为空 | 提醒判断后还需要动作 |
| score 不够 | 提醒检查金币和分数变化 |

## 第一版通用记录字段

每关结束后保存：

```json
{
  "levelId": 1,
  "success": true,
  "durationSeconds": 180,
  "retryCount": 2,
  "hintCount": 1,
  "debugCount": 3,
  "stars": 2,
  "usedBlocks": ["move", "turnRight"],
  "reflectionText": "我学会了机器人会按顺序执行 move。"
}
```

## 第一版工程验收标准

1. 5 个关卡都可以从地图页进入。
2. 每关只显示当前允许的积木。
3. 点击运行后，机器人按动作队列移动。
4. 碰墙、出界、碰怪物能触发失败。
5. 通关后能显示英语词和复盘问题。
6. 每次运行、提示和通关结果能写入本地记录。
