# caro-phonel — Component Specifications

> **C4 Level**: 3 — UI Component Specifications

## 1. UI Components Overview

### 1.1 Component Hierarchy
```
src/
├── components/
│   ├── ui/
│   │   ├── Button
│   │   ├── Card
│   │   ├── Modal
│   │   ├── Input
│   │   └── Badge
│   └── game/
│       ├── GameBoard
│       ├── Cell
│       ├── PlayerInfo
│       └── ResultModal
```

## 2. GameBoard Component

### 2.1 Purpose
Renders the 15x15 Gomoku board grid with clickable cells.

### 2.2 Props
```typescript
interface GameBoardProps {
  board: (number | null)[][];    // 15x15: null | 1 | 2
  currentTurn: number;           // 1 = black, 2 = white
  playerId: string;               // Current player's ID
  gameStatus: string;             // waiting | playing | finished
  onCellClick: (row: number, col: number) => void;
}
```

### 2.3 Visual Specification
- Grid: 15x15 HTML table or CSS grid
- Cell size: `min(calc((100vw - 48px) / 15), calc((100vh - 250px) / 15))` (responsive)
- Line color: `#333` (dark gray), 1px solid
- Cell background: `#f5e6c8` (caro paper tan)
- Hover state: cell lightens to `#edd9a3` with smooth 150ms transition
- Last move indicator: subtle dot/dot in center of cell

### 2.4 Stone Rendering
- Black stone (player 1): solid dark circle `#1a1a1a`
- White stone (player 2): solid light circle `#e8e8e8` with subtle border `#ccc`
- Stone size: 80% of cell size
- Stone has subtle box-shadow for depth effect

## 3. Cell Component

### 3.1 Purpose
Individual clickable cell within the board.

### 3.2 Props
```typescript
interface CellProps {
  value: number | null;      // null | 1 | 2
  row: number;
  col: number;
  isOccupied: boolean;
  isWinningCell: boolean;    // For win animation highlight
  onClick: () => void;
}
```

### 3.3 Visual States
- Empty: transparent background, cursor pointer on hover
- Black stone: filled circle with depth shadow
- White stone: filled circle with border
- Winning cell: gold/yellow highlight ring animation
- Disabled (not your turn): cursor not-allowed, no hover effect

## 4. PlayerInfo Component

### 4.1 Purpose
Displays player name, which stone they play, and turn indicator.

### 4.2 Props
```typescript
interface PlayerInfoProps {
  player: {
    id: string;
    name: string;
    stone: 1 | 2;           // Which stone they play
  };
  isCurrentTurn: boolean;
  isConnected: boolean;
  score?: number;           // Future: running score
}
```

### 4.3 Visual
- Player name (truncate at 15 chars)
- Stone icon next to name (small circle)
- Turn indicator: glowing border, "Your turn" badge
- Disconnected state: grayed out + "Disconnected" badge

## 5. ResultModal Component

### 5.1 Purpose
Overlay shown when game ends (win/draw/abandon).

### 5.2 Props
```typescript
interface ResultModalProps {
  isOpen: boolean;
  result: {
    winner: 1 | 2 | null;   // null = draw
    reason: string;          // 'five_in_row' | 'board_full'
  } | null;
  playerId: string;
  players: Array<{ id: string; name: string; index: 0 | 1 }>;
  onRematch: () => void;
  onClose: () => void;
}
```

### 5.3 Variations
- **Win**: "You Win!" (green) or "You Lose!" (red)
- **Draw**: "Draw!" (yellow/amber)
- **Opponent left**: "Opponent Left — You Win!" (info blue)
- Buttons: "Rematch" (primary), "New Game" (secondary), "Close" (ghost)

## 6. Button Component (ui/)

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

- Primary: solid dark background (#1a1a1a), white text
- Secondary: outlined, dark border
- Ghost: transparent, text only
- Danger: red background for destructive actions
- Touch target: minimum 44px height

## 7. Card Component (ui/)

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}
```

- Border: 1px solid `#e5e5e5`
- Border-radius: 8px
- Padding: 16px
- Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover (if hoverable): shadow increases, slight translateY(-2px)

## 8. Input Component (ui/)

```typescript
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxLength?: number;
}
```

- Border: 1px solid `#d4d4d4`
- Focus: dark border + shadow ring
- Error: red border + error message below
- Padding: 12px
- Border-radius: 6px
