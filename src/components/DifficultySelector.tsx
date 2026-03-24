'use client';

import type { Difficulty } from '@/lib/game';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${difficulty === value
              ? 'bg-accent text-black'
              : 'bg-surface text-secondary hover:text-foreground border border-border'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
