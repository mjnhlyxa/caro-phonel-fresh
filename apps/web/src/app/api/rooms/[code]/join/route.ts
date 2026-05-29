// Join room endpoint
import { NextRequest, NextResponse } from 'next/server';
import { rooms, roomCodes, nanoid, games } from '@/lib/store';

const BOARD_SIZE = 15;

function createEmptyBoard(): (number | null)[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

interface PlayerRecord {
  id: string;
  name: string;
  index: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { playerId, playerName } = await req.json();

    if (!playerId) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'playerId required' }, { status: 400 });
    }

    const roomId = roomCodes.get(code);
    if (!roomId) {
      return NextResponse.json({ error: 'ROOM_NOT_FOUND', message: 'Room not found' }, { status: 404 });
    }

    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'ROOM_NOT_FOUND', message: 'Room not found' }, { status: 404 });
    }

    if (room.currentPlayers.length >= 2) {
      return NextResponse.json({ error: 'ROOM_FULL', message: 'Room is full' }, { status: 409 });
    }

    // Check if player already in room
    if (room.currentPlayers.some((p: PlayerRecord) => p.id === playerId)) {
      return NextResponse.json({ error: 'ALREADY_JOINED', message: 'You already joined this room' }, { status: 409 });
    }

    // Add player
    room.currentPlayers.push({
      id: playerId,
      name: playerName || 'Anonymous',
      index: 1,
    });

    // Update status
    room.status = 'full';
    room.updatedAt = new Date().toISOString();

    // Create game
    const gameId = nanoid();
    const game = {
      id: gameId,
      roomId,
      players: room.currentPlayers,
      board: createEmptyBoard(),
      currentTurn: 1 as const,
      moves: [],
      status: 'playing' as const,
      result: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    games.set(gameId, game);
    room.gameId = gameId;

    rooms.set(roomId, room);

    return NextResponse.json({
      success: true,
      room,
      gameId,
      playerIndex: 1,
    });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
