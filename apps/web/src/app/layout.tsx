import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'caro-phonel — Gomoku / Five-in-a-row',
  description: 'Play Caro online with friends. No account needed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-bg-page text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
