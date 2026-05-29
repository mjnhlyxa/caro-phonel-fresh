# caro-phonel — Component Specifications

## ui/Button
**Purpose**: Reusable button across all UI
**Used on**: Lobby, Game, Result Modal
**Props**:
- `variant`: "primary" | "secondary" | "ghost" | "danger"
- `size`: "sm" I "md" | "lg"
- `disabled`: boolean
- `loading`: boolean
- `children`: React.ReactNode
- `onClick`: () => void
**States**: default, hover (brightness), active (pressed scale), disabled (opacity 50%), loading (spinner)

## ui/Input
**Purpose**: Text input field
**Used on**: Lobby (room code entry), Create Room Modal (name input)
**Props**:
- `value`: string
- `onChange`: (e: React.ChangeEvent) => void
- `placeholder`: string
- `label`: string
- `error`: string
- `maxLength`: number
- `autoFocus`: boolean
**States**: default, focus (gold border), error (red border + message), disabled

## ui/Modal
**Purpose**: Overlay dialog for create room, result display
**Used on**: Create Room, Result
**Props**:
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode
- `closable`: boolean
**States**: open, closed; closable adds X button + backdrop click closes

## ui/Card
**Purpose**: Container for room list items, panels
**Used on**: Lobby (room list), Game (player panels)
**Props**:
- `children`: React.ReactNode
- `className`: string
- `hoverable`: boolean
- `onClick`: () => void
**States**: default, hover (lift shadow + translateY(-2px))

## ui/Badge
**Purpose**: Status indicators (waiting, playing, your turn)
**Used on**: Player panels, room list items
**Props**:
- `variant`: "info" | "success" | "warning" | "error" | "neutral"
**States**: single variant per usage (static)

## game/GameBoard
**Purpose**: 15x15 interactive Gomoku board
**Used on**: Game screen
**Props**:
- `board`: (number | null)[][]
- `currentTurn`: 1 | 2
- `playerId`: string
- `gameStatus`: "waiting" | "playing" | "finished"
- `lastMove`: { row: number, col: number } | null
- `winningCells`: [row, col][]
- `onCellClick`: (row: number, col: number) => void
**States**: Your turn (interactive hover on empty cells), opponent turn (disabled), game over (frozen)

## game/Cell
**Purpose**: Individual board cell with stone or empty
**Used on**: GameBoard
**Props**:
- `value`: number | null (1=black, 2=white, null=empty)
- `row`: number
- `col`: number
- `isInteractive`: boolean (your turn + empty)
- `isLastMove`: boolean
- `isWinning`: boolean
- `onClick`: () => void
**States**: empty (hoverable), occupied-black, occupied-white, last-move (center dot), winning (gold ring), disabled (no hover)

## game/PlayerPanel
**Purpose**: Displays player info + turn status
**Used on**: Game screen
**Props**:
- `player`: { id: string; name: string; stone: 1 | 2 }
- `isCurrentTurn`: boolean
- `isConnected`: boolean
**States**: active (isCurrentTurn → gold glow border), waiting (dimmed), disconnected (greyed + badge)

## game/ResultModal
**Purpose**: Game over overlay with outcome display
**Used on**: Game screen (shown when gameStatus === 'finished')
**Props**:
- `isOpen`: boolean
- `result`: { winner: 1 | 2 | null; reason: string }
- `playerId`: string
- `players`: Array<{ id: string; name: string; stone: 1 | 2 }>
- `onRematch`: () => void
- `onNewGame`: () => void
- `onClose`: () => void
**States**: win, lose, draw, opponent-left

## game/RoomCard
**Purpose**: List item for public room in lobby
**Used on**: Lobby
**Props**:
- `room`: { id: string; name: string; code: string; currentPlayers: Array; status: string }
- `onJoin`: () => void
**States**: default, hover (lift), full (1/2 badge text)

## game/ShareButtons
**Purpose**: Copy room code and share link
**Used on**: Waiting Room, Game screen header
**Props**:
- `roomCode`: string
- `shareUrl`: string
**States**: default, copied (shows "Đã copy!" feedback for 2s)
