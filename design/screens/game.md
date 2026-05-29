# Game Screen

**Route**: `/room/[roomId]`
**Purpose**: The main gameplay interface — board, player info, real-time sync

## Layout (Desktop)

```
+---------------------------------------------------------------+
|  [Header]  Caro-phonel  |  Room: ABC123  |  [Thoát]          |
+---------------------------------------------------------------+
|            |                                  |              |
|  +---------+--+                    +----------+-----------+  |
|  | Player 1  |                    |                        |  |
|  | Minh       |                    |    15x15 GAME BOARD     |  |
|  | ⬤ C黑     |                    |                        |  |
|  | [Đợi...]  |                    |    (clickable grid)    |  |
|  +-----------+                    |                        |  |
|                                  |                        |  |
|  +-----------+                    +------------------------+  |
|  | Player 2  |                                                       |
|  | Lan       |                    +------------------------+  |
|  | ⬤ 白     |                    |  Last move: H7          |  |
|  | [Lượt]   |                    |  Moves: 12              |  |
|  +-----------+                    +------------------------+  |
+---------------------------------------------------------------+
```

## Layout (Mobile, 375px)

```
+----------------------------+
|  Caro-phonel  | ABC123 | X |
+----------------------------+
|  [Player 1: Minh / ⬤]  [▶] |
+----------------------------+
|                            |
|     15x15 GAME BOARD       |
|     (full width)            |
|                            |
+----------------------------+
|  [Player 2: Lan / ⬤]      |
+----------------------------+
|  Last: H7 | Moves: 12     |
+----------------------------+
```

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Header | Logo, room code, exit button | Room code is copyable |
| GameBoard | 15x15 CSS grid | Cells clickable on your turn |
| Cell | Individual board cell | Shows stone or empty |
| PlayerPanel (x2) | Player name, stone type, turn indicator | Highlights current player's panel |
| MoveHistory | Scrollable list of moves in notation | First player black, second white |
| LastMoveIndicator | Shows row/col of most recent move | e.g., "H7" notation |
| Exit Button | Returns to lobby | Confirms if game in progress |

## Cell States

- **Empty + your turn + game active**: cursor: pointer, hover highlight
- **Empty + opponent turn**: cursor: default, no hover (disabled state)
- **Empty + game over**: cursor: default, unclickable
- **Occupied by black**: Black circle with 黑 character
- **Occupied by white**: White circle with 白 character
- **Winning cell**: Gold ring animation around stone
- **Last move**: Center dot indicator on stone

## Game States

- **Waiting**: Second player not yet joined → board blank, "Đợi người chơi..." overlay
- **Playing**: Normal game in progress → board interactive if your turn
- **GameOver**: Board frozen, ResultModal shown

## Key Interactions

**Make a move**:
1. Click empty cell on your turn
2. Optimistic UI: board updates immediately with your stone
3. emit make_move via socket
4. Server validates → updates MongoDB → broadcasts game_update
5. If win detected → game_over event → Result Modal

**Win condition**:
- 5 consecutive stones horizontal, vertical, or diagonal
- Win detected server-side on each move
- Winning cells highlighted with gold animation
- Result modal shows winner + "5 đường thẳng"

**Draw condition**:
- All 225 cells occupied with no 5-in-a-row
- Result modal shows "Hòa!" (Draw)

**Opponent disconnect**:
- Socket detects disconnect event
- Toast notification shown
- If game in progress, forfeit win awarded
- Result modal auto-shown with "Đối thủ thoát"
