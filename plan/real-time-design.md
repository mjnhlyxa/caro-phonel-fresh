# caro-phonel — Real-time Communication Design

> **C4 Level**: 3 — Real-time Component Design

## 1. Approach: WebSocket via Socket.IO

### 1.1 Why Socket.IO
- Automatic reconnection with exponential backoff
- Fallback to polling if WebSocket fails
- Room/namespace support perfect for game rooms
- Used by both frontend (JS) and backend (Python)

### 1.2 Architecture
```
┌─────────────┐                    ┌─────────────────┐
│  Browser    │◄──── WebSocket ───►│  FastAPI        │
│  Client     │                    │  (Socket.IO)    │
│  (Next.js)  │                    │  apps/api       │
└─────────────┘                    └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │   MongoDB       │
                                   │ 10.60.184.61   │
                                   └────────────────┘
```

## 2. Socket Events

### 2.1 Event Flow

**On page load:**
```typescript
const socket = io('/', {
  path: '/api/socket.io/'
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
  // Rejoin room if reconnecting
  if (roomId && playerId) {
    socket.emit('join_room', { roomId, playerId });
  }
});
```

**On join room (server):**
```
Client emits: join_room({ roomId, playerId })
     ↓
Server validates player in room
     ↓
Server joins socket to room: socket.join(roomId)
     ↓
Server emits to room: opponent_joined({ player })
     ↓
If 2 players now present → emit game_start to all
```

**On make move:**
```
Client emits: make_move({ gameId, playerId, row, col })
     ↓
Server validates move
     ↓
Server updates MongoDB game document
     ↓
Server emits to room: game_update({ game })
     ↓
If game over → emit game_over({ winner, reason, game })
```

## 3. Reconnection Strategy

### 3.1 Client-Side
```typescript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Exponential backoff handled automatically by Socket.IO
});

socket.on('reconnect', () => {
  // Rejoin room with same playerId
  socket.emit('join_room', { roomId, playerId });
});
```

### 3.2 Server-Side (FastAPI)
- Socket.IO server maintains room state in memory
- On reconnect, server can re-emit current room state
- Game state always from MongoDB (source of truth)

## 4. Health Check / Keep-Alive

### 4.1 Ping-Pong
```typescript
// Client sends ping every 30s
setInterval(() => {
  socket.emit('ping');
}, 30000);

socket.on('pong', () => {
  // Connection alive
});
```

## 5. Error Handling

### 5.1 Server Errors emitted to client
| Error | Code | When |
|-------|------|------|
| Invalid move | INVALID_MOVE | Cell occupied or out of bounds |
| Not your turn | NOT_YOUR_TURN | Move out of turn |
| Game not active | GAME_NOT_ACTIVE | Game already finished |
| Room full | ROOM_FULL | Third player attempts join |

### 5.2 Client Error Display
- Toast notifications for transient errors
- Modal for critical errors (kicked, room closed)
- Auto-reconnect on disconnect
