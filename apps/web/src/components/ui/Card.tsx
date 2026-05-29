import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  const hoverStyles = hoverable
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150'
    : '';

  return (
    <div
      className={`bg-bg-surface border border-border-default rounded-lg p-4 shadow-sm ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
