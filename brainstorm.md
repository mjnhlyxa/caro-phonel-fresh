# caro-phonel — Brainstorm

> Status: Draft | Created: 2026-05-29

## Overview
Caro-phonel is a Vietnamese name for Gomoku (Five-in-a-row), a classic strategy board game where two players take turns placing stones on a 15x15 grid, each trying to connect five of their stones in a row horizontally, vertically, or diagonally. The game is played online with a friend in real-time, featuring a clean Vietnamese-themed design that evokes the nostalgia of playing caro on paper.

## Game Concept
- **Genre**: Strategy / Board game
- **Platform**: Web browser — desktop primary, mobile responsive
- **Session length**: Quick 5–15 minute games
- **Multiplayer**: Real-time 1v1 via room codes
- **Account required**: No — anonymous play by default, room-code based

## Target Audience
- Casual players who enjoy classic strategy games
- Vietnamese diaspora wanting to play caro online with friends and family
- Players who want quick, no-signup gameplay with a shared link

## Core Gameplay Loop
1. Player creates a room → receives a unique room code
2. Player shares link/code with a friend
3. Friend joins using the room code
4. Players take turns placing stones on a 15x15 grid
5. First player to connect 5 stones in a row wins
6. Option to play again or share new room

## Features

### Must-Have (MVP — launch with these)
- 15x15 game board with clickable grid cells
- Black and white stone placement
- Turn-based gameplay (Black moves first)
- Win detection: 5-in-a-row horizontal, vertical, diagonal
- Draw detection: board full with no winner
- Room system: create room, join via code
- Real-time sync via WebSocket using Socket.IO
- Game state persistence (resume disconnected games)
- WIN/DRAW overlay with replay option

### Nice-to-Have (Post-MVP)
- Spectator mode for watching ongoing games
- Match history (games played)
- Sound effects for stone placement
- Undo-last-move (mutual agreement)
- Timer-based moves (optional speed cap)

### Out of Scope (explicitly excluded)
- AI opponent — real-time multiplayer only
- User accounts / authentication — anonymous by design
- Leaderboards — out of scope for MVP
- Chat in-game — doesn't fit MVP scope

## User Experience Goals
- **Time to first game**: Target < 20 seconds from landing to playing. No signup, no tutorial required.
- **Onboarding**: Simple rules tooltip on first visit, board is self-explanatory.
- **Mobile**: Touch-friendly 44px minimum tap targets, board scales to fit screen.
- **Accessibility**: Keyboard navigation for board, sufficient contrast for stones.

## Social & Virality Features
- Share link: `caro-phonel.vercel.app/room/[code]` — open directly in browser
- Room code display for manual entry
- "Copy link" and "Copy code" buttons

## Data to Persist
- **Room state**: players, current turn, board state, game status (waiting/playing/finished)
- **Move history**: sequence of moves for validation and replay
- **Game record**: past completed games for both players

## Technical Feasibility Assessment

### Straightforward
- Board rendering: simple CSS grid or canvas
- Win detection: check last placed stone's row/col/diagonal chains
- Turn logic: alternating between players
- Room management: create/join/leave rooms

### Complex or Risky
- WebSocket real-time sync: need to handle reconnection, missed messages
- Race conditions: simultaneous move attempts
- MongoDB persistence for room state

### Open Questions
- Should rooms expire after inactivity? (e.g., 30 min timeout)
- How to handle player disconnect mid-game? (forfeit or wait for reconnect)
- Max concurrent rooms supported?

## Competitive Landscape
- Similar online Gomoku games exist: BoardGameArena, DotA Gamer
- This project differentiates with: instant play (no account), Vietnamese caro branding, clean mobile-first UI, shared-link multiplayer
