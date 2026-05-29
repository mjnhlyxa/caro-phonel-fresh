'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '@/components/game/GameBoard';
import PlayerPanel from '@/components/game/PlayerPanel';
import ResultModal from '@/components/game/ResultModal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { getOrCreatePlayerId, getPlayerName, setPlayerName } from '@/lib/player';
import API_URL from '@/lib/api';
import { toNotation } from '@/lib/caro-engine/engine';
import type { Room, GameState, Move, StoneValue, Position } from '@/types';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomPage({ params }: PageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const playerId = getOrCreatePlayerId();
  const { addToast, toastElement } = useToast();

  // Room state
  const [room, setRoom] = useState<Room | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Player state
  const [myIndex, setMyIndex] = useState<number>(-1);
  const [showResult, setShowResult] = useState(false);

  // Share
  const [copied, setCopied] = useState(false);

  // Refetch interval
  const [refetchInterval, setRefetchInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Load player name
  const [playerName] = useState(getPlayerName());

  // Determine my player index
  const getMyIndex = useCallback((r: Room, pId: string): number => {
    const idx = r.currentPlayers.findIndex(p => p.id === pId);
    return idx;
  }, []);

  // Fetch room state
  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await fetch(API_URL.getRoom(roomId));
      if (!res.ok) {
        if (res.status === 404) {
          setError('Phòng không tồn tại hoặc đã bị xóa');
        }
        return;
      }
      const data = await res.json();
      setRoom(data);

      // Check if game needs to be started
      if (data.gameId && !game) {
        loadGame(data.gameId);
      } else if (data.gameId && game && game.id !== data.gameId) {
        loadGame(data.gameId);
      } else if (!data.gameId && data.status === 'playing' && !game) {
        // Try to find existing game
        loadGame(null);
      }
    } catch {
      // silently fail during polling
    } finally {
      setIsLoading(false);
    }
  }, [roomId, game]);

  // Fetch game state
  const loadGame = async (gameId: string | null) => {
    try {
      if (gameId) {
        const res = await fetch(API_URL.getGame(gameId));
        if (res.ok) {
          const g: GameState = await res.json();
          setGame(g);
          if (g.status === 'finished' || g.status === 'abandoned') {
            setShowResult(true);
          }
          return;
        }
      }
    } catch {
      // game not ready yet
    }
  };

  // Initial load
  useEffect(() => {
    if (!playerId) {
      router.push('/');
      return;
    }
    setPlayerName(playerName);
    loadRoom();

    // Poll every 3 seconds
    const interval = setInterval(loadRoom, 3000);
    setRefetchInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [roomId, playerId, playerName, router, loadRoom]);

  // When room loads, set my index
  useEffect(() => {
    if (room && playerId) {
      const idx = getMyIndex(room, playerId);
      setMyIndex(idx);
    }
  }, [room, playerId, getMyIndex]);

  // Make move
  const handleCellClick = async (row: number, col: number) => {
    if (!game || !playerId) return;
    const isMyTurn = game.currentTurn === (myIndex === 0 ? 1 : 2);
    if (!isMyTurn) {
      addToast('Chưa đến lượt bạn', 'warning');
      return;
    }
    if (game.status !== 'playing') return;
    if (game.board[row][col] !== null) {
      addToast('Ô đã có quân cờ', 'error');
      return;
    }

    try {
      const res = await fetch(API_URL.makeMove(game.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, row, col }),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast(err.message || 'Nước đi không hợp lệ', 'error');
        return;
      }

      const data = await res.json();
      setGame(data.game);

      if (data.isGameOver) {
        setShowResult(true);
      }
    } catch {
      addToast('Không thể đi nước này', 'error');
    }
  };

  // Rematch
  const handleRematch = async () => {
    if (!room || !playerId) return;
    setShowResult(false);
    try {
      const res = await fetch(API_URL.createRoom(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName, isRematch: true, roomId: room.code }),
      });
      if (res.ok) {
        const data = await res.json();
        setGame(null);
        await loadRoom();
      }
    } catch {
      addToast('Không thể đấu lại', 'error');
    }
  };

  // New game (go to lobby)
  const handleNewGame = () => {
    router.push('/');
  };

  // Copy link
  const copyShareLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Leave room
  const handleLeave = async () => {
    if (!roomId || !playerId) return;
    try {
      await fetch(API_URL.leaveRoom(roomId), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
    } catch {
      // ignore
    }
    router.push('/');
  };

  // Extract winning cells from game result (placeholder implementation)
  const getWinningCells = (): Position[] => {
    if (!game?.result?.winner || !game.moves.length) return [];
    const lastMove = game.moves[game.moves.length - 1];
    // In a real implementation, we'd store winning cells in the game result
    // For now, we need the engine to compute this...
    // This will be enhanced after engine integration
    return [];
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-accent-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <Button onClick={() => router.push('/')}>Quay về trang chủ</Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-border-default border-t-accent-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Waiting room
  if (!game || game.status === 'waiting') {
    const opponent = room?.currentPlayers.find(p => p.id !== playerId);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {toastElement}
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 border-4 border-border-default border-t-accent-primary rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold mb-2">Đang chờ người chơi thứ 2...</h2>
          <p className="text-text-secondary mb-6">Chia sẻ mã phòng để mời bạn bè</p>

          <div className="font-mono text-5xl font-bold text-accent-primary tracking-widest mb-6">
            {roomId}
          </div>

          <div className="space-y-3 mb-8">
            <Button variant="secondary" onClick={copyShareLink}>
              {copied ? 'Đã sao chép!' : 'Sao chép link'}
            </Button>
          </div>

          {/* Player list */}
          <Card className="text-left">
            <div className="font-semibold mb-3">Người chơi</div>
            {room?.currentPlayers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 py-2 border-b border-border-default last:border-0">
                <div className={`w-6 h-6 rounded-full ${i === 0 ? 'bg-black' : 'bg-white border border-gray-400'}`} />
                <span className="flex-1">{p.name}</span>
                {i === 0 && <Badge variant="success">Host</Badge>}
              </div>
            ))}
            {room && room.currentPlayers.length < 2 && (
              <div className="flex items-center gap-2 py-2 text-text-secondary">
                <div className="w-6 h-6 rounded-full border border-dashed border-text-secondary" />
                <span>Chờ...</span>
              </div>
            )}
          </Card>

          <div className="mt-6">
            <Button variant="ghost" onClick={handleLeave}>Thoát</Button>
          </div>
        </div>
      </div>
    );
  }

  // Game in progress
  const myPlayer = game?.players.find(p => p.id === playerId);
  const opponent = game?.players.find(p => p.id !== playerId);
  const lastMove = game?.moves.length ? game.moves[game.moves.length - 1] : null;
  const winningCells = getWinningCells();

  return (
    <div className="min-h-screen flex flex-col">
      {toastElement}
      {/* Header */}
      <header className="px-4 py-3 border-b border-border-default bg-bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-accent-primary">caro-phonel</span>
          <span className="text-text-secondary">|</span>
          <span className="font-mono text-sm tracking-wider text-text-secondary">{roomId}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>Thoát</Button>
      </header>

      {/* Main game area */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Left sidebar - Player info */}
        <aside className="flex flex-col gap-4 md:w-48">
          {game.players.length > 0 && (
            <PlayerPanel
              player={game.players[0]}
              isCurrentTurn={game.currentTurn === 1}
              isMe={myPlayer?.id === game.players[0].id}
              isConnected={true}
            />
          )}
          {game.players.length > 1 && (
            <PlayerPanel
              player={game.players[1]}
              isCurrentTurn={game.currentTurn === 2}
              isMe={myPlayer?.id === game.players[1].id}
              isConnected={true}
            />
          )}
        </aside>

        {/* Center - Game board */}
        <section className="flex-1 flex flex-col gap-4">
          <GameBoard
            board={game.board}
            currentTurn={game.currentTurn}
            playerId={playerId}
            myIndex={myIndex}
            gameStatus={game.status}
            lastMove={lastMove ? { row: lastMove.row, col: lastMove.col } : null}
            winningCells={winningCells}
            onCellClick={handleCellClick}
          />

          {/* Move history */}
          {game.moves.length > 0 && (
            <Card className="max-h-32 overflow-y-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Nước đi
              </h3>
              <div className="space-y-1 text-sm">
                {game.moves.slice(-5).map((move, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-text-secondary w-6">{idx + 1}.</span>
                    <span className="font-mono">
                      {toNotation(move.col, move.row)}
                    </span>
                    <span className="text-text-secondary text-xs">
                      ({game.players.find(p => p.id === move.playerId)?.name})
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* Right sidebar - Actions */}
        <aside className="md:w-40 flex flex-col gap-4">
          <Card>
            <div className="text-xs text-text-secondary mb-2">PHÒNG</div>
            <div className="font-mono text-lg tracking-wider text-accent-primary">{roomId}</div>
          </Card>
          <Button variant="secondary" size="sm" onClick={copyShareLink}>
            {copied ? 'Đã sao chép!' : 'Sao chép mã'}
          </Button>
        </aside>
      </main>

      {/* Result Modal */}
      {game.result && (
        <ResultModal
          isOpen={showResult}
          result={game.result}
          playerId={playerId}
          players={game.players}
          onRematch={handleRematch}
          onNewGame={handleNewGame}
          onClose={handleNewGame}
        />
      )}
    </div>
  );
}
