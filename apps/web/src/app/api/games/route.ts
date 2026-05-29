// Games collection - GET list, POST create (for rematch)
import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/store';

export async function GET() {
  try {
    const allGames = Array.from(games.values()).map((g: any) => ({
      id: g.id,
      roomId: g.roomId,
      players: g.players,
      status: g.status,
    }));
    return NextResponse.json({ games: allGames });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { roomId, playerId } = await req.json();
    if (!roomId || !playerId) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'roomId and playerId required' }, { status: 400 });
    }
    return NextResponse.json({ error: 'NOT_IMPLEMENTED', message: 'Use room join for new games' }, { status: 501 });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
