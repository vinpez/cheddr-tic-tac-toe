'use client';

import { getDifficultyLabel } from '@/lib/game';

interface LevelBarProps {
  difficulty: number;
}

export function LevelBar({ difficulty }: LevelBarProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <span className="text-sm font-semibold text-secondary">
        {getDifficultyLabel(difficulty)}
      </span>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 shadow-[0_0_8px_rgba(205,255,100,0.3)]"
          style={{ width: `${Math.round(difficulty)}%` }}
        />
      </div>
    </div>
  );
}
