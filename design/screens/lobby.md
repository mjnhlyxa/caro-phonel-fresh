# Lobby Screen

**Route**: `/` (home page)
**Purpose**: Entry point — player can create room, join by code, or browse public rooms

## Layout (Desktop)

```
+---------------------------------------------------------------+
|  [Header]                                                      |
|  Caro-phonel   (logo + title)                                  |
+---------------------------------------------------------------+
|                                                                |
|   +-------------------+      +-------------------------------+  |
|   |                   |      |                               |  |
|   |  TẠO PHÒNG MỚI   |      |      DANH SÁCH PHÒNG CÔNG    |  |
|   |  (large button)  |      |                               |  |
|   |                   |      |  [RoomCard] Phòng 1 (1/2)     |  |
|   +-------------------+      |  [RoomCard] Phòng 2 (1/2)     |  |
|                               |  [RoomCard] Phòng 3 (0/2)     |  |
|   +-------------------+      |                               |  |
|   |  NHẬP MÃ PHÒNG    |      +-------------------------------+  |
|   |  [____] [Vào]    |                                        |
|   +-------------------+                                        |
|                                                                |
+---------------------------------------------------------------+
```

## Layout (Mobile, 375px)

```
+------------------------+
|  Caro-phonel           |
+------------------------+
|                        |
|  [TẠO PHÒNG MỚI]       |
|                        |
|  Mã phòng: [______]    |
|  [VÀO PHÒNG]          |
|                        |
|  --- Hoặc chọn ---      |
|                        |
|  [RoomCard] Phòng 1   |
|  [RoomCard] Phòng 2   |
|                        |
+------------------------+
```

## Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Logo + Title | "Caro-phonel" text | Static, no interaction |
| Create Room Button | Large primary button | Opens create-room modal on click |
| Room Code Input | Text input, 6-char uppercase | Auto-uppercase, max 6 chars |
| Join Button | Secondary button next to input | Disabled unless 6-char code entered |
| RoomCard | List item showing room name + player count | Click joins that room |
| No Rooms Message | Empty state text | "Chưa có phòng công. Tạo phòng mới để bắt đầu!" |

## States

- **Default**: All elements interactive, room list loaded
- **Loading**: Room list shows skeleton/spinner while fetching
- **Empty**: No public rooms — show placeholder message
- **Error**: Failed to load rooms — show error + retry button
- **Creating**: Create button shows spinner while room creation in progress
- **Joining**: Join button shows spinner, all inputs disabled

## Key Interactions

**Create Room flow**:
1. Click "Tạo phòng mới" button
2. Modal appears with optional name input and "Tạo" button
3. Click "Tạo" → POST /api/rooms → room created
4. Modal updates to show room code + share buttons
5. User is now in Waiting Room state

**Join by Code flow**:
1. Type 6-char code in input (auto uppercase)
2. Click "Vào phòng"
3. POST /api/rooms/{code}/join
4. If room has 1 player → Waiting Room
5. If room has 2 players and game started → Game Room

**Join from List flow**:
1. Browse public room list
2. Click a RoomCard
3. POST /api/rooms/{id}/join
4. Same as above
