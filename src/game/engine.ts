import type { BlockCommand, Direction, DynamicEntity, GameState, Level, Tile } from "../types";

const deltas: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
};

const leftTurn: Record<Direction, Direction> = {
  up: "left",
  left: "down",
  down: "right",
  right: "up",
};

const rightTurn: Record<Direction, Direction> = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
};

export function initialState(level: Level): GameState {
  return {
    row: level.robot.row,
    col: level.robot.col,
    direction: level.robot.direction,
    score: 0,
    keys: 0,
    health: 3,
    catches: 0,
    misses: 0,
    resets: 0,
    patrols: 0,
    ticks: 0,
    collected: [],
    opened: [],
    entities: (level.entities ?? []).map((entity) => ({ ...entity })),
    failed: false,
    success: false,
    message: "准备运行。",
    trace: [],
  };
}

export function runProgram(level: Level, blocks: BlockCommand[]): GameState {
  const state = initialState(level);
  const expanded = expandBlocks(blocks);

  if (expanded.length === 0) {
    return { ...state, message: level.hints.empty ?? "先放入一个积木。" };
  }

  for (const block of expanded) {
    if (state.failed) break;
    executeBlock(level, state, block);
  }

  if (!state.failed) {
    state.success = checkWin(level, state);
    state.message = state.success ? "通关成功！" : "还没有达成目标，再调试一次。";
  }

  return state;
}

function expandBlocks(blocks: BlockCommand[]): BlockCommand[] {
  const expanded: BlockCommand[] = [];
  for (const block of blocks) {
    if (block.type === "repeat") {
      const count = block.count ?? 2;
      const previous = expanded.at(-1);
      if (previous && previous.type !== "repeat") {
        for (let i = 0; i < count; i += 1) {
          expanded.push({ id: `${block.id}-${i}-${previous.type}`, type: previous.type });
        }
      } else {
        for (let i = 0; i < count; i += 1) {
          expanded.push({ id: `${block.id}-${i}-move`, type: "move" });
          expanded.push({ id: `${block.id}-${i}-collect`, type: "collect" });
        }
      }
    } else {
      expanded.push(block);
    }
  }
  return expanded;
}

function executeBlock(level: Level, state: GameState, block: BlockCommand) {
  switch (block.type) {
    case "move":
      move(level, state);
      break;
    case "turnLeft":
      state.direction = leftTurn[state.direction];
      state.trace.push("turn left");
      break;
    case "turnRight":
      state.direction = rightTurn[state.direction];
      state.trace.push("turn right");
      break;
    case "turnAround":
      state.direction = rightTurn[rightTurn[state.direction]];
      state.trace.push("turn around");
      break;
    case "collect":
      collect(level, state);
      break;
    case "changeScore":
      state.score += 1;
      state.trace.push("score +1");
      break;
    case "changeHealth":
      state.health += 1;
      state.trace.push("health +1");
      break;
    case "fallEnergy":
      fallEnergy(level, state);
      break;
    case "catchEnergy":
      catchEnergy(state);
      break;
    case "resetEnergy":
      resetBottomEnergy(level, state);
      break;
    case "patrolEnemy":
      patrolEnemies(level, state);
      break;
    case "ifTouchingEnemy":
      checkTouchingEnemy(level, state);
      break;
    case "openDoor":
      openDoor(level, state);
      break;
    case "wait":
      state.trace.push("wait");
      break;
    case "ifEnemyAhead":
      if (peek(level, state) === "E") {
        state.direction = rightTurn[state.direction];
        state.trace.push("if enemy ahead -> turn right");
      } else {
        state.trace.push("if enemy ahead -> no enemy");
      }
      break;
    case "ifWallAhead":
      if (isBlocked(level, state)) {
        state.direction = rightTurn[state.direction];
        state.trace.push("if wall ahead -> turn right");
      } else {
        state.trace.push("if wall ahead -> no wall");
      }
      break;
    case "ifCoinHere":
      if (tileAt(level, state.row, state.col) === "C") {
        collect(level, state);
        state.score += 1;
        state.trace.push("if coin here -> collect and score +1");
      } else {
        state.trace.push("if coin here -> no coin");
      }
      break;
    case "repeat":
      break;
  }
}

