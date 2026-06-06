// Pure game logic for Caro/Gomoku - no React or DB dependencies
// Board: 15x15, 1 = black, 2 = white, null = empty

import type { Board, CellValue, StoneValue, Position, WinCheckResult } from '@/types';

export const BOARD_SIZE = 15;
export const WIN_COUNT = 5;

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function isCellEmpty(board: Board, row: number, col: number): boolean {
  if (!isValidPosition(row, col)) return false;
  return board[row][col] === null;
}

export function isValidMove(
  board: Board,
  row: number,
  col: number,
  player: StoneValue,
  currentTurn: StoneValue
): { valid: boolean; error?: string } {
  if (!isValidPosition(row, col)) {
    return { valid: false, error: 'OUT_OF_BOUNDS' };
  }
  if (!isCellEmpty(board, row, col)) {
    return { valid: false, error: 'CELL_OCCUPIED' };
  }
  if (player !== currentTurn) {
    return { valid: false, error: 'NOT_YOUR_TURN' };
  }
  return { valid: true };
}

export function applyMove(
  board: Board,
  row: number,
  col: number,
  player: StoneValue
): Board {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
}

export function getNextTurn(currentTurn: StoneValue): StoneValue {
  return currentTurn === 1 ? 2 : 1;
}

export function checkWin(
  board: Board,
  row: number,
  col: number,
  player: StoneValue
): WinCheckResult {
  const directions: [number, number][] = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal top-left to bottom-right
    [1, -1],  // diagonal top-right to bottom-left
  ];

  for (const [dr, dc] of directions) {
    const cells: Position[] = [{ row, col }];

    // Count in positive direction
    let r = row + dr;
    let c = col + dc;
    while (isValidPosition(r, c) && board[r][c] === player) {
      cells.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    // Count in negative direction
    r = row - dr;
    c = col - dc;
    while (isValidPosition(r, c) && board[r][c] === player) {
      cells.push({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (cells.length >= WIN_COUNT) {
      return { hasWin: true, winningCells: cells.slice(0, WIN_COUNT) };
    }
  }

  return { hasWin: false, winningCells: [] };
}

export function checkDraw(board: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}

export function isBoardFull(board: Board): boolean {
  return checkDraw(board);
}

// Convert row/col to chess-like notation (A-O for cols, 1-15 for rows)
export function toNotation(col: number, row: number): string {
  const colLetter = String.fromCharCode(65 + col); // A-O
  const rowNumber = row + 1; // 1-15
  return `${colLetter}${rowNumber}`;
}

export function fromNotation(notation: string): Position | null {
  const match = notation.match(/^([A-O])(\d+)$/i);
  if (!match) return null;
  const col = match[1].toUpperCase().charCodeAt(0) - 65;
  const row = parseInt(match[2], 10) - 1;
  if (!isValidPosition(row, col)) return null;
  return { row, col };
}
