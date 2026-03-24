'use client';

import { MAX_LEVEL } from '@/lib/game';

interface LevelBarProps {
  level: number;
  delta: number;
}

export function LevelBar({ level, delta }: LevelBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-secondary whitespace-nowrap">
        Lvl {level}
        {delta !== 0 && (
          <span className={`ml-1 ${delta > 0 ? 'text-accent' : 'text-rose-400'}`}>
            {delta > 0 ? '+1' : '-1'}
          </span>
        )}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: MAX_LEVEL }, (_, i) => (
          <div
            key={i}
            className={`
              h-2.5 w-4 rounded-sm transition-all duration-500
              ${i < level ? 'bg-accent shadow-[0_0_6px_rgba(205,255,100,0.3)]' : 'bg-border'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
