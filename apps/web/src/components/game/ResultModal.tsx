'use client';

import React from 'react';
import type { GameResult, Player } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ResultModalProps {
  isOpen: boolean;
  result: GameResult | null;
  playerId: string;
  players: Player[];
  onRematch: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export default function ResultModal({
  isOpen,
  result,
  playerId,
  players,
  onRematch,
  onNewGame,
  onClose,
}: ResultModalProps) {
  if (!result) return null;

  const myPlayer = players.find(p => p.id === playerId);
  const isDraw = result.winner === null;
  const isWin = result.winner !== null && (result.winner === 1 ? myPlayer?.index === 0 : myPlayer?.index === 1);

  let title = '';
  let icon = '';
  let variant: 'success' | 'error' | 'warning' = 'success';

  if (isDraw) {
    title = 'HÒA!';
    icon = '🤝';
    variant = 'warning';
  } else if (isWin) {
    title = 'BẠN THẮNG!';
    icon = '✨';
    variant = 'success';
  } else {
    title = 'BẠN THUA!';
    icon = '😔';
    variant = 'error';
  }

  const reasonText: Record<string, string> = {
    five_in_row: '5 đường thẳng',
    board_full: 'Cờ đầy',
    opponent_left: 'Đối thủ thoát',
  };

  const titleColorClass = variant === 'success' ? 'text-accent-success' : variant === 'error' ? 'text-accent-error' : 'text-accent-warning';

  return (
    <Modal isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="text-center py-4">
        {/* Icon */}
        <div className="text-5xl mb-4">{icon}</div>

        {/* Title */}
        <h2 className={`text-3xl font-bold mb-2 ${titleColorClass}`}>
          {title}
        </h2>

        {/* Reason */}
        <p className="text-text-secondary text-base mb-6">
          {reasonText[result.reason] || result.reason}
        </p>

        {/* Players */}
        <div className="flex justify-center gap-6 text-sm mb-8">
          {players.map(p => (
            <span key={p.id}>
              <span className="text-text-secondary">{p.index === 0 ? 'Đen:' : 'Trắng:'} </span>
              <span className="font-medium">{p.name}</span>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={onRematch}>
            Đấu lại
          </Button>
          <Button variant="secondary" onClick={onNewGame}>
            Chơi mới
          </Button>
        </div>
      </div>
    </Modal>
  );
}
