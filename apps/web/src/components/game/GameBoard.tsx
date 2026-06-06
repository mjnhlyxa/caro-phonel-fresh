'use client';

import React from 'react';
import type { Board, StoneValue, Position } from '@/types';
import Cell from './Cell';
import { BOARD_SIZE } from '@/lib/caro-engine/engine';

interface GameBoardProps {
  board: Board;
  currentTurn: StoneValue;
  playerId: string;
  myIndex: number;
  gameStatus: string;
  lastMove: Position | null;
  winningCells: Position[];
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  board,
  currentTurn,
  playerId,
  myIndex,
  gameStatus,
  lastMove,
  winningCells,
  onCellClick,
}: GameBoardProps) {
  const isMyTurn = currentTurn === (myIndex === 0 ? 1 : 2);
  const isGameActive = gameStatus === 'playing';
  const isInteractive = isMyTurn && isGameActive;

  // Helper to check if cell is winning
  const isCellWinning = (row: number, col: number) => {
    return winningCells.some(cell => cell.row === row && cell.col === col);
  };

  // Helper to check if cell is last move
  const isCellLastMove = (row: number, col: number) => {
    return !!(lastMove && lastMove.row === row && lastMove.col === col);
  };

  return (
    <div className="w-full" style={{ aspectRatio: '1' }}>
      <div
        className="w-full h-full grid gap-0 p-1 rounded"
        style={{
          background: 'var(--board-bg)',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          border: '2px solid var(--board-line)',
        }}
      >
        {Array.from({ length: BOARD_SIZE }, (_, row) =>
          Array.from({ length: BOARD_SIZE }, (_, col) => (
            <Cell
              key={`${row}-${col}`}
              value={board[row][col]}
              row={row}
              col={col}
              isInteractive={isInteractive}
              isLastMove={isCellLastMove(row, col)}
              isWinning={isCellWinning(row, col)}
              onClick={() => onCellClick(row, col)}
            />
          ))
        )}
      </div>
    </div>
  );
}
