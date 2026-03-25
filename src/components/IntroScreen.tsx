'use client';

import { GAMES_PER_SESSION, getDifficultyLabel } from '@/lib/game';
import { Button } from './Button';
import styles from './IntroScreen.module.scss';

interface IntroScreenProps {
  bestDifficulty: number;
  onStart: () => void;
}

export function IntroScreen({ bestDifficulty, onStart }: IntroScreenProps) {
  return (
    <div className={styles.IntroScreen}>
      <h1 className={styles.title}>Tic Tac Toe</h1>

      <div className={styles.description}>
        <p>Play {GAMES_PER_SESSION} games against the CPU.</p>
        <p>
          Win to <span className={styles.accentText}>increase</span> the
          difficulty. Lose to{' '}
          <span className={styles.lossText}>decrease</span> it.
        </p>
        <p className={styles.highlight}>How high can you climb?</p>
      </div>

      {bestDifficulty > 0 && (
        <p className={styles.bestScore}>
          Personal best:{' '}
          <span className={styles.bestValue}>
            {getDifficultyLabel(bestDifficulty)}
          </span>
        </p>
      )}

      <Button onClick={onStart} size="large">
        Start
      </Button>
    </div>
  );
}
