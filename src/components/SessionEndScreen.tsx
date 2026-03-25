'use client';

import { getDifficultyLabel } from '@/lib/game';
import { Button } from './Button';
import { LevelBar } from './LevelBar';
import styles from './SessionEndScreen.module.scss';

interface SessionEndScreenProps {
  difficulty: number;
  bestDifficulty: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function SessionEndScreen({
  difficulty,
  bestDifficulty,
  isNewBest,
  onPlayAgain,
}: SessionEndScreenProps) {
  return (
    <div className={styles.SessionEndScreen}>
      <h1 className={styles.title}>Tic Tac Toe</h1>

      <div className={styles.result}>
        <p className={styles.reachedLabel}>You reached</p>
        <p className={styles.levelLabel}>{getDifficultyLabel(difficulty)}</p>
        <div className={styles.levelBarWrapper}>
          <LevelBar difficulty={difficulty} />
        </div>
        {isNewBest ? (
          <p className={styles.newBest}>New personal best!</p>
        ) : (
          <p className={styles.bestScore}>
            Personal best:{' '}
            <span className={styles.bestValue}>
              {getDifficultyLabel(bestDifficulty)}
            </span>
          </p>
        )}
      </div>

      <Button onClick={onPlayAgain} size="large">
        Play Again
      </Button>
    </div>
  );
}
