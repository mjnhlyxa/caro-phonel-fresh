// Leave room endpoint
import { NextRequest, NextResponse } from 'next/server';
import { rooms, roomCodes } from '@/lib/store';

interface PlayerRecord {
  id: string;
  name: string;
  index: number;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { playerId } = await req.json();

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

    room.currentPlayers = room.currentPlayers.filter((p: PlayerRecord) => p.id !== playerId);
    room.updatedAt = new Date().toISOString();

    if (room.currentPlayers.length === 0) {
      // Delete room if empty
      rooms.delete(roomId);
      roomCodes.delete(code);
    } else if (room.status === 'full') {
      room.status = 'waiting';
      room.gameId = null;
    }

    return NextResponse.json({ success: true, message: 'Left room successfully' });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
