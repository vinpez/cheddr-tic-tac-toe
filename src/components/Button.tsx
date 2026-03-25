'use client';

import styles from './Button.module.scss';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: 'default' | 'large';
}

export function Button({ onClick, children, size = 'default' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.Button} ${size === 'large' ? styles.large : ''}`}
    >
      {children}
    </button>
  );
}
