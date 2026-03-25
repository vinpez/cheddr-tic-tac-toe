'use client';

import { getDifficultyLabel } from '@/lib/game';

interface LevelBarProps {
  difficulty: number;
}

export function LevelBar({ difficulty }: LevelBarProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">
        {getDifficultyLabel(difficulty)}
      </span>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 shadow-[0_0_10px_rgba(255,225,53,0.4)]"
          style={{ width: `${Math.round(difficulty)}%` }}
        />
      </div>
    </div>
  );
}
