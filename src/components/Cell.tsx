'use client';

import type { CellValue } from '@/lib/game';
import styles from './Cell.module.scss';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
  position: number;
}

const POSITION_LABELS = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export function Cell({ value, onClick, disabled, isWinning, position }: CellProps) {
  const interactive = !value && !disabled;

  const className = [
    styles.Cell,
    interactive ? styles.interactive : '',
    isWinning ? styles.winning : '',
    value === 'X' ? styles.x : '',
    value === 'O' ? styles.o : '',
  ].filter(Boolean).join(' ');

  const label = value
    ? `${POSITION_LABELS[position]}, ${value}`
    : `${POSITION_LABELS[position]}, empty`;

  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      className={className}
      aria-label={label}
    >
      {value && (
        <span className={isWinning ? styles.markPulse : styles.mark}>
          {value}
        </span>
      )}
    </button>
  );
}
