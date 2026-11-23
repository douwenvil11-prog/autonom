import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'AUTONOM', template: '%s · AUTONOM' },
  description: 'AI Sales Operating System: prospecção, CRM, sites e atendimento com agentes de IA.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07060d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-ink-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
