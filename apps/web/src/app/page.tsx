'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { getOrCreatePlayerId, getPlayerName, setPlayerName } from '@/lib/player';
import API_URL from '@/lib/api';
import type { Room } from '@/types';

export default function LobbyPage() {
  const router = useRouter();
  const playerId = getOrCreatePlayerId();
  const [playerName, setLocalPlayerName] = useState(getPlayerName());

  // Create room modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);

  // Join room
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Room list
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Copy toast
  const [copied, setCopied] = useState(false);

  // Load room list
  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch(API_URL.listRooms());
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch {
      // silently fail for room list
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 5000);
    return () => clearInterval(interval);
  }, [loadRooms]);

  // Create room
  const handleCreateRoom = async () => {
    if (!playerId) return;
    setIsCreating(true);
    try {
      const name = roomName.trim() || 'Anonymous';
      setPlayerName(name);
      setLocalPlayerName(name);

      const res = await fetch(API_URL.createRoom(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName: name }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Tạo phòng thất bại');
        return;
      }

      const room: Room = await res.json();
      setCreatedRoom(room);
      router.push(`/room/${room.code}`);
    } catch {
      alert('Tạo phòng thất bại. Vui lòng thử lại.');
    } finally {
      setIsCreating(false);
    }
  };

  // Join room by code
  const handleJoinRoom = async () => {
    if (!playerId) return;
    const code = joinCode.trim().toUpperCase();
    if (code.length < 6) {
      setJoinError('Mã phòng phải 6 ký tự');
      return;
    }

    setIsJoining(true);
    setJoinError('');
    try {
      const name = playerName.trim() || 'Anonymous';
      setPlayerName(name);

      const res = await fetch(API_URL.joinRoom(code), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName: name }),
      });

      if (!res.ok) {
        const err = await res.json();
        setJoinError(err.message || 'Không thể vào phòng');
        return;
      }

      router.push(`/room/${code}`);
    } catch {
      setJoinError('Không thể vào phòng. Vui lòng thử lại.');
    } finally {
      setIsJoining(false);
    }
  };

  // Join from list
  const handleJoinFromList = async (room: Room) => {
    if (!playerId) return;
    const name = playerName.trim() || 'Anonymous';
    setPlayerName(name);

    try {
      const res = await fetch(API_URL.joinRoom(room.code), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName: name }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Không thể vào phòng');
        return;
      }

      router.push(`/room/${room.code}`);
    } catch {
      alert('Không thể vào phòng. Vui lòng thử lại.');
    }
  };

  // Auto-uppercase room code input
  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.target.value.toUpperCase().slice(0, 6));
    setJoinError('');
  };

  const copyShareLink = () => {
    if (!createdRoom) return;
    const url = `${window.location.origin}/room/${createdRoom.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-primary mb-2">
            caro-phonel
          </h1>
          <p className="text-text-secondary text-lg">
            Gomoku · Caro · Five-in-a-row
          </p>
        </div>

        {/* First-time name prompt */}
        {playerName === 'Anonymous' && (
          <Card className="mb-8 text-center">
            <p className="text-text-secondary mb-3">Nhập tên của bạn (tùy chọn)</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                value={playerName}
                onChange={(e) => setLocalPlayerName(e.target.value)}
                placeholder="Tên của bạn"
                className="flex-1"
              />
              <Button onClick={() => { setPlayerName(playerName); }}>Lưu</Button>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Actions */}
          <div className="space-y-6">
            {/* Create Room Button */}
            <div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setShowCreateModal(true)}
              >
                TẠO PHÒNG MỚI
              </Button>
            </div>

            {/* Join by Code */}
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Mã phòng
              </h3>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  onChange={handleJoinCodeChange}
                  placeholder="ABC123"
                  maxLength={6}
                  error={joinError}
                  className="flex-1 font-mono text-center tracking-[4px]"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
                <Button
                  variant="secondary"
                  disabled={joinCode.length < 6}
                  loading={isJoining}
                  onClick={handleJoinRoom}
                >
                  Vào phòng
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Public Room List */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Phòng công
            </h3>
            {isLoadingRooms ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-bg-surface border border-border-default rounded-lg p-4 h-16" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-secondary">
                  Chưa có phòng công.
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  Tạo phòng mới để bắt đầu!
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {rooms.map(room => (
                  <Card
                    key={room.id}
                    hoverable
                    onClick={() => handleJoinFromList(room)}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{room.name}</div>
                      <div className="text-sm text-text-secondary mt-1">
                        {room.currentPlayers.length}/2 người chơi
                      </div>
                    </div>
                    <Badge variant={room.status === 'playing' ? 'error' : 'info'}>
                      {room.status === 'playing' ? 'Đang chơi' : 'Đợi'}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreatedRoom(null); setRoomName(''); }}
        title={createdRoom ? 'Phòng đã tạo!' : 'Tạo phòng mới'}
        maxWidth={createdRoom ? '360px' : '340px'}
      >
        {createdRoom ? (
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              Chia sẻ mã phòng để mời bạn bè
            </p>
            <div className="font-mono text-4xl font-bold text-accent-primary tracking-[6px] mb-6">
              {createdRoom.code}
            </div>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={copyShareLink}>
                {copied ? 'Đã sao chép!' : 'Sao chép link'}
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push(`/room/${createdRoom.code}`)}
              >
                Vào phòng
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Đặt tên phòng (tùy chọn)
            </p>
            <Input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Tên phòng..."
              maxLength={50}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => { setShowCreateModal(false); setRoomName(''); }}
              >
                Hủy
              </Button>
              <Button variant="primary" className="flex-1" loading={isCreating} onClick={handleCreateRoom}>
                Tạo
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
