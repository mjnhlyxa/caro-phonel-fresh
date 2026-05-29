// Room API route - POST create, GET list
import { NextRequest, NextResponse } from 'next/server';
import { rooms, roomCodes, generateCode, nanoid } from '@/lib/store';

interface PlayerRecord {
  id: string;
  name: string;
  index: number;
}

export async function POST(req: NextRequest) {
  try {
    const { playerId, playerName } = await req.json();
    if (!playerId) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'playerId required' }, { status: 400 });
    }

    let code = generateCode();
    while (roomCodes.has(code)) {
      code = generateCode();
    }

    const roomId = nanoid();
    const room = {
      id: roomId,
      code,
      name: 'Phòng mới',
      isPrivate: false,
      currentPlayers: [{
        id: playerId,
        name: playerName || 'Anonymous',
        index: 0,
      }] as PlayerRecord[],
      gameId: null,
      status: 'waiting' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    rooms.set(roomId, room);
    roomCodes.set(code, roomId);

    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const publicRooms = Array.from(rooms.values())
      .filter(r => !r.isPrivate && r.status === 'waiting')
      .map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
        currentPlayers: r.currentPlayers,
        status: r.status,
      }));
    return NextResponse.json({ rooms: publicRooms });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
