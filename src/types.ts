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
  | "changeHealth";

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
  win: {
    target?: { row: number; col: number };
    requiredScore?: number;
    requiredKeys?: number;
    collectAll?: Tile;
    avoidEnemies?: boolean;
    minHealth?: number;
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
  collected: string[];
  opened: string[];
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
