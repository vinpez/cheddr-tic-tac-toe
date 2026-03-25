'use client';

import { getDifficultyLabel } from '@/lib/game';
import styles from './LevelBar.module.scss';

interface LevelBarProps {
  difficulty: number;
}

export function LevelBar({ difficulty }: LevelBarProps) {
  return (
    <div className={styles.LevelBar}>
      <span className={styles.label}>{getDifficultyLabel(difficulty)}</span>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.round(difficulty)}%` }}
        />
      </div>
    </div>
  );
}
