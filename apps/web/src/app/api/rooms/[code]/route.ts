// Room by code - GET room details
import { NextRequest, NextResponse } from 'next/server';
import { rooms, roomCodes } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const roomId = roomCodes.get(code);
    if (!roomId) {
      return NextResponse.json({ error: 'ROOM_NOT_FOUND', message: 'Room not found' }, { status: 404 });
    }
    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'ROOM_NOT_FOUND', message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
