# caro-phonel — Database Schema Design

> **C4 Level**: 3 — Component Specification (Database)

## 1. Database Overview

### 1.1 Technology
- **Database**: MongoDB 6.x
-.NET **Host**: 10.60.184.61:27017 (provided IP)
- **ODM**: PyMongo 4.x (native driver, not Mongoose)
- **Database Name**: carophil

### 1.2 Collections Summary
| Collection | Purpose | Est. Doc Size | Growth Rate |
|------------|---------|---------------|-------------|
| rooms | Active game rooms | ~1KB | ~50/day |
| games | Active and completed games | ~3KB | ~50/day |

## 2. Schema Definitions

### 2.1 Room Schema

```python
# apps/api/models/room.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v, field=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class Player(BaseModel):
    id: str                    # Anonymous UUID from localStorage
    name: str = "Anonymous"
    index: int                 # 0 = first player, 1 = second player

class Room(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    code: str                  # 6-char alphanumeric, unique
    name: str                  # Room display name
    isPrivate: bool = False
    currentPlayers: list[Player] = []
    gameId: Optional[str] = None
    status: str = "waiting"   # waiting | full | playing
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
```

### 2.2 Game Schema

```python
# apps/api/models/game.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Move(BaseModel):
    playerId: str
    row: int                  # 0-14 (15x15 board)
    col: int                  # 0-14 (15x15 board)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class GameResult(BaseModel):
    winner: Optional[int] = None  # 1 = black, 2 = white, null = draw
    reason: Optional[str] = None   # "five_in_row" | "board_full" | "opponent_left"

class Game(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    roomId: str                # Reference to room
    players: list[Player]      # Max 2 players
    board: list[list[int | None]]  # 15x15: None | 1 | 2
    currentTurn: int = 1      # 1 = black (first), 2 = white (second)
    moves: list[Move] = []
    status: str = "waiting"   # waiting | playing | finished | abandoned
    result: Optional[GameResult] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
```

### 2.3 Indexes

```python
# apps/api/db.py
from pymongo import ASCENDING

# Rooms collection indexes
rooms_collection.create_index([("code", ASCENDING)], unique=True)
rooms_collection.create_index([("status", ASCENDING), ("createdAt", ASCENDING)])

# Games collection indexes
games_collection.create_index([("roomId", ASCENDING)])
games_collection.create_index([("status", ASCENDING), ("updatedAt", ASCENDING)])
```

## 3. Query Patterns & Indexes

### 3.1 Common Queries
| Query | Collection | Index Used |
|-------|-----------|------------|
| Get room by code | rooms | `code_1` (unique) |
| List public open rooms | rooms | `status_1, createdAt_-1` |
| Get game by room | games | `roomId_1` |
| Recent games | games | `status_1, updatedAt_-1` |
| Get player's room | rooms | `currentPlayers.id_1` |

### 3.2 Board State Encoding
- `board`: 15x15 nested list — `board[row][col]`
- `None` = empty cell
- `1` = black stone (Player 0, first move)
- `2` = white stone (Player 1)

## 4. Data Retention

| Data Type | Retention | Auto-Delete |
|----------|-----------|-------------|
| Rooms (empty, waiting > 30 min) | 30 min | TTL index |
| Rooms (with game playing) | Until game ends | No |
| Games (finished) | 90 days | TTL index |
| Games (abandoned) | 7 days | TTL index |

## 5. Example Documents

### 5.1 Room Document Example
```json
{
  "_id": ObjectId("6651a2b3c4d5e6f7a8b9c0d1"),
  "code": "ABC123",
  "name": "Phòng của Minh",
  "isPrivate": false,
  "currentPlayers": [
    { "id": "uuid-player-1", "name": "Minh", "index": 0 },
    { "id": "uuid-player-2", "name": "Lan", "index": 1 }
  ],
  "gameId": ObjectId("6651a2b3c4d5e6f7a8b9c0d2"),
  "status": "playing",
  "createdAt": ISODate("2026-05-29T10:00:00Z"),
  "updatedAt": ISODate("2026-05-29T10:05:00Z")
}
```

### 5.2 Game Document Example
```json
{
  "_id": ObjectId("6651a2b3c4d5e6f7a8b9c0d2"),
  "roomId": ObjectId("6651a2b3c4d5e6f7a8b9c0d1"),
  "players": [
    { "id": "uuid-player-1", "name": "Minh", "index": 0 },
    { "id": "uuid-player-2", "name": "Lan", "index": 1 }
  ],
  "board": [
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, 1, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    ...
  ],
  "currentTurn": 2,
  "moves": [
    { "playerId": "uuid-player-1", "row": 3, "col": 8, "timestamp": ISODate("2026-05-29T10:00:30Z") }
  ],
  "status": "playing",
  "result": null,
  "createdAt": ISODate("2026-05-29T10:00:05Z"),
  "updatedAt": ISODate("2026-05-29T10:00:30Z")
}
```
