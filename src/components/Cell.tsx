'use client';

import type { CellValue } from '@/lib/game';
import styles from './Cell.module.scss';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
}

export function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  const interactive = !value && !disabled;

  const className = [
    styles.Cell,
    interactive ? styles.interactive : '',
    isWinning ? styles.winning : '',
    value === 'X' ? styles.x : '',
    value === 'O' ? styles.o : '',
  ].filter(Boolean).join(' ');

  return (
    <button onClick={onClick} disabled={!interactive} className={className}>
      {value && (
        <span className={isWinning ? styles.markPulse : styles.mark}>
          {value}
        </span>
      )}
    </button>
  );
}
