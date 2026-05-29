# caro-phonel — Design System

## Colors

```css
/* Background */
--bg-page: #0d1117;           /* Deep dark — main page background */
--bg-surface: #161b22;         /* Card/panel surfaces */
--bg-elevated: #21262d;        /* Modals, elevated elements */

/* Game Board */
--board-bg: #2d1f0f;           /* Dark caro paper — aged paper look */
--board-line: #4a3728;         /* Grid lines */
--board-hover: #3d2a16;        /* Cell hover state */

/* Stones */
--stone-black: #1a1a1a;       /* Black stone */
--stone-black-accent: #333333; /* Black stone highlight */
--stone-white: #e8e8e8;       /* White stone */
--stone-white-border: #888888;  /* White stone border */
--stone-win: #ffd700;          /* Win indicator — gold */

/* Accents */
--accent-primary: #c9a227;    /* Gold/amber — Vietnamese-inspired */
--accent-secondary: #8b6914;  /* Darker gold for pressed */
--accent-success: #238636;    /* Win / success */
--accent-error: #da3633;      /* Lose / error */
--accent-warning: #d29922;     /* Draw / warning */

/* Text */
--text-primary: #f0f6fc;      /* Primary text */
--text-secondary: #8b949e;    /* Secondary/muted */
--text-on-accent: #0d1117;   /* Text on gold accent */

/* Borders & Shadows */
--border-default: #30363d;
--border-active: #c9a227;
--shadow-card: 0 2px 8px rgba(0,0,0,0.4);
--shadow-modal: 0 8px 40px rgba(0,0,0,0.6);
```

## Typography

**Heading font**: Inter (clean sans-serif)
**Body font**: Inter
**Monospace**: JetBrains Mono (for move notation, room codes)

| Style | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| H1 (Game title) | Inter | 32px | 700 | 1.2 |
| H2 (Section) | Inter | 24px | 600 | 1.3 |
| H3 (Panel title) | Inter | 18px | 600 | 1.3 |
| Body | Inter | 16px | 400 | 1.5 |
| Small | Inter | 14px | 400 | 1.4 |
| Caption | Inter | 12px | 400 | 1.4 |
| Code/Key | JetBrains Mono | 16px | 500 | 1.4 |

## Spacing

Base unit: 4px

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |
| 4xl | 64px |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Badges, chips |
| md | 8px | Cards, inputs, buttons |
| lg | 12px | Modal, large card |
| full | 9999px | Avatar, circle |

## Shadows

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
--shadow-md: 0 2px 8px rgba(0,0,0,0.4);
--shadow-lg: 0 4px 16px rgba(0,0,0,0.5);
--shadow-modal: 0 8px 40px rgba(0,0,0,0.6);
```

## Breakpoints

| Name | Min Width | Usage |
|------|----------|-------|
| mobile | < 640px | Phone layout (primary) |
| tablet | 640–1024px | Tablet |
| desktop | > 1024px | Desktop with side panels |

## Game Board Cell

- Size on desktop: `min(calc((100vw - 300px) / 15), calc((100vh - 220px) / 15))`
- Size on mobile: `min(calc((100vw - 32px) / 15), calc((100vh - 200px) / 15))`
- Stone size: 80% of cell size
- Stone shows character: 黑 (black) / 白 (white) - optional but authentic

## Button Variants

### Primary
Button background: `--accent-primary` (#c9a227), text: `--text-on-accent`, border-radius: md

### Secondary
Button background: transparent, border: 1px `--border-default`, text: `--text-primary`

### Ghost
Button background: transparent, text: `--text-secondary`, no border

### Danger
Button background: `--accent-error`, text: white
