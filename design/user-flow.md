# caro-phonel — User Flow

## Screen Map

```
[Home / Lobby]
  │
  ├── [Tạo phòng mới] ────→ [Room Modal: enter name] ──→ [Waiting Room]
  │                                  (room created with 6-char code)
  │
  ├── [Nhập mã phòng] ────→ [Join Room: enter code] ──→ [Waiting Room] or [Game]
  │                                     │
  ├── [Room List] ──────────→ [Click room] ──────────→ [Join Room] ──→ [Game]
  │
  └── Direct link: /room/[code] ──────────────────────────→ [Waiting Room] or [Game]
         │
         │ (if room has 2 players and game started)
         ▼
  [Game Room — Playing]
         │
         │ (last move triggers win or board full)
         ▼
  [Result Modal: Win / Draw / Opponent Left]
         │
         ├── [Đấu lại] ──→ [New Game] (same room, same players)
         ├── [Chơi mới] ──→ [Home/Lobby]
         └── [Đóng] ──────→ [Home/Lobby]
```

## Detailed Screen Flows

### [Home / Lobby]
**What user sees**: Game title, "Tạo phòng mới" button, code entry field, public room list.

**Actions**:
- Click "Tạo phòng mới" → open room creation modal
- Enter 6-char code + click "Vào phòng" → attempt to join room
- Click room in list → join that room
- Direct link opened → redirect to /room/[code]

**Transitions**: All actions lead to Waiting Room state.

---

### [Create Room Modal]
**What user sees**: Modal overlay with name input and "Tạo" button.

**Actions**:
- Enter name (optional, defaults to "Anonymous")
- Click "Tạo" → creates room, shows room code + share buttons
- Click outside modal or X → cancel, close modal

**Transitions**: Success → Waiting Room with newly created room.

---

### [Waiting Room]
**What user sees**: Room name, room code (large, copyable), "Đang chờ..." spinner, share link button, player list (1/2 players). Status area shows "Đợi người chơi thứ 2...".

**Actions**:
- Copy Code button → copies 6-char code to clipboard
- Copy Link button → copies full URL to clipboard
- Share via native share API (mobile)
- Click "Hủy" → leave room, return to lobby.

**Transitions**: Second player joins → game auto-starts → Game Room.

---

### [Game Room — Playing]
**What user sees**: 
- Left: My player info (name, stone color, "Lượt của bạn" if my turn)
- Center: 15x15 board with stones placed
- Right: Opponent info (name, stone color)
- Below board: Moves list (last 5 moves with row/col notation)

**Board interactions**:
- Empty cell + your turn + not game over → cell becomes clickable cursor
- Click valid cell → stone placed, board updated, your turn ends
- Hover effect on empty cells during your turn (subtle highlight)
- Last move shows subtle center dot

**Transitions**: Move makes 5-in-a-row → Result Modal (Win).
Move fills board with no winner → Result Modal (Draw).

---

### [Result Modal]
**What user sees**: Overlay modal with result message, player names, result (WIN/LOSE/DRAW), reason ("5 đường thẳng" / "Hòa" / "Đối thủ thoát").

**Actions**:
- Click "Đấu lại" → creates new game in same room, same players
- Click "Chơi mới" → returns to Lobby
- Click "Đóng" → returns to Lobby

**Transitions**: Rematch → new game starts. Others → Lobby.

---

### [Opponent Disconnected]
**What user sees**: Toast notification "Người chơi đã thoát. Bạn thắng!" + optional Result Modal auto-triggered.

**Actions**: Same as Result Modal options.

---

## Mobile Flow Differences
- Lobby: stacked vertically (create button, code input, room list below)
- Game board: full-width, no side panels. Player info above board. Opponent info below board.
- Modal: full-screen takeover on mobile.
- No hover states on mobile — active/pressed states only.
