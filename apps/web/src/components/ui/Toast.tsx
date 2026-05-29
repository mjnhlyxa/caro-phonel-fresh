'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variantStyles = {
    info: 'bg-bg-elevated border border-border-default',
    success: 'bg-green-900/30 border border-accent-success text-accent-success',
    error: 'bg-red-900/30 border border-accent-error text-accent-error',
    warning: 'bg-yellow-900/30 border border-accent-warning text-accent-warning',
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]
        px-4 py-3 rounded-lg shadow-lg
        text-sm font-medium toast-enter
        ${variantStyles[variant]}
      `}
    >
      {message}
    </div>
  );
}

interface ToastMessage {
  id: string;
  message: string;
  variant?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, variant: ToastMessage['variant'] = 'info', duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toastElement = toasts.map(t => (
    <Toast
      key={t.id}
      message={t.message}
      variant={t.variant}
      duration={t.duration}
      onClose={() => removeToast(t.id)}
    />
  ));

  return { addToast, toastElement };
}
