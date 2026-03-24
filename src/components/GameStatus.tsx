'use client';

import type { GameResult } from '@/lib/game';
import { getDifficultyLabel } from '@/lib/game';

interface GameStatusProps {
  result: GameResult;
  isPlayerTurn: boolean;
  cpuThinking: boolean;
  isSessionEnd: boolean;
  difficulty: number;
}

export function GameStatus({
  result,
  isPlayerTurn,
  cpuThinking,
  isSessionEnd,
  difficulty,
}: GameStatusProps) {
  let message: string;
  let colorClass: string;

  if (isSessionEnd) {
    message = `You reached ${getDifficultyLabel(difficulty)}!`;
    colorClass = 'text-accent';
  } else if (result === 'win') {
    message = 'You win!';
    colorClass = 'text-accent';
  } else if (result === 'loss') {
    message = 'CPU wins!';
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
