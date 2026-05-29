import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  error,
  maxLength,
  autoFocus,
  className = '',
  onKeyDown,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className={`
          w-full px-3 py-3 text-base
          bg-bg-page border rounded-md
          text-text-primary placeholder-text-secondary
          transition-all duration-150
          focus:outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(201,162,39,0.2)]
          ${error ? 'border-accent-error' : 'border-border-default'}
        `}
      />
      {error && (
        <span className="text-xs text-accent-error">{error}</span>
      )}
    </div>
  );
}
