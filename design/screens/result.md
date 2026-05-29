# Result Screen (Modal)

**Route**: `/room/[roomId]` (overlay modal)
**Purpose**: Show game outcome with options to rematch or return to lobby

## Layout (Desktop)

```
+--------------------------------------------------+
|                                                  |
|              +----------------------------+       |
|              |                             |       |
|              |      ✨ KẾT QUẢ ✨          |       |
|              |                             |       |
|              |    "BẠN THẮNG!"            |       |
|              |    (or thua / hòa)         |       |
|              |                             |       |
|              |    Lý do: 5 đường thẳng    |       |
|              |                             |       |
|              |   [Đấu lại]  [Chơi mới]    |       |
|              |                             |       |
|              +----------------------------+       |
|                                                  |
+--------------------------------------------------+
```

**Overlay**: Semi-transparent dark backdrop (rgba(0,0,0,0.7))

## Result Variations

| Result | Title | Color | Reason |
|--------|-------|-------|--------|
| Win | BẠN THẮNG! | Success green | 5 đường thẳng |
| Lose | BẠN THUA! | Error red | Đối thủ được 5 đường |
| Draw | HÒA! | Warning amber | Hòa — cờ đầy |
| Opponent Left | ĐỐI THỦ ĐÃ THOÁT | Info blue | Đối thủ rời phòng |

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Backdrop | Dark overlay | Click "Đóng" to close |
| Title | Result text | Static |
| Reason | Text explaining outcome | Static |
| Rematch Button | Primary gold button | Creates new game in same room |
| New Game Button | Secondary button | Returns to lobby |
| Close Button | Ghost button (X) | Returns to lobby |

## States

- **Win**: Green title, confetti-style star decorations
- **Lose**: Red title, subdued styling
- **Draw**: Amber title, neutral styling
- **Opponent Left**: Blue info styling

## Key Interactions

**Rematch flow**:
1. Click "Đấu lại"
2. POST /api/games (new game in same room)
3. Board resets, new game starts
4. Same players, new game state

**New Game / Close flow**:
1. Click "Chơi mới" or "Đóng"
2. Navigate to / (lobby)
3. Room is cleared for that player
