'use client';

import type { Scores } from '@/lib/game';

interface ScoreBoardProps {
  scores: Scores;
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <div className="flex gap-8 text-sm font-medium">
      <div className="text-center">
        <div className="text-accent text-2xl font-bold tabular-nums">{scores.wins}</div>
        <div className="text-secondary text-xs uppercase tracking-wider">Wins</div>
      </div>
      <div className="text-center">
        <div className="text-amber-400 text-2xl font-bold tabular-nums">{scores.draws}</div>
        <div className="text-secondary text-xs uppercase tracking-wider">Draws</div>
      </div>
      <div className="text-center">
        <div className="text-rose-400 text-2xl font-bold tabular-nums">{scores.losses}</div>
        <div className="text-secondary text-xs uppercase tracking-wider">Losses</div>
      </div>
    </div>
  );
}
