# caro-phonel — Implementation Milestones

## Phase 1: Project Setup (Day 1)
**Goal**: Bun monorepo scaffolded, both apps runnable locally

- [ ] Initialize Bun monorepo with workspace config
- [ ] Create apps/web with Next.js 15 + TypeScript
- [ ] Create apps/api with FastAPI + PyMongo
- [ ] Configure MongoDB connection from apps/api
- [ ] Verify both apps start (web: :3000, api: :3001)
- [ ] Push initial commit to GitHub `mjnhlyxa/caro-phonel`

## Phase 2: Room System (Day 2)
**Goal**: Players can create and join rooms

- [ ] Room model + MongoDB collection
- [ ] POST /api/rooms — create room with 6-char code
- [ ] GET /api/rooms — list public rooms
- [ ] GET /api/rooms/{code} — get room by code
- [ ] POST /api/rooms/{code}/join — join room (limit 2)
- [ ] DELETE /api/rooms/{code}/leave — leave room
- [ ] Lobby page: create room button, join form, room list
- [ ] Share room code display

## Phase 3: Game Logic (Day 3)
**Goal**: Core Gomoku mechanics working

- [ ] Game model + MongoDB collection
- [ ] POST /api/games — create game in room
- [ ] 15x15 board state in MongoDB
- [ ] isValidMove(board, row, col, player) — pure function
- [ ] checkWin(board, row, col) — detect 5-in-a-row
- [ ] checkDraw(board) — board full, no winner
- [ ] POST /api/games/{id}/move — validate + apply move
- [ ] Win/draw detection on every move

## Phase 4: Real-time Sync (Day 4)
**Goal**: Moves appear instantly for opponent

- [ ] FastAPI + Socket.IO integration
- [ ] join_room event (player joins socket room)
- [ ] make_move → game_update broadcast
- [ ] game_start event when 2 players present
- [ ] game_over event with result
- [ ] opponent_joined / opponent_left events
- [ ] Client socket connection in Next.js
- [ ] Auto-reconnect on disconnect

## Phase 5: Game UI (Day 5)
**Goal**: Fully playable board with proper styling

- [ ] GameBoard component (15x15 grid)
- [ ] Cell component with stone rendering
- [ ] PlayerInfo panel (name + turn indicator)
- [ ] ResultModal (win/draw overlay)
- [ ] Lobby → Room → Game flow
- [ ] Mobile-responsive board (min 44px cells)
- [ ] Last move indicator (center dot)

## Phase 6: Polish & Sharing (Day 6)
**Goal**: Shareable links, good UX

- [ ] Share "Copy Link" button
- [ ] Room code display + "Copy Code"
- [ ] Rematch button in result modal
- [ ] New Game flow (return to lobby)
- [ ] Loading states during API calls
- [ ] Error toasts for API failures
- [ ] Disconnection indicator

## Phase 7: Deploy to Vercel (Day 7)
**Goal**: Live at caro-phonel.vercel.app

- [ ] Configure apps/web with vercel.json
- [ ] Configure apps/api with vercel.json
- [ ] Set environment variables in Vercel dashboard
- [ ] Connect GitHub repo for auto-deploy
- [ ] Test end-to-end on production URL
- [ ] Verify WebSocket works on Vercel

## Phase 8: Testing (Day 8)
**Goal**: 2+ hours Playwright testing

- [ ] Frontend component tests
- [ ] Win detection test cases
- [ ] Room create/join flow tests
- [ ] Real-time sync tests
- [ ] Invalid move rejection tests
- [ ] Edge cases (disconnect, reconnect)
- [ ] Mobile viewport tests

## Phase 9: GitHub Push (Day 9)
**Goal**: Code committed, repo in good state

- [ ] All code committed to `mjnhlyxa/caro-phonel`
- [ ] README with game instructions
- [ ] Cleanup of debug/console.log
- [ ] Final review of file structure
- [ ] PR or direct push to main
