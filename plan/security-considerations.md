# caro-phonel — Security Considerations

> **C4 Level**: 3 — Security Design Components

## 1. Anonymous Player Identity

- Player ID: UUID v4 generated via `crypto.randomUUID()` stored in localStorage
- Player name: User-chosen, defaults to "Anonymous"
- No PII collected — no emails, no accounts
- No data retention beyond game lifetime

## 2. Input Validation

### 2.1 FastAPI/Pydantic Validation
```python
class MoveRequest(BaseModel):
    playerId: str = Field(..., min_length=36, max_length=36)  # UUID format
    row: int = Field(..., ge=0, le=14)  # 15x15 board
    col: int = Field(..., ge=0, le=14)

class JoinRoomRequest(BaseModel):
    playerId: str = Field(..., min_length=36, max_length=36)
    playerName: str = Field(..., min_length=1, max_length=20)
```

### 2.2 Server-Side Rules
- All coordinates must be integers 0-14
- Player ID must be valid UUID in the game's player list
- Room code must exist in database
- Move must match current turn

## 3. Room Code Security

- 6-character alphanumeric (A-Z, 0-9)
- 36^6 = ~2 billion possible combinations
- Unguessable for shareable links
- Rate limited: max 10 room creations per IP per minute

## 4. CORS Configuration

```python
# apps/api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 5. Rate Limiting

- Vercel provides built-in rate limiting
- Additional safeguard: max 10 API calls/second per IP
- WebSocket: max 1 move per 500ms

## 6. WebSocket Security

- Socket.IO connections authenticated via playerId + room membership
- Server validates playerId is actually in the room before processing
- Invalid room access: immediate socket disconnect

## 7. Dependencies Security

| Package | Version | Security Notes |
|---------|---------|----------------|
| uvicorn | latest | Production ASGI server |
| python-socketio | 4.x | WebSocket wrapper |
| pydantic | 2.x | Input validation |
| mongomock | latest | Safe MongoDB |