function move(level: Level, state: GameState) {
  const next = nextPosition(state);
  const tile = tileAt(level, next.row, next.col);
  if (!tile) {
    state.failed = true;
    state.message = "机器人走出地图了。";
    return;
  }
  if (tile === "W") {
    state.failed = true;
    state.message = level.hints.wall ?? "前面有墙，不能继续前进。";
    return;
  }
  if (tile === "D" && !state.opened.includes(`${next.row}:${next.col}`)) {
    state.failed = true;
    state.message = level.hints.door ?? "门还没有打开，需要先拿 key 并使用 open door。";
    return;
  }
  if (tile === "E") {
    state.failed = true;
    state.message = level.hints.enemy ?? "机器人碰到怪物了。";
    return;
  }
  state.row = next.row;
  state.col = next.col;
  if (touchingEntity(state, "patrolEnemy")) {
    state.health -= 1;
    state.trace.push("touching enemy health -1");
    if (state.health <= 0) {
      state.failed = true;
      state.message = level.hints.damage ?? level.hints.enemy ?? "机器人碰到 enemy，health 变成 0。";
      return;
    }
  }
  if (tile === "X") {
    state.health -= 1;
    state.trace.push("trap health -1");
    if (state.health <= 0) {
      state.failed = true;
      state.message = level.hints.trap ?? "生命值为 0，挑战失败。";
      return;
    }
  }
  state.trace.push("move");
}

function fallEnergy(level: Level, state: GameState) {
  const bottom = level.grid.length - 1;
  for (const entity of state.entities) {
    if (entity.type !== "energy") continue;
    if (entity.row >= bottom) {
      state.misses += 1;
      state.trace.push("energy bottom miss +1");
      if (level.win.maxMisses !== undefined && state.misses > level.win.maxMisses) {
        state.failed = true;
        state.message = level.hints.miss ?? "miss 太多了，重新规划 catch 的时机。";
        return;
      }
      continue;
    }
    entity.row += 1;
    state.ticks += 1;
    state.trace.push("fall energy");
  }
}

function catchEnergy(state: GameState) {
  const energy = state.entities.find((entity) => entity.type === "energy" && entity.row === state.row && entity.col === state.col);
  if (!energy) {
    state.trace.push("catch energy -> no touch");
    return;
  }
  state.catches += 1;
  state.score += 1;
  energy.row = energy.homeRow ?? 0;
  energy.col = energy.homeCol ?? energy.col;
  state.trace.push("catch energy score +1");
}

function resetBottomEnergy(level: Level, state: GameState) {
  const bottom = level.grid.length - 1;
  const energy = state.entities.find((entity) => entity.type === "energy" && entity.row >= bottom);
  if (!energy) {
    state.trace.push("reset energy -> not bottom");
    return;
  }
  energy.row = energy.homeRow ?? 0;
  energy.col = energy.homeCol ?? energy.col;
  state.resets += 1;
  state.trace.push("reset energy");
}

function patrolEnemies(level: Level, state: GameState) {
  for (const entity of state.entities) {
    if (entity.type !== "patrolEnemy") continue;
    const direction = entity.direction ?? "right";
    const delta = deltas[direction];
    const next = { row: entity.row + delta.row, col: entity.col + delta.col };
    if (isEntityBlocked(level, state, entity, next.row, next.col)) {
      entity.direction = rightTurn[rightTurn[direction]];
      state.trace.push("enemy edge turn around");
    } else {
      entity.row = next.row;
      entity.col = next.col;
      state.trace.push("patrol enemy");
    }
    state.patrols += 1;
    state.ticks += 1;
  }
  if (touchingEntity(state, "patrolEnemy")) {
    state.health -= 1;
    state.trace.push("enemy patrol touch health -1");
    if (state.health <= 0) {
      state.failed = true;
      state.message = level.hints.damage ?? level.hints.enemy ?? "enemy 碰到机器人，health 变成 0。";
    }
  }
}

function checkTouchingEnemy(level: Level, state: GameState) {
  if (!touchingEntity(state, "patrolEnemy")) {
    state.trace.push("if touching enemy -> safe");
    return;
  }
  state.health -= 1;
  state.trace.push("if touching enemy -> damage health -1");
  if (state.health <= 0) {
    state.failed = true;
    state.message = level.hints.damage ?? "health 变成 0，挑战失败。";
  }
}

