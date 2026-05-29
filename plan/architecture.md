# caro-phonel — Container Architecture

> **C4 Level**: 2 — Container/Application Architecture

## 1. Application Structure

### 1.1 High-Level Container Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      BROWSER CLIENT                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 Application (Bun)                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │  Lobby      │  │  Game Page   │  │  Result Overlay  │  │  │
│  │  │  Page       │  │  (roomId)    │  │  (Win/Draw)      │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │           Game Engine (Pure JS/TS)               │    │  │
│  │  │  - isValidMove(): check if move is legal          │    │  │
│  │  │  - checkWin(): detect 5-in-a-row winner          │    │  │
│  │  │  - Board state: 15x15 null/1/2 array             │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │           Socket.IO Client                        │    │  │
│  │  │  - Connect to server                              │    │  │
│  │  │  - Emit: join_room, make_move                     │    │  │
│  │  │  - On: room_update, game_over, opponent_move     │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                    HTTP REST + WebSocket                        │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Bun Monorepo (apps/)                          │  │
│  │                                                            │  │
│  │  ┌─────────────────────┐  ┌────────────────────────────┐    │  │
│  │  │  apps/web          │  │  apps/api                 │    │  │
│  │  │  (Next.js 15)      │  │  (FastAPI + Socket.IO)    │    │  │
│  │  │  - :3000           │  │  - :3001                  │    │  │
│  │  │  - Landing page    │  │  - Room CRUD              │    │  │
│  │  │  - Game room page  │  │  - Game logic             │    │  │
│  │  │  - Client socket   │  │  - Socket.IO server       │    │  │
│  │  └──────────┬─────────┘  └────────────┬─────────────┘    │  │
│  │             │                         │                   │  │
│  └─────────────┼─────────────────────────┼───────────────────┘  │
│                │                         │                       │
│                │    HTTP REST            │  WebSocket           │
│                │                         │                       │
│  ┌─────────────▼─────────────────────────▼───────────────────┐  │
│  │               MongoDB (10.60.184.61:27017)                │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐  │  │
│  │  │  rooms         │  │  games                          │  │  │
│  │  │  collection    │  │  collection                     │  │  │
│  │  └─────────────────┘  └─────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture (apps/web)

### 2.1 Pages/Routes
| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG | Lobby page: create room, join room, room list |
| `/room/[roomId]` | CSR | Main game page with board and real-time sync |
| `/api/socket` | WebSocket | Socket.IO endpoint (proxied) |

### 2.2 Directory Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Lobby (SSG)
│   │   ├── globals.css
│   │   └── room/
│   │       └── [roomId]/
│   │           └── page.tsx        # Game room (client component)
│   ├── components/
│   │   ├── ui/                     # Generic UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   └── game/                   # Game-specific UI
│   │       ├── GameBoard.tsx       # 15x15 board grid
│   │       ├── Cell.tsx            # Individual clickable cell
│   │       ├── PlayerInfo.tsx      # Player name + turn indicator
│   │       └── ResultModal.tsx     # Win/Draw overlay
│   ├── lib/
│   │   ├── socket.ts               # Socket.IO client singleton
│   │   ├── player.ts              # Anonymous ID management
│   │   └── caro-engine.ts         # Pure game logic (no DB deps)
│   │       ├── types.ts           # Cell, Position, Player, GameState
│   │       ├── validate.ts        # isValidMove(board, row, col, player)
│   │       └── wincheck.ts        # checkWin(board, row, col) → winner
│   └── types/
│       └── index.ts                # Shared TypeScript types
├── package.json
├── next.config.ts
└── tsconfig.json
```

### 2.3 State Management
- **Server State**: fetch API with SWR-like polling (3s interval)
- **Client State**: React useState/useReducer for UI state
- **Game State**: Synced via WebSocket, MongoDB is source of truth
- **URL State**: roomId in path for shareability

## 3. Backend Architecture (apps/api)

### 3.1 FastAPI Endpoints

#### Room Management
```
POST /api/rooms
  Body: { "name": string }
  Response: { "id": string, "code": string, "name": string, ... }
  Creates a new room, returns 6-char code for sharing

GET /api/rooms
  Response: { "rooms": Room[] }
  Returns list of public open rooms

GET /api/rooms/{roomId}
  Response: Room with current players and game state

POST /api/rooms/{roomId}/join
  Body: { "playerId": string, "playerName": string }
  Response: { "success": true, "room": Room, "playerIndex": number }
  Joins player to room

DELETE /api/rooms/{roomId}/leave
  Body: { "playerId": string }
  Removes player from room
