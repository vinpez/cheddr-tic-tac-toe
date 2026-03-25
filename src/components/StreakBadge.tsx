'use client';

interface StreakBadgeProps {
  streak: number;
}

const MILESTONES = new Set([3, 5, 10]);

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  const isMilestone = MILESTONES.has(streak);

  return (
    <div
      className={`
        flex items-center gap-1.5 px-3 py-1 rounded-full
        bg-accent/10 border border-accent/20
        text-sm font-bold text-accent
        ${isMilestone ? 'animate-pulse' : ''}
      `}
    >
      <span className="text-base">&#x26A1;</span>
      <span>{streak}</span>
    </div>
  );
}
