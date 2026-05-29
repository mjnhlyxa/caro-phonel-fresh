// Game by ID - GET game state
import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const game = games.get(gameId);
    if (!game) {
      return NextResponse.json({ error: 'GAME_NOT_FOUND', message: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
