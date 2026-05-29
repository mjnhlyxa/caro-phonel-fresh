'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closable?: boolean;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  closable = true,
  maxWidth = '400px',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={closable ? onClose : undefined}
    >
      <div
        className="relative bg-bg-surface border border-border-default rounded-xl p-6 shadow-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {closable && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        )}
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
