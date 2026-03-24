'use client';

import type { CellValue } from '@/lib/game';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
}

export function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  const interactive = !value && !disabled;

  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      className={`
        aspect-square flex items-center justify-center
        rounded-xl text-5xl font-black select-none
        transition-all duration-200 border
        ${interactive
          ? 'bg-surface border-border hover:border-accent/40 hover:bg-white/[0.03] cursor-pointer'
          : 'bg-surface border-border cursor-default'
        }
        ${isWinning ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(205,255,100,0.15)]' : ''}
        ${value === 'X' ? 'text-accent' : ''}
        ${value === 'O' ? 'text-rose-400' : ''}
      `}
    >
      {value && (
        <span className={`animate-pop ${isWinning ? 'animate-pulse' : ''}`}>
          {value}
        </span>
      )}
    </button>
  );
}
