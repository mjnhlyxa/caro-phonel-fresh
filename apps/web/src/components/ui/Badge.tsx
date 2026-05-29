import React from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    info: 'bg-blue-900/30 text-blue-400',
    success: 'bg-green-900/30 text-green-400',
    warning: 'bg-yellow-900/30 text-yellow-400',
    error: 'bg-red-900/30 text-red-400',
    neutral: 'bg-bg-elevated text-text-secondary',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded text-xs font-medium
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}
