export type Direction = "up" | "right" | "down" | "left";

export type Tile = "." | "W" | "T" | "G" | "O" | "C" | "E" | "K" | "D" | "X" | "H";

export type BlockType =
  | "move"
  | "turnLeft"
  | "turnRight"
  | "collect"
  | "repeat"
  | "ifEnemyAhead"
  | "ifWallAhead"
  | "ifCoinHere"
  | "turnAround"
  | "openDoor"
  | "wait"
  | "changeScore"
  | "changeHealth"
  | "fallEnergy"
  | "catchEnergy"
  | "resetEnergy"
  | "patrolEnemy"
  | "ifTouchingEnemy";

export type BlockCommand = {
  id: string;
  type: BlockType;
  count?: number;
};

export type VocabularyWord = {
  word: string;
  meaning: string;
  sentence: string;
};

export type DynamicEntity = {
  id: string;
  type: "energy" | "patrolEnemy";
  row: number;
  col: number;
  direction?: Direction;
  homeRow?: number;
  homeCol?: number;
};

export type Level = {
  id: number;
  title: string;
  world: string;
  concept: string;
  story: string;
  goal: string;
  grid: Tile[][];
  robot: {
    row: number;
    col: number;
    direction: Direction;
  };
  allowedBlocks: BlockType[];
  vocabulary: VocabularyWord[];
  entities?: DynamicEntity[];
  win: {
    target?: { row: number; col: number };
    requiredScore?: number;
    requiredKeys?: number;
    collectAll?: Tile;
    avoidEnemies?: boolean;
    minHealth?: number;
    requiredCatches?: number;
    requiredResets?: number;
    requiredPatrols?: number;
    maxMisses?: number;
    surviveTicks?: number;
  };
  hints: Record<string, string>;
  reflectionQuestions: string[];
};

export type GameState = {
  row: number;
  col: number;
  direction: Direction;
  score: number;
  keys: number;
  health: number;
  catches: number;
  misses: number;
  resets: number;
  patrols: number;
  ticks: number;
  collected: string[];
  opened: string[];
  entities: DynamicEntity[];
  failed: boolean;
  success: boolean;
  message: string;
  trace: string[];
};

export type LearningRecord = {
  id: string;
  levelId: number;
  levelTitle: string;
  success: boolean;
  durationSeconds: number;
  retryCount: number;
  hintCount: number;
  debugCount: number;
  stars: number;
  usedBlocks: BlockType[];
  createdAt: string;
};
