import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  Clock,
  Coins,
  Home,
  Lightbulb,
  ListRestart,
  Play,
  Plus,
  Trash2,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { levels } from "./data/levels";
import { calculateStars, initialState, runProgram } from "./game/engine";
import { clearRecords, getRecords, saveRecord } from "./services/progress";
import { playSound, startBackgroundMusic, stopBackgroundMusic } from "./services/sound";
import type { BlockCommand, BlockType, GameState, Level, LearningRecord, Tile } from "./types";

type Page = "home" | "map" | "level" | "parent";

const blockLabels: Record<BlockType, { en: string; zh: string }> = {
  move: { en: "move", zh: "移动" },
  turnLeft: { en: "turn left", zh: "左转" },
  turnRight: { en: "turn right", zh: "右转" },
  collect: { en: "collect", zh: "收集" },
  repeat: { en: "repeat", zh: "重复" },
  ifEnemyAhead: { en: "if enemy ahead", zh: "如果前方有敌人" },
  ifWallAhead: { en: "if wall ahead", zh: "如果前方有墙" },
  ifCoinHere: { en: "if coin here", zh: "如果这里有金币" },
  turnAround: { en: "turn around", zh: "掉头" },
  openDoor: { en: "open door", zh: "开门" },
  wait: { en: "wait", zh: "等待" },
  changeScore: { en: "score +1", zh: "分数加一" },
  changeHealth: { en: "health +1", zh: "生命加一" },
  fallEnergy: { en: "fall energy", zh: "能量下落" },
  catchEnergy: { en: "catch energy", zh: "接住能量" },
  resetEnergy: { en: "reset energy", zh: "重置能量" },
  patrolEnemy: { en: "patrol enemy", zh: "敌人巡逻" },
  ifTouchingEnemy: { en: "if touching enemy", zh: "如果碰到敌人" },
};

const tileLabels: Record<Tile, string> = {
  ".": "",
  W: "墙",
  T: "宝",
  G: "终",
  O: "矿",
  C: "币",
  E: "怪",
  K: "钥",
  D: "门",
  X: "陷",
  H: "血",
};

const tileWords: Partial<Record<Tile, string>> = {
  T: "treasure",
  G: "goal",
  O: "mine",
  C: "coin",
  E: "enemy",
  W: "wall",
  K: "key",
  D: "door",
  X: "trap",
  H: "health",
};

const actionWords: Record<BlockType, { word: string; meaning: string; prompt: string }> = {
  move: { word: "move", meaning: "移动", prompt: "move 让机器人沿当前方向前进一步。" },
  turnLeft: { word: "left", meaning: "左", prompt: "turn left 只改变朝向，不会移动格子。" },
  turnRight: { word: "right", meaning: "右", prompt: "turn right 只改变朝向，不会移动格子。" },
  collect: { word: "collect", meaning: "收集", prompt: "collect 要在矿石或金币格子上使用。" },
  repeat: { word: "repeat", meaning: "重复", prompt: "repeat 用来压缩重复的 move 和 collect。" },
  ifEnemyAhead: { word: "if", meaning: "如果", prompt: "if enemy ahead 会先观察前方，再决定是否转向。" },
  ifWallAhead: { word: "wall", meaning: "墙", prompt: "if wall ahead 会检查前方是否被挡住。" },
  ifCoinHere: { word: "coin", meaning: "金币", prompt: "if coin here 会在当前格有金币时收集并加分。" },
  turnAround: { word: "around", meaning: "掉头", prompt: "turn around 会让机器人转向相反方向。" },
  openDoor: { word: "open", meaning: "打开", prompt: "open door 需要先拥有 key，且门在前方。" },
  wait: { word: "wait", meaning: "等待", prompt: "wait 表示暂停一步，用来表达节奏和调试。" },
  changeScore: { word: "score", meaning: "分数", prompt: "change score 让分数发生变化。" },
  changeHealth: { word: "health", meaning: "生命值", prompt: "change health 用来恢复或改变生命状态。" },
  fallEnergy: { word: "fall", meaning: "下落", prompt: "fall energy 让能量球向 bottom 移动一步。" },
  catchEnergy: { word: "catch", meaning: "接住", prompt: "catch energy 只有在 robot touching energy 时才会加 score。" },
  resetEnergy: { word: "reset", meaning: "重置", prompt: "reset energy 把到底部的能量球送回 top。" },
  patrolEnemy: { word: "patrol", meaning: "巡逻", prompt: "patrol enemy 让敌人移动一步，遇到 edge 会 turn around。" },
  ifTouchingEnemy: { word: "touching", meaning: "碰到", prompt: "if touching enemy 会检查碰撞，碰到就 damage health。" },
};

