// Make a move
import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/store';

const BOARD_SIZE = 15;
const WIN_COUNT = 5;

function checkWin(board: (number | null)[][], row: number, col: number, player: number): boolean {
  const directions: [number, number][] = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal TL-BR
    [1, -1],  // diagonal TR-BL
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    // Count in positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }

    // Count in negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }

    if (count >= WIN_COUNT) return true;
  }
  return false;
}

function isBoardFull(board: (number | null)[][]): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}

function getNextTurn(current: number): number {
  return current === 1 ? 2 : 1;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const { playerId, row, col } = await req.json();

    if (!playerId || row === undefined || col === undefined) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'playerId, row, col required' }, { status: 400 });
    }

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return NextResponse.json({ error: 'INVALID_MOVE', message: 'Out of bounds' }, { status: 400 });
    }

    const game = games.get(gameId);
    if (!game) {
      return NextResponse.json({ error: 'GAME_NOT_FOUND', message: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'playing') {
      return NextResponse.json({ error: 'GAME_NOT_ACTIVE', message: 'Game is not active' }, { status: 403 });
    }

    // Find player
    const playerIndex = game.players.findIndex((p: { id: string }) => p.id === playerId);
    if (playerIndex === -1) {
      return NextResponse.json({ error: 'PLAYER_NOT_IN_GAME', message: 'You are not in this game' }, { status: 403 });
    }

    // Determine this player's stone value (player index 0 → stone 1, index 1 → stone 2)
    const playerStone = playerIndex === 0 ? 1 : 2;

    // Check turn
    if (game.currentTurn !== playerStone) {
      return NextResponse.json({ error: 'NOT_YOUR_TURN', message: 'It is not your turn' }, { status: 403 });
    }

    // Check cell is empty
    if (game.board[row][col] !== null) {
      return NextResponse.json({ error: 'INVALID_MOVE', message: 'Cell already occupied' }, { status: 400 });
    }

    // Apply move
    game.board[row][col] = playerStone;
    game.moves.push({
      playerId,
      row,
      col,
      timestamp: new Date().toISOString(),
    });
    game.updatedAt = new Date().toISOString();

    // Check for win
    if (checkWin(game.board, row, col, playerStone)) {
      game.status = 'finished';
      game.result = {
        winner: playerStone,
        reason: 'five_in_row',
      };
      games.set(gameId, game);
      return NextResponse.json({
        success: true,
        game,
        isGameOver: true,
        lastMove: { row, col },
      });
    }

    // Check for draw
    if (isBoardFull(game.board)) {
      game.status = 'finished';
      game.result = {
        winner: null,
        reason: 'board_full',
      };
      games.set(gameId, game);
      return NextResponse.json({
        success: true,
        game,
        isGameOver: true,
        lastMove: { row, col },
      });
    }

    // Continue game - switch turn
    game.currentTurn = getNextTurn(game.currentTurn);
    games.set(gameId, game);

    return NextResponse.json({
      success: true,
      game,
      isGameOver: false,
      lastMove: { row, col },
    });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR', message: 'Something went wrong' }, { status: 500 });
  }
}
