'use client';

import React from 'react';
import type { Board, StoneValue, Position } from '@/types';

interface CellProps {
  value: StoneValue | null;
  row: number;
  col: number;
  isInteractive: boolean;
  isLastMove: boolean;
  isWinning: boolean;
  onClick: () => void;
}

export default function Cell({
  value,
  row,
  col,
  isInteractive,
  isLastMove,
  isWinning,
  onClick,
}: CellProps) {
  const isEmpty = value === null;

  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={`
        aspect-square w-full relative
        flex items-center justify-center
        ${isInteractive && isEmpty ? 'cursor-pointer hover:bg-board-hover' : 'cursor-default'}
        ${isLastMove ? 'after:absolute after:w-1.5 after:h-1.5 after:bg-accent-primary after:rounded-full after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2' : ''}
      `}
      style={{ background: 'var(--board-bg)' }}
    >
      {value !== null && (
        <div
          className={`
            w-4/5 h-4/5 rounded-full
            flex items-center justify-center
            text-[8px] font-bold
            shadow-md
            ${value === 1
              ? 'bg-stone-black shadow-black/50'
              : 'bg-stone-white border border-stone-white-border shadow-black/30'
            }
            ${isWinning ? 'stone-win' : ''}
          `}
          style={value === 1
            ? { background: '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)' }
            : { background: '#e8e8e8', border: '1px solid #888', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }
          }
        />
      )}
    </div>
  );
}
