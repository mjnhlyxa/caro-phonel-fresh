# Acceptance Criteria — caro-phonel

> **Status**: Draft | Created: 2026-05-29 | Based on: plan/ + design/
> **Format**: Given-When-Then (BDD)
> **Total ACs**: 42

---

## Table of Contents
1. [Anonymous Identity](#1-anonymous-identity)
2. [Room Management](#2-room-management)
3. [Core Gameplay](#3-core-gameplay)
4. [Real-time Updates](#4-real-time-updates)
5. [Mobile Experience](#5-mobile-experience)
6. [Error Handling](#6-error-handening)
7. [Data Persistence](#7-data-persistence)

---

## 1. Anonymous Identity

### AC-ID-001: Anonymous player ID is generated on first visit
**Given**: Player opens the game for the first time (no localStorage data)
**When**: The game page loads
**Then**: A unique UUID (v4) is generated and stored in localStorage as `carophil_player_id`

### AC-ID-002: Player ID persists across page reloads
**Given**: Player has a `carophil_player_id` in localStorage
**When**: Player reloads the page or opens a new browser tab
**Then**: The same `carophil_player_id` is retrieved and used

### AC-ID-003: Default player name is "Anonymous"
**Given**: Player has no name set in localStorage
**When**: Player creates or joins a room
**Then**: The player name displays as "Anonymous"

### AC-ID-004: Player name can be set locally
**Given**: Player sets their name to "Minh" in localStorage
**When**: Player joins a room
**Then**: The room shows "Minh" as the player name

---

## 2. Room Management

### AC-ROOM-001: Player can create a public room
**Given**: Player is on the lobby page
**When**: Player clicks "Tạo phòng mới", enters "Phòng Test", and confirms
**Then**: A new public room named "Phòng Test" is created with a unique 6-char code, and the player is shown the Waiting Room screen

### AC-ROOM-002: Room name is required
**Given**: Player is on the lobby page and opens the "Create Room" dialog
**When**: Player clicks "Tạo" without entering a room name
**Then**: An error message "Vui lòng nhập tên phòng" appears, and no room is created

### AC-ROOM-003: Room name max length is 50 characters
**Given**: Player is on the lobby page and opens the "Create Room" dialog
**When**: Player enters a room name longer than 50 characters
**Then**: The input is truncated to 50 characters at the server side, and an error is returned

### AC-ROOM-004: Player joins room via share link
**Given**: Player 1 created a room with code "ABC123"
**When**: Player 2 opens URL `/room/ABC123`
**Then**: Player 2 joins the room, and sees the room status (Waiting or Game in progress)

### AC-ROOM-005: Room shows correct player count
**Given**: A room has 1 player who is waiting
**When**: The room list refreshes
**Then**: The room card displays "1/2 người chơi"

### AC-ROOM-006: Room status updates to "full" when 2 players join
**Given**: A room with 1 slot occupied
**When**: The second player joins the room
**Then**: The room status changes to "full" or "playing", the game starts automatically

### AC-ROOM-007: Room code is exactly 6 alphanumeric characters
**Given**: Player creates a room
**When**: The room is created and the code is generated
**Then**: The room code is a 6-character uppercase alphanumeric string (A-Z, 0-9)

### AC-ROOM-008: Player can leave a room
**Given**: Player is in a room (waiting or playing)
**When**: Player clicks "Thoát" or leaves via browser back
**Then**: The player is removed from the room, and the room status updates for remaining players

### AC-ROOM-009: Room appears in public list for other players
**Given**: Player A creates a public room "Phòng Public"
**When**: Player B views the public room list
**Then**: "Phòng Public" appears in the list with status "Đang chờ"

### AC-ROOM-010: Private room is not visible in public list
**Given**: Player creates a new room with isPrivate=true
**When**: Other players view the public room list
**Then**: The private room is NOT visible in the list

### AC-ROOM-011: Joining room with full capacity is rejected
**Given**: A room already has 2 players
**When**: A third player attempts to join via link or code
**Then**: An error "Phòng đã đầy" (409 ROOM_FULL) is returned, and the player is not joined

---

## 3. Core Gameplay

### AC-GAME-001: Game starts automatically when 2 players have joined
**Given**: A room has exactly 2 players (room status was "waiting")
**When**: The second player joins
**Then**: A new game is created, board resets to 15x15 empty, black player (Player 1) goes first

### AC-GAME-002: Black player moves first
**Given**: A new game starts with 2 players
**When**: The game board is displayed
**Then**: currentTurn=1 (black), and it is the black player's turn

### AC-GAME-003: Valid move is placed and board updates
**Given**: It is Player 1's turn and the board cell at (7,7) is empty
**When**: Player 1 clicks cell (7,7)
**Then**: The board cell (7,7) shows a black stone, and currentTurn changes to 2

### AC-GAME-004: Turn alternates correctly
**Given**: Player 1 just moved (currentTurn was 1)
**When**: Player 1's move is processed
**Then**: currentTurn becomes 2, and it is now Player 2's turn

### AC-GAME-005: Move on occupied cell is rejected
**Given**: A game board has a stone at (7,7) belonging to Player 1
**When**: Player 2 attempts to place a stone at (7,7)
**Then**: The move is rejected with error "INVALID_MOVE", and the board state is unchanged

### AC-GAME-006: Occupied cell is rejected with error message
**Given**: A game board has a stone occupying a cell
**When**: Any player attempts to place a stone on that occupied cell
**Then**: The server returns error code "INVALID_MOVE" with message "Cell already occupied"

### AC-GAME-007: Move out of turn is rejected
**Given**: It is Player 2's turn (currentTurn=2)
**When**: Player 1 attempts to make a move
**Then**: The move is rejected with error "NOT_YOUR_TURN" and board unchanged

### AC-GAME-008: Win by 5-in-a-row horizontal is detected
**Given**: Black stone has 4 consecutive stones horizontally at row 7: cols 5,6,7,8
**When**: Black player places a stone at (7,9)
**Then**: Win condition is detected, game ends, winner=black, reason="five_in_row"

### AC-GAME-009: Win by 5-in-a-row vertical is detected
**Given**: White player has 4 consecutive stones vertically at col 7: rows 3,4,5,6
**When**: White player places a stone at (7,7)
**Then**: Win condition is detected, game ends, winner=white, reason="five_in_row"

### AC-GAME-010: Win by 5-in-a-row diagonal (top-left to bottom-right) is detected
**Given**: Black has 4 consecutive stones on diagonal at positions (1,1),(2,2),(3,3),(4,4)
**When**: Black player places a stone at (5,5)
**Then**: Win condition is detected, game ends, winner=black, reason="five_in_row"

### AC-GAME-011: Win by 5-in-a-row diagonal (top-right to bottom-left) is detected
**Given**: Black has 4 consecutive stones on anti-diagonal at positions (1,9),(2,8),(3,7),(4,6)
**When**: Black player places a stone at (5,5)
**Then**: Win condition is detected, game ends, winner=black, reason="five_in_row"

### AC-GAME-012: Draw when board is full with no winner is detected
**Given**: All 225 cells of the 15x15 board are occupied, and no player has 5-in-a-row
**When**: The last move is placed
**Then**: Game ends with result winner=null, reason="board_full", status="finished"

### AC-GAME-013: Winning cells are highlighted
**Given**: A player wins the game with a 5-in-a-row
**When**: The game result is displayed
**Then**: The 5 winning cells on the board are highlighted with a gold ring glow effect

### AC-GAME-014: Result modal shows after game ends
**Given**: A game is in "playing" state and a win or draw condition is detected
**When**: The game ends
**Then**: A result modal appears showing the outcome (Win/Lose/Draw) and action buttons

### AC-GAME-015: Rematch creates a new game in the same room
**Given**: Game 1 has just finished in a room with Players A and B
**When**: Either player clicks "Đấu lại" (Rematch)
**Then**: A new game is created with the same players, board resets, currentTurn=1 (black)

---

## 4. Real-time Updates

### AC-REALTIME-001: Opponent's move appears within 3 seconds
**Given**: Player 1 and Player 2 are in an active game (both connected)
**When**: Player 1 makes a move
**Then**: Player 2 sees the updated board with the new stone within 3 seconds via WebSocket

### AC-REALTIME-002: Socket.IO reconnects automatically on disconnect
**Given**: Player has an active WebSocket connection to the game room
**When**: The connection is interrupted (network glitch)
**Then**: Socket.IO automatically reconnects with exponential backoff, and the game state is re-synced

### AC-REALTIME-003: Game state is preserved when reconnecting
**Given**: A game is in progress with 3 moves made
**When**: Player refreshes the page and reconnects
**Then**: The current game state is fetched from MongoDB and displayed correctly

### AC-REALTIME-004: Joining late shows current board state
**Given**: A game is in progress with 10 moves already made
**When**: A player opens the room URL and joins the game
**Then**: The player sees the current board state with all previously placed stones

### AC-REALTIME-005: Player disconnect shows indicator to opponent
**Given**: Two players are in a game and Player 2's browser tab is closed
**When**: The disconnection is detected by the server (via Socket.IO heartbeat timeout)
**Then**: Player 1 sees an "offline" indicator next to Player 2's name in the player panel

### AC-REALTIME-006: Opponent joining triggers a notification
**Given**: Player 1 is in a waiting room
**When**: Player 2 joins the room
**Then**: Player 1 receives a WebSocket event and the Waiting Room updates to show Player 2 joined

---

## 5. Mobile Experience

### AC-MOBILE-001: Lobby is usable at 375px width without horizontal scroll
**Given**: Player opens the lobby on an iPhone SE (375px width)
**When**: Player views the lobby page
**Then**: No horizontal scrolling is required; all buttons, inputs, and lists are within the viewport

### AC-MOBILE-002: Game board fits at 375px width
**Given**: Player is on the game page on a mobile device at 375px width
**When**: The game board is displayed
**Then**: The 15x15 board fits within the viewport width, and no horizontal scroll is needed

### AC-MOBILE-003: All interactive elements meet 44px touch target minimum
**Given**: Player is on a mobile device
**When**: Player taps buttons, cells, or other interactive elements
**Then**: All tap targets are at least 44x44px in size

### AC-MOBILE-004: Responsive layout adjusts for mobile
**Given**: Player is on a mobile device at 375px width
**When**: Player loads the game page
**Then**: The layout changes to single-column (player panels above/below board instead of side-by-side)

### AC-MOBILE-005: Native share API works on mobile
**Given**: Player is in a waiting room or game room on a mobile device
**When**: Player taps "Chia sẻ" or the share button
**Then**: The native OS share sheet appears with the room link/copy options

---

## 6. Error Handling

### AC-ERROR-001: Network error shows user-friendly message
**Given**: Player is during gameplay and loses internet connection
**When**: An API call or WebSocket message fails due to network error
**Then**: A toast notification "Mất kết nối. Đang thử kết nối lại..." appears

### AC-ERROR-002: Invalid room code shows appropriate message
**Given**: Player opens URL `/room/NOTEXIST`
**When**: The system tries to find the room
**Then**: Message "Phòng không tồn tại" appears with a "Quay về trang chủ" button

### AC-ERROR-003: Server error shows generic message
**Given**: A form or API call results in a server error (status 500)
**When**: Player receives the error response
**Then**: A message "Đã xảy ra lỗi. Vui lòng thử lại sau." (Something went wrong. Please try again.) appears

### AC-ERROR-004: Loading state during room creation
**Given**: Player clicks "Tạo phòng" on the lobby
**When**: The room creation request is in flight
**Then**: The button shows a spinner or "Đang tạo..." text, and all inputs are disabled

### AC-ERROR-005: Empty public room list shows helpful message
**Given**: There are no public rooms available
**When**: Player views the lobby page public room list
**Then**: The text "Chưa có phòng công. Tạo phòng mới để bắt đầu!" is displayed

### AC-ERROR-006: Waiting room timeout returns to lobby
**Given**: Player is in a waiting room and the opponent never joins within 30 minutes
**When**: The 30-minute inactivity timeout is reached
**Then**: Player is returned to the lobby with a message "Phòng đã hết thời gian chờ"

---

## 7. Data Persistence

### AC-PERSIST-001: Game state survives page refresh
**Given**: A game is in progress with several moves made
**When**: Player refreshes the browser page (without clearing localStorage)
**Then**: The game state is restored from MongoDB with all moves and board state intact

### AC-PERSIST-002: Room data is stored in MongoDB
**Given**: Player creates a new room
**When**: The room is created
**Then**: The room document is stored in MongoDB with fields: code, name, isPrivate, currentPlayers, status, timestamps

### AC-PERSIST-003: Game data is stored in MongoDB
**Given**: A new game is created
**When**: The game is initialized
**Then**: The game document is stored in MongoDB with fields: roomId, players, board, currentTurn, moves, status, result, timestamps

### AC-PERSIST-004: Move history is recorded
**Given**: A player makes a move at row 7, col 7
**When**: The move is validated and accepted
**Then**: The move { playerId, row, col, timestamp } is appended to the moves array in MongoDB

### AC-PERSIST-005: Results are persisted for completed games
**Given**: A game ends with Player 1 as winner
**When**: The game ends
**Then**: The game document has status="finished", result={ winner: 1, reason: "five_in_row" }

---

## AC Summary

| AC ID | Feature | Priority | Tested |
|-------|---------|----------|--------|
| AC-ID-001 | Anonymous ID generation | Must Have | No |
| AC-ID-002 | Player ID persistence | Must Have | No |
| AC-ID-003 | Default name Anonymous | Must Have | No |
| AC-ID-004 | Player name localStorage | Should Have | No |
| AC-ROOM-001 | Create public room | Must Have | No |
| AC-ROOM-002 | Room name required | Must Have | No |
| AC-ROOM-003 | Room name max length | Must Have | No |
| AC-ROOM-004 | Join via share link | Must Have | No |
| AC-ROOM-005 | Room player count | Must Have | No |
| AC-ROOM-006 | Room full triggers game | Must Have | No |
| AC-ROOM-007 | Room code 6-char alphanumeric | Must Have | No |
| AC-ROOM-008 | Leave room | Must Have | No |
| AC-ROOM-009 | Public room listing | Must Have | No |
| AC-ROOM-010 | Private room hidden | Must Have | No |
| AC-ROOM-011 | Room full rejection | Must Have | No |
| AC-GAME-001 | Auto-start with 2 players | Must Have | No |
| AC-GAME-002 | Black moves first | Must Have | No |
| AC-GAME-003 | Valid move placed | Must Have | No |
| AC-GAME-004 | Turn alternation | Must Have | No |
| AC-GAME-005 | Occupied cell rejection | Must Have | No |
| AC-GAME-006 | INVALID_MOVE error msg | Must Have | No |
| AC-GAME-007 | Out-of-turn rejection | Must Have | No |
| AC-GAME-008 | Win horizontal | Must Have | No |
| AC-GAME-009 | Win vertical | Must Have | No |
| AC-GAME-010 | Win diagonal (TL-BR) | Must Have | No |
| AC-GAME-011 | Win diagonal (TR-BL) | Must Have | No |
| AC-GAME-012 | Draw detection | Must Have | No |
| AC-GAME-013 | Winning cells highlighted | Should Have | No |
| AC-GAME-014 | Result modal shown | Must Have | No |
| AC-GAME-015 | Rematch new game | Should Have | No |
| AC-REALTIME-001 | Opponent move < 3s | Must Have | No |
| AC-REALTIME-002 | Socket.IO auto-reconnect | Must Have | No |
| AC-REALTIME-003 | State preserved on reconnect | Must Have | No |
| AC-REALTIME-004 | Late join sees current board | Should Have | No |
| AC-REALTIME-005 | Disconnect indicator | Should Have | No |
| AC-REALTIME-006 | Opponent join notification | Must Have | No |
| AC-MOBILE-001 | Lobby no horizontal scroll | Must Have | No |
| AC-MOBILE-002 | Board fits 375px | Must Have | No |
| AC-MOBILE-003 | 44px touch targets | Must Have | No |
| AC-MOBILE-004 | Responsive mobile layout | Must Have | No |
| AC-MOBILE-005 | Native share on mobile | Nice to Have | No |
| AC-ERROR-001 | Network error toast | Must Have | No |
| AC-ERROR-002 | Invalid room msg | Must Have | No |
| AC-ERROR-003 | Server error generic msg | Must Have | No |
| AC-ERROR-004 | Loading state UI | Must Have | No |
| AC-ERROR-005 | Empty room list msg | Should Have | No |
| AC-ERROR-006 | Waiting room timeout | Nice to Have | No |
| AC-PERSIST-001 | Game survives refresh | Must Have | No |
| AC-PERSIST-002 | Room stored in MongoDB | Must Have | No |
| AC-PERSIST-003 | Game stored in MongoDB | Must Have | No |
| AC-PERSIST-004 | Move history recorded | Must Have | No |
| AC-PERSIST-005 | Results persisted | Must Have | No |

## Notes

- Win detection requires checking 4 directions from the last placed stone: horizontal, vertical, diagonal TL-BR, diagonal TR-BL. The first stone placed has no win check needed.
- WebSocket fallback: if Socket.IO fails to connect, the client falls back to HTTP polling every 3 seconds.
- MongoDB connection is to the externally hosted instance at 10.60.184.61:27017, not Atlas cloud — all data persistence uses this same connection.
- Room codes are generated server-side with sufficient entropy (6-char alphanumeric), no need for UUID in room codes.
- The 5 winning cells highlight uses a gold CSS ring animation — the win check identifies which row/col/diagonal positions were part of the winning 5.
