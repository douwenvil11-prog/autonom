import './globals.css';

export const metadata = {
  title: 'AUTONOM',
  description: 'SaaS de agentes de IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
