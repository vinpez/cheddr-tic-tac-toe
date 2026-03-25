'use client';

import type { GameResult } from '@/lib/game';
import { getDifficultyLabel } from '@/lib/game';
import styles from './GameStatus.module.scss';

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
  let variant: string;

  if (isSessionEnd) {
    message = `You reached ${getDifficultyLabel(difficulty)}!`;
    variant = styles.win;
  } else if (result === 'win') {
    message = 'You win!';
    variant = styles.win;
  } else if (result === 'loss') {
    message = 'CPU wins!';
    variant = styles.loss;
  } else if (result === 'draw') {
    message = "It's a draw!";
    variant = styles.draw;
  } else if (cpuThinking) {
    message = 'CPU thinking\u2026';
    variant = styles.thinking;
  } else if (isPlayerTurn) {
    message = 'Your turn';
    variant = styles.turn;
  } else {
    message = '';
    variant = styles.idle;
  }

  return (
    <div className={`${styles.GameStatus} ${variant}`}>
      {message}
    </div>
  );
}