function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [blocks, setBlocks] = useState<BlockCommand[]>([]);
  const [state, setState] = useState<GameState>(() => initialState(levels[0]));
  const [hintCount, setHintCount] = useState(0);
  const [debugCount, setDebugCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [recordsVersion, setRecordsVersion] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const level = levels.find((item) => item.id === selectedLevelId) ?? levels[0];
  const records = useMemo(() => getRecords(), [recordsVersion]);
  const completedLevels = new Set(records.filter((record) => record.success).map((record) => record.levelId));
  const unlockedLevel = Math.min(levels.length, Math.max(1, ...[...completedLevels].map((levelId) => levelId + 1)));

  const startMusicIfEnabled = () => {
    if (musicEnabled) startBackgroundMusic();
  };

  const toggleMusic = () => {
    if (musicEnabled) {
      stopBackgroundMusic();
      setMusicEnabled(false);
      return;
    }
    setMusicEnabled(true);
    startBackgroundMusic();
  };

  const enterLevel = (nextLevel: Level) => {
    startMusicIfEnabled();
    setSelectedLevelId(nextLevel.id);
    setBlocks([]);
    setState(initialState(nextLevel));
    setHintCount(0);
    setDebugCount(0);
    setRetryCount(0);
    setStartedAt(Date.now());
    setPage("level");
  };

  const addBlock = (type: BlockType) => {
    startMusicIfEnabled();
    playSound("add");
    setBlocks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type,
        count: type === "repeat" ? 4 : undefined,
      },
    ]);
  };

  const removeBlock = (id: string) => {
    playSound("remove");
    setBlocks((current) => current.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    playSound("add");
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const updateRepeat = (id: string, count: number) => {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, count } : block)));
  };

  const run = () => {
    startMusicIfEnabled();
    playSound("run");
    const nextState = runProgram(level, blocks);
    const stars = calculateStars(level, nextState, blocks);
    setState(nextState);
    setDebugCount((value) => value + 1);
    if (nextState.failed) setRetryCount((value) => value + 1);
    if (nextState.failed) playSound("fail");
    if (nextState.success) {
      playSound("success");
      const record: LearningRecord = {
        id: crypto.randomUUID(),
        levelId: level.id,
        levelTitle: level.title,
        success: true,
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        retryCount,
        hintCount,
        debugCount: debugCount + 1,
        stars,
        usedBlocks: [...new Set(blocks.map((block) => block.type))],
        createdAt: new Date().toISOString(),
      };
      saveRecord(record);
      setRecordsVersion((value) => value + 1);
    }
  };

  const reset = () => {
    startMusicIfEnabled();
    playSound("reset");
    setBlocks([]);
    setState(initialState(level));
    setRetryCount((value) => value + 1);
  };

  const showHint = () => {
    startMusicIfEnabled();
    playSound("hint");
    setHintCount((value) => value + 1);
    const firstHint = Object.values(level.hints)[Math.min(hintCount, Object.values(level.hints).length - 1)];
    setState((current) => ({ ...current, message: firstHint }));
  };

  return (
    <main className="app-shell">
      {page === "home" && <HomePage onStart={() => { startMusicIfEnabled(); setPage("map"); }} onParent={() => setPage("parent")} records={records} />}
      {page === "map" && <MapPage onBack={() => setPage("home")} onOpenLevel={enterLevel} unlockedLevel={unlockedLevel} />}
      {page === "level" && (
        <LevelPage
          blocks={blocks}
          hintCount={hintCount}
          level={level}
          onAddBlock={addBlock}
          onBack={() => setPage("map")}
          onHint={showHint}
          onMoveBlock={moveBlock}
          onRemoveBlock={removeBlock}
          onReset={reset}
          onRun={run}
          onUpdateRepeat={updateRepeat}
          debugCount={debugCount}
          musicEnabled={musicEnabled}
          onToggleMusic={toggleMusic}
          retryCount={retryCount}
          state={state}
        />
      )}
      {page === "parent" && (
        <ParentPage
          onBack={() => setPage("home")}
          records={records}
          onClear={() => {
            clearRecords();
            setRecordsVersion((value) => value + 1);
          }}
        />
      )}
    </main>
  );
}

