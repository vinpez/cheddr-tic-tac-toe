'use client';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: 'default' | 'large';
}

export function Button({ onClick, children, size = 'default' }: ButtonProps) {
  const sizeClasses =
    size === 'large'
      ? 'px-10 py-3.5 text-lg'
      : 'px-8 py-3 text-base';

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses}
        rounded-full font-bold uppercase tracking-wide
        transition-all duration-200 cursor-pointer
        bg-accent text-black hover:bg-accent-hover
      `}
    >
      {children}
    </button>
  );
}
