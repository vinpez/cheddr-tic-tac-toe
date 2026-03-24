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
        flex items-center gap-1 text-sm font-semibold text-accent
        ${isMilestone ? 'animate-pulse' : ''}
      `}
    >
      <span className="text-base">&#x26A1;</span>
      <span>{streak}</span>
    </div>
  );
}