function HomePage({ onStart, onParent, records }: { onStart: () => void; onParent: () => void; records: LearningRecord[] }) {
  const completed = new Set(records.filter((record) => record.success).map((record) => record.levelId)).size;
  return (
    <section className="home-page">
      <div className="topbar">
        <div className="brand-mark">CQ</div>
        <div>
          <h1>CodeCraft Quest</h1>
          <p>本地化儿童 AI 时代创造力训练工具</p>
        </div>
      </div>
      <div className="home-layout">
        <div className="hero-panel">
          <p className="eyebrow">今日任务</p>
          <h2>挑战 14 张编程任务地图</h2>
          <p>拖动指令块，控制角色移动、转向、开门、避险、收集和调试。第 11 关以后开始加入能量下落、接住得分、敌人巡逻和动态碰撞。</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              <Play size={18} /> 开始冒险
            </button>
            <button className="secondary-button" onClick={onParent}>
              <Users size={18} /> 家长中心
            </button>
          </div>
        </div>
        <div className="status-grid">
          <Metric icon={<Trophy />} label="已完成关卡" value={`${completed}/${levels.length}`} />
          <Metric icon={<Clock />} label="学习记录" value={`${records.length} 次`} />
          <Metric icon={<Brain />} label="当前能力" value="循环/条件/状态" />
          <Metric icon={<Coins />} label="本地保存" value="localStorage" />
        </div>
      </div>
    </section>
  );
}