```

#### Game Management
```
POST /api/games
  Body: { "roomId": string, "playerId": string }
  Response: { "id": string, "board": [][], "currentTurn": 1|2, ... }
  Creates new game in room

GET /api/games/{gameId}
  Response: Full game state

POST /api/games/{gameId}/move
  Body: { "playerId": string, "row": number, "col": number }
  Response: { "success": true, "game": GameState, "isGameOver": boolean }
  Validates and applies move
```

### 3.2 WebSocket Events (Socket.IO)

```
Client → Server:
  join_room(roomId, playerId)      # Join a room's WebSocket room
  make_move(gameId, playerId, row, col)  # Place a stone

Server → Client:
  room_update(room)                # Player joined/left
  game_update(game)                # Board state changed
  opponent_disconnected()          # Other player lost connection
  game_over(winner, reason)        # Game ended
  error(message)                   # Error occurred
```

### 3.3 Data Models

#### Room Document (MongoDB)
```javascript
{
  _id: ObjectId,
  code: string,           // 6-char alphanumeric, unique
  name: string,           // Room display name
  isPrivate: boolean,    // Default false
  currentPlayers: [{
    id: string,          // Anonymous UUID (localStorage)
    name: string,        // Player display name
    index: number       // 0 or 1 (first/second player)
  }],
  gameId: ObjectId | null,  // null until game starts
  status: 'waiting' | 'full' | 'playing',
  createdAt: Date,
  updatedAt: Date
}
```

#### Game Document (MongoDB)
```javascript
{
  _id: ObjectId,
  roomId: ObjectId,           // Reference to room
  players: [{
    id: string,              // Anonymous UUID
    name: string,
    index: number           // 0 = black (first), 1 = white (second)
  }],
  board: [[null, ...], ...], // 15x15: null | 1 | 2
  currentTurn: 1 | 2,        // Whose turn (1 = black, 2 = white)
  moves: [{                  // Move history
    playerId: string,
    row: number,
    col: number,
    timestamp: Date
  }],
  status: 'waiting' | 'playing' | 'finished' | 'abandoned',
  result: {
    winner: 1 | 2 | null,   // null = draw
    reason: string           // '5_in_row' | 'board_full' | 'opponent_left'
  } | null,
  createdAt: Date,
  updatedAt: Date
}
```

## 4. Real-time Communication Architecture

### 4.1 Socket.IO Setup
```
apps/api/
├── main.py                  # FastAPI app + Socket.IO mount
├── socket_manager.py       # Socket.IO connection manager
└── events.py               # Event handlers

Client connects via: window.location.origin (same domain)
Vercel proxies /api/socket → apps/api:3001/socket.io/
```

### 4.2 Connection Flow
1. Player A creates room → API returns room ID + 6-char code
2. Player A shares link (caro-phonel.vercel.app/room/[code])
3. Player B opens link → joins room via POST /api/rooms/{id}/join
4. Client opens WebSocket to /api/socket
5. Client emits `join_room(roomId, playerId)`
6. Server broadcasts `game_start` to both players when 2 players present
7. During game, each move broadcasts `game_update` to room

### 4.3 Reconnection Strategy
- Socket.IO auto-reconnects with exponential backoff
- On reconnect: client re-emits `join_room` with existing playerId
- Server responds with current `room_update` and `game` state
- No data loss on temporary disconnects

## 5. Deployment Architecture

```
                        ┌─────────────────────┐
                        │   Cloudflare CDN     │
                        │  - DDoS protection  │
                        │  - SSL termination  │
                        │  - Static caching   │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │  Vercel Domains     │
                        │  - DNS routing      │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
    ┌─────────▼──────────┐                  ┌──────────▼──────────┐
    │  apps/web         │                  │  apps/api          │
    │  (Next.js)        │                  │  (FastAPI)          │
    │  Vercel Serverless│                  │  Vercel Serverless  │
    │  - :3000          │                  │  - :3001            │
    └───────────────────┘                  └─────────────────────┘
              │                                         │
              │              HTTP REST + WS             │
              └────────────────────┬───────────────────┘
                                   │
                        ┌─────────▼──────────┐
                        │  MongoDB            │
                        │  10.60.184.61:27017 │
                        └────────────────────┘
```

## 6. Environment Variables

```bash
# apps/api/.env
MONGODB_URI=mongodb://10.60.184.61:27017
DATABASE_NAME=carophil
DEBUG=false

# apps/web/.env.local
NEXT_PUBLIC_API_URL=https://api.caro-phonel.vercel.app
NEXT_PUBLIC_WS_URL=wss://api.caro-phonel.vercel.app
```
