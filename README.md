# Tic Tac Toe

A single-player Tic Tac Toe web app with adaptive AI difficulty and session-based progression.

**[Play it live](https://tic-tac-fw2sq4k2w-vincents-projects-a4847269.vercel.app/)**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Architecture

```
src/
├── lib/
│   ├── game.ts              # Pure game logic, types, difficulty labels
│   └── cpu.ts               # CPU AI (minimax with difficulty scaling)
├── hooks/
│   └── useGame.ts           # Game state management via custom hook
├── components/
│   ├── Board.tsx             # 3x3 grid layout
│   ├── Cell.tsx              # Individual cell with win/state styling
│   ├── Button.tsx            # Reusable pill button (default + large)
│   ├── GameStatus.tsx        # Turn / result status display
│   ├── LevelBar.tsx          # Difficulty progress bar with label
│   ├── IntroScreen.tsx       # Welcome screen with rules + personal best
│   └── SessionEndScreen.tsx  # End-of-session result screen
└── app/
    ├── layout.tsx            # Root layout (Geist + Archivo Black fonts)
    ├── page.tsx              # Main game page (client component)
    └── globals.scss          # CSS variables, reset, keyframe animations
```

**Separation of concerns** — game logic (`lib/`) is pure TypeScript with no framework dependencies. React components are presentational. All state lives in a single `useGame` hook.

## AI Approach

The CPU uses minimax with depth-based scoring to evaluate every possible game state. Difficulty scales continuously from 0% to 100% using a `mistakeRate` parameter:

- At **difficulty >= 35%**, the CPU always takes an immediate win or blocks an immediate opponent win.
- Below the threshold, the CPU flips a coin weighted by `mistakeRate` (inverse of difficulty) to choose between a random move and the optimal minimax move.
- Minimax prefers faster wins and delays losses via depth scoring. When multiple moves share the optimal score, one is chosen at random to avoid predictable play.

## Progression System

- **Sessions**: Play 5 games per session. The goal is to reach the highest difficulty level.
- **Adaptive difficulty**: Difficulty is a continuous 0–100% scale. A win moves you halfway toward 100%. A loss moves you halfway toward 0%. Draws leave difficulty unchanged. Changes are capped at 25 percentage points per game.
- **Difficulty labels**: Beginner, Novice, Intermediate, Advanced, Expert, Master.
- **Starting difficulty**: Each session begins at 15%.
- **Personal best**: Your highest difficulty reached across all sessions is persisted in localStorage and displayed on the intro and result screens.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **SCSS Modules** for component-scoped styling, with CSS variables for design tokens
- **Archivo Black** for titles, **Geist** for body text
- Deployed on **Vercel**
