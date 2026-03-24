# Tic Tac Toe

A single-player Tic Tac Toe web app with multiple AI difficulty levels.

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
│   ├── game.ts          # Pure game logic — no React, no side effects
│   └── cpu.ts           # CPU AI strategies (random, smart, minimax)
├── hooks/
│   └── useGame.ts       # Game state management via custom hook
├── components/
│   ├── Board.tsx         # 3×3 grid layout
│   ├── Cell.tsx          # Individual cell (presentational)
│   ├── GameStatus.tsx    # Turn / result display
│   ├── DifficultySelector.tsx
│   └── ScoreBoard.tsx    # Win / draw / loss counter
└── app/
    ├── layout.tsx
    ├── page.tsx          # Main game page (client component)
    └── globals.css       # Tailwind theme + animations
```

**Separation of concerns** — game logic (`lib/`) is pure TypeScript with no framework dependencies. React components are presentational. All state lives in a single `useGame` hook.

## AI Approach

| Difficulty | Strategy |
|------------|----------|
| **Easy** | Random moves — picks any open cell |
| **Medium** | Checks for winning/blocking moves first, then 40% random + 60% minimax |
| **Hard** | Minimax with depth-based scoring — unbeatable, prefers faster wins and delays losses |

The minimax algorithm evaluates every possible game state to find the optimal move. Depth is factored into scoring so the CPU wins as quickly as possible (or loses as slowly as possible). Lower difficulties introduce randomness to make the game fun and winnable.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** for styling
- Deployed on **Vercel**

## Features

- Human (X) vs CPU (O)
- Three difficulty levels
- Win/draw/loss score tracking (persisted in localStorage)
- Winning line highlight
- CPU thinking delay (300–600ms) with interaction prevention
- Clean, dark UI inspired by [cheddr.xyz](https://www.cheddr.xyz/)