function MapPage({
  onBack,
  onOpenLevel,
  unlockedLevel,
}: {
  onBack: () => void;
  onOpenLevel: (level: Level) => void;
  unlockedLevel: number;
}) {
  return (
    <section className="page">
      <Header title="冒险地图" subtitle="逐关解锁，后续关卡从闯关进入小游戏机制" onBack={onBack} />
      <div className="map-grid">
        {levels.map((level) => {
          const locked = level.id > unlockedLevel;
          return (
            <button className={`level-card ${locked ? "locked" : ""}`} key={level.id} onClick={() => !locked && onOpenLevel(level)}>
              <span className="level-index">关卡 {level.id}</span>
              <h2>{level.title}</h2>
              <p>{level.concept}</p>
              <small>{locked ? "完成前一关解锁" : level.world}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LevelPage({
  blocks,
  hintCount,
  level,
  onAddBlock,
  onBack,
  onHint,
  onMoveBlock,
  onRemoveBlock,
  onReset,
  onRun,
  onUpdateRepeat,
  debugCount,
  musicEnabled,
  onToggleMusic,
  retryCount,
  state,
}: {
  blocks: BlockCommand[];
  hintCount: number;
  level: Level;
  onAddBlock: (type: BlockType) => void;
  onBack: () => void;
  onHint: () => void;
  onMoveBlock: (id: string, direction: -1 | 1) => void;
  onRemoveBlock: (id: string) => void;
  onReset: () => void;
  onRun: () => void;
  onUpdateRepeat: (id: string, count: number) => void;
  debugCount: number;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  retryCount: number;
  state: GameState;
}) {
  const usedBlocks = new Set(blocks.map((block) => block.type));
  return (
    <section className="level-page">
      <Header title={level.title} subtitle={`${level.world} / ${level.concept}`} onBack={onBack} />
      <div className="workbench">
        <div className="game-section">
          <MissionPanel level={level} />
          <GamePlayArea blocks={blocks} level={level} state={state} />
          {state.success && <PassPanel level={level} />}
        </div>
        <div className="program-section">
          <section className="toolbox">
            <h2>可用积木</h2>
            <div className="block-palette">
              {level.allowedBlocks.map((block) => (
                <button className="block-button" key={block} onClick={() => onAddBlock(block)}>
                  <Plus size={14} /> <BilingualLabel en={blockLabels[block].en} zh={blockLabels[block].zh} />
                </button>
              ))}
            </div>
          </section>
          <section className="workspace">
            <h2>我的程序</h2>
            <div className="command-list">
              {blocks.length === 0 && <p className="empty-workspace">从上方选择积木，拼出机器人动作。</p>}
              {blocks.map((block, index) => (
                <div className="command-block" key={block.id}>
                  <span className="command-label">
                    <b>{index + 1}.</b> <BilingualLabel en={blockLabels[block.type].en} zh={blockLabels[block.type].zh} />
                  </span>
                  <div className="command-controls">
                    <button aria-label="上移积木" className="mini-button" disabled={index === 0} onClick={() => onMoveBlock(block.id, -1)}>
                      ↑
                    </button>
                    <button aria-label="下移积木" className="mini-button" disabled={index === blocks.length - 1} onClick={() => onMoveBlock(block.id, 1)}>
                      ↓
                    </button>
                  </div>
                  {block.type === "repeat" && (
                    <input
                      aria-label="repeat count"
                      max={8}
                      min={1}
                      type="number"
                      value={block.count ?? 2}
                      onChange={(event) => onUpdateRepeat(block.id, Number(event.target.value))}
                    />
                  )}
                  <button aria-label="删除积木" className="icon-button" onClick={() => onRemoveBlock(block.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="run-actions">
              <button className="secondary-button" onClick={onHint}>
                <Lightbulb size={18} /> 提示一下
              </button>
              <button className="secondary-button" onClick={onReset}>
                <ListRestart size={18} /> 重置
              </button>
              <button className="primary-button" onClick={onRun}>
                <Play size={18} /> 运行
              </button>
            </div>
          </section>
          <section className="words-panel">
            <h2>英语词卡</h2>
            <div className="word-list">
              {level.vocabulary.map((item) => (
                <div className={`word-card ${isWordUsed(item.word, usedBlocks) ? "active" : ""}`} key={item.word}>
                  <BilingualLabel en={item.word} zh={item.meaning} />
                  <small>{item.sentence}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="level-footer-stats">
        <span>目标：{level.goal}</span>
        <span>提示 {hintCount}</span>
        <span>重置/重试 {retryCount}</span>
        <span>调试 {debugCount}</span>
        <span>Score {state.score}</span>
        <span>Key {state.keys}</span>
        <span>Health {state.health}</span>
        <span>Catch {state.catches}</span>
        <span>Miss {state.misses}</span>
        <span>Reset {state.resets}</span>
        <span>Patrol {state.patrols}</span>
        <button className="music-toggle" onClick={onToggleMusic}>
          {musicEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {musicEnabled ? "背景音乐开" : "背景音乐关"}
        </button>
      </div>
    </section>
  );
}

function MissionPanel({ level }: { level: Level }) {
  return (
    <section className="mission-panel">
      <h2>任务故事</h2>
      <p>{level.story}</p>
      <div className="mission-words">
        {level.vocabulary.map((item) => (
          <span key={item.word}>
            <BilingualLabel en={item.word} zh={item.meaning} />
          </span>
        ))}
      </div>
    </section>
  );
}

function ProcessWords({ blocks, state }: { blocks: BlockCommand[]; state: GameState }) {
  const latestBlock = blocks.at(-1);
  const word = latestBlock ? actionWords[latestBlock.type] : undefined;
  return (
    <section className="process-panel">
      <div>
        <h2>过程英语</h2>
        <p>{word ? word.prompt : "添加积木时，这里会解释当前动作的英文词。"}</p>
      </div>
      <div className="trace-list">
        {state.trace.length === 0 ? (
          <span>运行后显示动作记录</span>
        ) : (
          state.trace.slice(-5).map((item, index) => <span key={`${item}-${index}`}>{translateTrace(item)}</span>)
        )}
      </div>
    </section>
  );
}

function GamePlayArea({ blocks, level, state }: { blocks: BlockCommand[]; level: Level; state: GameState }) {
  return (
    <div className="game-play-area">
      <aside className="side-feedback">
        <div className={`message-box ${state.success ? "success" : state.failed ? "danger" : ""}`}>{state.message}</div>
        <ProcessWords blocks={blocks} state={state} />
      </aside>
      <GameBoard level={level} state={state} />
    </div>
  );
}

function GameBoard({ level, state }: { level: Level; state: GameState }) {
  return (
    <div className="board" aria-label="游戏地图" style={{ gridTemplateColumns: `repeat(${level.grid[0]?.length ?? 5}, 1fr)` }}>
      {level.grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const hasRobot = rowIndex === state.row && colIndex === state.col;
          const collected = state.collected.includes(`${rowIndex}:${colIndex}`);
          const entities = state.entities.filter((entity) => entity.row === rowIndex && entity.col === colIndex);
          return (
            <div className={`tile tile-${tile} ${collected ? "collected" : ""}`} key={`${rowIndex}-${colIndex}`}>
              {hasRobot ? (
                <div className="tile-stack">
                  <Robot direction={state.direction} mood={state.success ? "happy" : state.failed ? "sad" : "ready"} />
                  {entities.map((entity) => <EntitySprite entity={entity} key={entity.id} />)}
                </div>
              ) : entities.length > 0 ? (
                <div className="tile-stack">
                  {entities.map((entity) => <EntitySprite entity={entity} key={entity.id} />)}
                </div>
              ) : collected ? (
                ""
              ) : (
                <span className="tile-content">
                  <strong>{tileWords[tile] ?? tileLabels[tile]}</strong>
                  {tileWords[tile] && <small>{tileLabels[tile]}</small>}
                </span>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

function isWordUsed(word: string, usedBlocks: Set<BlockType>) {
  return [...usedBlocks].some((block) => actionWords[block].word === word || blockLabels[block].en.includes(word));
}

function BilingualLabel({ en, zh }: { en: string; zh: string }) {
  return (
    <span className="bilingual-label">
      <span className="bilingual-en">{en}</span>
      <span className="bilingual-zh">{zh}</span>
    </span>
  );
}

function translateTrace(item: string) {
  if (item === "move") return "move 移动";
  if (item === "turn left") return "turn left 左转";
  if (item === "turn right") return "turn right 右转";
  if (item === "turn around") return "turn around 掉头";
  if (item === "score +1") return "score +1 分数加一";
  if (item === "health +1") return "health +1 生命加一";
  if (item === "wait") return "wait 等待";
  if (item === "open door") return "open door 开门";
  if (item === "fall energy") return "fall energy 能量下落";
  if (item === "reset energy") return "reset energy 重置能量";
  if (item === "catch energy score +1") return "catch energy 得分";
  if (item === "catch energy -> no touch") return "catch energy 没碰到";
  if (item === "energy bottom miss +1") return "bottom miss 漏接";
  if (item === "patrol enemy") return "patrol enemy 巡逻";
  if (item === "enemy edge turn around") return "edge turn around 边缘掉头";
  if (item.includes("touching enemy")) return item.replace("touching enemy", "touching enemy 碰到敌人");
  if (item.includes("wall ahead")) return item.replace("if wall ahead", "if wall ahead 如果前方有墙");
  if (item.includes("coin here")) return item.replace("if coin here", "if coin here 如果这里有金币");
  if (item.includes("trap")) return "trap health -1 陷阱扣生命";
  if (item.startsWith("collect")) return item.replace("collect", "collect 收集");
  if (item.startsWith("if enemy")) return item.replace("if enemy ahead", "if enemy ahead 如果前方有敌人");
  return item;
}

function EntitySprite({ entity }: { entity: GameState["entities"][number] }) {
  if (entity.type === "energy") {
    return (
      <div className="entity energy-entity" aria-label="energy">
        <strong>energy</strong>
        <small>能量</small>
      </div>
    );
  }
  return (
    <div className={`entity enemy-entity enemy-${entity.direction ?? "right"}`} aria-label="patrol enemy">
      <strong>enemy</strong>
      <small>巡逻</small>
    </div>
  );
}

function Robot({ direction, mood }: { direction: GameState["direction"]; mood: "ready" | "happy" | "sad" }) {
  return (
    <div className={`robot player player-${direction} player-${mood}`} aria-label={`player ${mood} facing ${direction}`}>
      <div className="player-arrow" />
      <div className="player-head">
        <span className="player-eye" />
        <span className="player-eye" />
        <span className="player-mouth" />
        {mood === "sad" && <span className="player-tear" />}
      </div>
      <div className="player-body">
        <span className="player-pack" />
      </div>
      <div className="player-arms">
        <span />
        <span />
      </div>
    </div>
  );
}

function PassPanel({ level }: { level: Level }) {
  return (
    <div className="pass-panel">
      <h2>通关复盘</h2>
      {level.reflectionQuestions.map((question) => (
        <p key={question}>{question}</p>
      ))}
    </div>
  );
}

function ParentPage({ onBack, onClear, records }: { onBack: () => void; onClear: () => void; records: LearningRecord[] }) {
  const completed = new Set(records.filter((record) => record.success).map((record) => record.levelId)).size;
  const hints = records.reduce((sum, record) => sum + record.hintCount, 0);
  const debugs = records.reduce((sum, record) => sum + record.debugCount, 0);
  const duration = records.reduce((sum, record) => sum + record.durationSeconds, 0);
  return (
    <section className="page">
      <Header title="家长中心" subtitle="第一版只显示关键学习数据" onBack={onBack} />
      <div className="status-grid parent">
        <Metric icon={<Clock />} label="累计学习" value={`${Math.round(duration / 60)} 分钟`} />
        <Metric icon={<Trophy />} label="完成关卡" value={`${completed}/${levels.length}`} />
        <Metric icon={<Lightbulb />} label="提示次数" value={`${hints}`} />
        <Metric icon={<Brain />} label="调试次数" value={`${debugs}`} />
      </div>
      <div className="records-panel">
        <div className="records-header">
          <h2>学习记录</h2>
          <button className="secondary-button compact" onClick={onClear}>
            <Trash2 size={16} /> 清空
          </button>
        </div>
        {records.length === 0 ? (
          <p className="empty-workspace">还没有学习记录。</p>
        ) : (
          <div className="record-list">
            {records.map((record) => (
              <div className="record-row" key={record.id}>
                <strong>{record.levelTitle}</strong>
                <span>{record.stars} 星</span>
                <span>提示 {record.hintCount}</span>
                <span>调试 {record.debugCount}</span>
                <small>{new Date(record.createdAt).toLocaleString("zh-CN")}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Header({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <header className="section-header">
      <button className="icon-button" onClick={onBack} aria-label="返回">
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
