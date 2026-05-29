# caro-phonel — API Design

> **C4 Level**: 3 — Component Specification (API)

## 1. API Overview

**Base URL**: `https://api.caro-phonel.vercel.app/api`

All endpoints return JSON. Content-Type: application/json for POST/PUT requests.
No authentication required (anonymous play).

## 2. REST API Endpoints

### 2.1 Room Endpoints

#### POST /api/rooms — Create Room
**Request:**
```json
{
  "name": "Phòng của Minh",
  "playerId": "uuid-player-1",
  "playerName": "Minh"
}
```
**Response (201 Created):**
```json
{
  "id": "6651a2b3c4d5e6f7a8b9c0d1",
  "code": "ABC123",
  "name": "Phòng của Minh",
  "isPrivate": false,
  "currentPlayers": [
    { "id": "uuid-player-1", "name": "Minh", "index": 0 }
  ],
  "gameId": null,
  "status": "waiting",
  "shareUrl": "/room/ABC123"
}
```
**Error (400 Bad Request):**
```json
{
  "error": "INVALID_REQUEST",
  "message": "name is required and must be between 1-50 characters"
}
```

#### GET /api/rooms — List Open Rooms
**Response (200 OK):**
```json
{
  "rooms": [
    {
      "id": "6651a2b3c4d5e6f7a8b9c0d1",
      "code": "ABC123",
      "name": "Phòng của Minh",
      "currentPlayers": [{ "id": "uuid-1", "name": "Minh", "index": 0 }],
      "status": "waiting"
    }
  ]
}
```

#### GET /api/rooms/{roomIdOrCode} — Get Room Details
**Parameters:** `roomIdOrCode` — MongoDB _id or 6-char code
**Response (200 OK):**
```json
{
  "id": "6651a2b3c4d5e6f7a8b9c0d1",
  "code": "ABC123",
  "name": "Phòng của Minh",
  "isPrivate": false,
  "currentPlayers": [
    { "id": "uuid-1", "name": "Minh", "index": 0 }
  ],
  "gameId": null,
  "status": "waiting",
  "createdAt": "2026-05-29T10:00:00Z"
}
```
**Error (404 Not Found):**
```json
{
  "error": "ROOM_NOT_FOUND",
  "message": "Room not found"
}
```

#### POST /api/rooms/{roomId}/join — Join Room
**Request:**
```json
{
  "playerId": "uuid-player-2",
  "playerName": "Lan"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "room": { ... full room object ... },
  "playerIndex": 1,
  "gameId": null
}
```
**Error (409 Conflict):**
```json
{
  "error": "ROOM_FULL",
  "message": "Room already has 2 players"
}
```

#### DELETE /api/rooms/{roomId}/leave — Leave Room
**Request:**
```json
{
  "playerId": "uuid-player-2"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Left room successfully"
}
```

### 2.2 Game Endpoints

#### POST /api/games — Create Game (auto when room is full)
Called automatically when second player joins, or manually to start a game.
**Request:**
```json
{
  "roomId": "6651a2b3c4d5e6f7a8b9c0d1",
  "playerId": "uuid-player-1"
}
```
**Response (201 Created):**
```json
{
  "id": "6651a2b3c4d5e6f7a8b9c0d2",
  "roomId": "6651a2b3c4d5e6f7a8b9c0d1",
  "players": [
    { "id": "uuid-player-anc", "name": "Minh", "index": 0 },
    { "id": "uuid-player-2", "name": "Lan", "index": 1 }
  ],
  "board": "[[null, null, ...], ...]",
  "currentTurn": 1,
  "moves": [],
  "status": "playing",
  "result": null
}
```

#### GET /api/games/{gameId} — Get Game State
**Response (200 OK):**
```json
{
  "id": "6651a2b3c4d5e6f7a8b9c0d2",
  "roomId": "6651a2b3c4d5e6f7a8b9c0d1",
  "players": [...],
  "board": [[null, 1, null, ...], ...],
  "currentTurn": 2,
  "moves": [
    { "playerId": "uuid-player-1", "row": 7, "col": 7, "timestamp": "..." }
  ],
  "status": "playing",
  "result": null
}
```

