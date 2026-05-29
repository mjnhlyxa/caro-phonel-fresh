# caro-phonel — State Management Design

> **C4 Level**: 3 — State Management Components

## 1. State Categories

### 1.1 Server State (Persisted in MongoDB)
- Room state (players, status, code)
- Game state (board, moves, currentTurn, result)
- All state is stored via FastAPI → MongoDB

### 1.2 Client State (In-Memory/React)
- UI state (modals open/closed, isCreating, isJoining)
- Socket connection state (connected/disconnected)
- Local playerId (generated once, stored in localStorage)
- Local game cache (for offline viewing)

### 1.3 URL State
- Room code in path (/room/ABC123) — shareable link
- Game ID embedded in room

## 2. State Management Approach

### 2.1 Global State (React Context)
```typescript
// src/lib/GameContext.tsx
interface GameState {
  playerId: string;           // Persisted in localStorage
  playerName: string;
  currentRoom: Room | null;
  currentGame: Game | null;
  socket: Socket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}
```

### 2.2 Component-Level State (useState/useReducer)

Game page state:
```typescript
const [gameState, setGameState] = useState<Game | null>(null);
const [isMyTurn, setIsMyTurn] = useState(false);
const [showResult, setShowResult] = useState(false);
```

Lobby page state:
```typescript
const [joinCode, setJoinCode] = useState('');
const [isCreating, setIsCreating] = useState(false);
```

### 2.3 WebSocket State Sync

```typescript
// On receiving game_update event
socket.on('game_update', (game: Game) => {
  setGameState(game);
  setIsMyTurn(game.currentTurn === currentPlayerIndex + 1);
  if (game.status === 'finished') {
    setShowResult(true);
  }
});
```

## 3. Data Flow

```
User clicks cell
       ↓
onCellClick(row, col)
       ↓
emit make_move via socket
       ↓
Server validates → updates MongoDB → broadcasts game_update
       ↓
Socket receives game_update
       ↓
setGameState(newGame)
       ↓
React re-renders board
```

## 4. Player Identity

```typescript
// src/lib/player.ts
const PLAYER_ID_KEY = 'carophil_player_id';
const PLAYER_NAME_KEY = 'carophil_player_name';

export function getOrCreatePlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string {
  return localStorage.getItem(PLAYER_NAME_KEY) || 'Anonymous';
}

export function setPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name);
}
```
