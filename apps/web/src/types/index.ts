// Shared TypeScript types for caro-phonel

export type StoneValue = 1 | 2;  // 1 = black (first player), 2 = white (second player)
export type CellValue = StoneValue | null;

// 15x15 board: board[row][col]
export type Board = CellValue[][];

export interface Player {
  id: string;
  name: string;
  index: 0 | 1;  // 0 = black (first), 1 = white (second)
  connected?: boolean;
}

export interface Move {
  playerId: string;
  row: number;
  col: number;
  timestamp: string;
}

export interface GameResult {
  winner: StoneValue | null;  // null = draw
  reason: 'five_in_row' | 'board_full' | 'opponent_left';
}

export type GameStatus = 'waiting' | 'playing' | 'finished' | 'abandoned';

export interface GameState {
  id: string;
  roomId: string;
  players: Player[];
  board: Board;
  currentTurn: StoneValue;
  moves: Move[];
  status: GameStatus;
  result: GameResult | null;
  createdAt: string;
  updatedAt: string[];
}

export interface Room {
  id: string;
  code: string;
  name: string;
  isPrivate: boolean;
  currentPlayers: Player[];
  gameId: string | null;
  status: 'waiting' | 'full' | 'playing';
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface WinCheckResult {
  hasWin: boolean;
  winningCells: Position[];
}