#### POST /api/games/{gameId}/move — Place Stone
**Request:**
```json
{
  "playerId": "uuid-player-1",
  "row": 7,
  "col": 7
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "game": { ... full updated game state ... },
  "isGameOver": false,
  "lastMove": { "row": 7, "col": 7 }
}
```
**Response (Game Over - Win):**
```json
{
  "success": true,
  "game": { ... },
  "isGameOver": true,
  "lastMove": { "row": 7, "col": 7 },
  "result": {
    "winner": 1,
    "reason": "five_in_row"
  }
}
```
**Error (400 Bad Move):**
```json
{
  "success": false,
  "error": "INVALID_MOVE",
  "message": "Cell already occupied"
}
```
**Error (403 Not Your Turn):**
```json
{
  "success": false,
  "error": "NOT_YOUR_TURN",
  "message": "It is not your turn"
}
```

## 3. WebSocket Events (Socket.IO)

**Namespace**: `/`
**Endpoint**: `wss://api.caro-phonel.vercel.app/socket.io/`

### 3.1 Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId: string, playerId: string }` | Join room's WebSocket room |
| `leave_room` | `{ roomId: string, playerId: string }` | Leave WebSocket room |
| `make_move` | `{ gameId: string, playerId: string, row: number, col: number }` | Place stone |
| `ping` | — | Keep-alive ping |

### 3.2 Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `room_update` | `{ room: Room }` | Room state changed |
| `game_start` | `{ game: Game }` | Game started (2 players joined) |
| `game_update` | `{ game: Game }` | Move made, board changed |
| `game_over` | `{ winner: number, reason: string, game: Game }` | Game ended |
| `opponent_joined` | `{ player: Player }` | Other player joined room |
| `opponent_left` | `{ playerId: string }` | Other player left room |
| `error` | `{ code: string, message: string }` | Error occurred |
| `pong` | — | Keep-alive response |

## 4. Error Handling

### 4.1 Error Response Format
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable message"
}
```

### 4.2 Error Codes
| HTTP Code | Error Code | Meaning |
|-----------|-----------|---------|
| 400 | INVALID_REQUEST | Malformed request body |
| 400 | INVALID_MOVE | Cell occupied or out of bounds |
| 403 | NOT_YOUR_TURN | Player trying to move out of turn |
| 403 | GAME_NOT_ACTIVE | Game already finished |
| 404 | GAME_NOT_FOUND | Game ID does not exist |
| 404 | ROOM_NOT_FOUND | Room ID does not exist |
| 409 | ROOM_FULL | Cannot join — room has 2 players |
| 409 | ALREADY_JOINED | Player already in room |
| 429 | RATE_LIMITED | Too many requests |

## 5. Request/Response Examples

### 5.1 Full Game Flow

**Step 1: Player A creates room**
```bash
curl -X POST https://api.caro-phonel.vercel.app/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"name": "Phòng caro", "playerId": "uuid-a", "playerName": "Minh"}'
```

**Step 2: Player B joins room via code**
```bash
curl -X POST https://api.caro-phonel.vercel.app/api/rooms/ABC123/join \
  -H "Content-Type: application/json" \
  -d '{"playerId": "uuid-b", "playerName": "Lan"}'
```

**Step 3: Player A makes a move**
```bash
curl -X POST https://api.caro-phonel.vercel.app/api/games/{gameId}/move \
  -H "Content-Type: application/json" \
  -d '{"playerId": "uuid-a", "row": 7, "col": 7}'
```

**Step 4: Player B makes a response**
```bash
curl -X POST https://api.caro-phonel.vercel.app/api/games/{gameId}/move \
  -H "Content-Type: application/json" \
  -d '{"playerId": "uuid-b", "row": 8, "col": 8}'
```