function collect(level: Level, state: GameState) {
  const tile = tileAt(level, state.row, state.col);
  const key = `${state.row}:${state.col}`;
  if ((tile === "O" || tile === "C" || tile === "K" || tile === "H") && !state.collected.includes(key)) {
    state.collected.push(key);
    if (tile === "K") state.keys += 1;
    if (tile === "H") state.health += 1;
    state.trace.push(`collect ${tile}`);
  } else {
    state.trace.push("collect nothing");
  }
}

function openDoor(level: Level, state: GameState) {
  const next = nextPosition(state);
  const key = `${next.row}:${next.col}`;
  if (tileAt(level, next.row, next.col) !== "D") {
    state.trace.push("open door -> no door");
    return;
  }
  if (state.keys <= 0) {
    state.failed = true;
    state.message = level.hints.key ?? "没有 key，不能 open door。";
    return;
  }
  state.keys -= 1;
  state.opened.push(key);
  state.trace.push("open door");
}

function peek(level: Level, state: GameState): Tile | undefined {
  const next = nextPosition(state);
  return tileAt(level, next.row, next.col);
}

function nextPosition(state: GameState) {
  const delta = deltas[state.direction];
  return { row: state.row + delta.row, col: state.col + delta.col };
}

function tileAt(level: Level, row: number, col: number): Tile | undefined {
  return level.grid[row]?.[col];
}

function isBlocked(level: Level, state: GameState) {
  const next = nextPosition(state);
  const tile = tileAt(level, next.row, next.col);
  return !tile || tile === "W" || (tile === "D" && !state.opened.includes(`${next.row}:${next.col}`));
}

function isEntityBlocked(level: Level, state: GameState, entity: DynamicEntity, row: number, col: number) {
  const tile = tileAt(level, row, col);
  if (!tile || tile === "W" || tile === "D") return true;
  return state.entities.some((other) => other.id !== entity.id && other.row === row && other.col === col);
}

function touchingEntity(state: GameState, type: DynamicEntity["type"]) {
  return state.entities.some((entity) => entity.type === type && entity.row === state.row && entity.col === state.col);
}

function checkWin(level: Level, state: GameState) {
  const targetReached = level.win.target
    ? state.row === level.win.target.row && state.col === level.win.target.col
    : true;
  const scoreReached = level.win.requiredScore ? state.score >= level.win.requiredScore : true;
  const keysReached = level.win.requiredKeys ? state.keys >= level.win.requiredKeys : true;
  const healthReached = level.win.minHealth ? state.health >= level.win.minHealth : true;
  const catchesReached = level.win.requiredCatches ? state.catches >= level.win.requiredCatches : true;
  const resetsReached = level.win.requiredResets ? state.resets >= level.win.requiredResets : true;
  const patrolsReached = level.win.requiredPatrols ? state.patrols >= level.win.requiredPatrols : true;
  const missesAllowed = level.win.maxMisses !== undefined ? state.misses <= level.win.maxMisses : true;
  const survivedTicks = level.win.surviveTicks ? state.ticks >= level.win.surviveTicks : true;
  const allCollected = level.win.collectAll ? collectableCount(level, level.win.collectAll) === state.collected.length : true;
  return (
    targetReached &&
    scoreReached &&
    keysReached &&
    healthReached &&
    catchesReached &&
    resetsReached &&
    patrolsReached &&
    missesAllowed &&
    survivedTicks &&
    allCollected
  );
}

function collectableCount(level: Level, tile: Tile) {
  return level.grid.flat().filter((cell) => cell === tile).length;
}

export function calculateStars(level: Level, state: GameState, blocks: BlockCommand[]) {
  if (!state.success) return 0;
  let stars = 1;
  if (level.id === 3 && blocks.some((block) => block.type === "repeat")) stars += 1;
  if (blocks.some((block) => block.type === "repeat" || block.type.startsWith("if"))) stars += 1;
  if (state.health >= 2 && blocks.length <= 14) stars += 1;
  return Math.min(stars, 3);
}
