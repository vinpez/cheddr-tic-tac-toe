'use client';

import type { GameResult } from '@/lib/game';

interface GameStatusProps {
  result: GameResult;
  isPlayerTurn: boolean;
  cpuThinking: boolean;
  levelDelta: number;
}

export function GameStatus({ result, isPlayerTurn, cpuThinking, levelDelta }: GameStatusProps) {
  let message: string;
  let colorClass: string;

  if (result === 'win') {
    message = levelDelta > 0 ? 'You win — level up!' : 'You win!';
    colorClass = 'text-accent';
  } else if (result === 'loss') {
    message = levelDelta < 0 ? 'CPU wins — level down.' : 'CPU wins!';
    colorClass = 'text-rose-400';
  } else if (result === 'draw') {
    message = "It's a draw!";
    colorClass = 'text-amber-400';
  } else if (cpuThinking) {
    message = 'CPU thinking\u2026';
    colorClass = 'text-secondary animate-pulse';
  } else if (isPlayerTurn) {
    message = 'Your turn';
    colorClass = 'text-foreground';
  } else {
    message = '';
    colorClass = 'text-secondary';
  }

  return (
    <div className={`text-center text-lg font-semibold h-7 ${colorClass}`}>
      {message}
    </div>
  );
}
