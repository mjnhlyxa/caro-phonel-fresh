'use client';

import React from 'react';
import type { Player } from '@/types';
import Badge from '@/components/ui/Badge';

interface PlayerPanelProps {
  player: Player;
  isCurrentTurn: boolean;
  isMe?: boolean;
  isConnected?: boolean;
}

export default function PlayerPanel({
  player,
  isCurrentTurn,
  isMe = false,
  isConnected = true,
}: PlayerPanelProps) {
  const stoneColor = player.index === 0 ? 'black' : 'white';

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-bg-surface border-2 transition-all duration-200
        ${isCurrentTurn
          ? 'border-accent-primary shadow-[0_0_12px_rgba(201,162,39,0.3)]'
          : 'border-border-default'
        }
        ${!isConnected ? 'opacity-50' : ''}
      `}
    >
      {/* Stone indicator */}
      <div
        className={`
          w-8 h-8 rounded-full flex-shrink-0
          ${stoneColor === 'black'
            ? 'bg-stone-black shadow-black/50'
            : 'bg-stone-white border border-stone-white-border shadow-black/30'
          }
        `}
        style={stoneColor === 'black'
          ? { background: '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }
          : { background: '#e8e8e8', border: '1px solid #888', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }
        }
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">
            {player.name}
            {isMe && <span className="text-text-secondary ml-1">(Bạn)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {isCurrentTurn ? (
            <span className="text-sm text-accent-primary font-medium animate-pulse">
              Lượt của bạn
            </span>
          ) : (
            <span className="text-sm text-text-secondary">
              Chờ...
            </span>
          )}
          {!isConnected && (
            <Badge variant="warning">Offline</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
