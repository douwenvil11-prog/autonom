import { getSessionContext } from '@/lib/session';
import { INTERNAL_ROLES } from '@/types/database';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { SignOutButton } from '@/components/SignOutButton';
import { Logo } from '@/components/Logo';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();

  // Clientes finais usam o Client Portal (ainda não implementado): não entram na área interna.
  if (session.role && !INTERNAL_ROLES.includes(session.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
        <Logo size="lg" />
        <p className="max-w-sm text-sm text-slate-400">
          A área do cliente ainda está em desenvolvimento. Entre em contato com
          a empresa que atende você.
        </p>
        <div className="w-40">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        orgName={session.orgName}
        email={session.email}
        signOut={<SignOutButton />}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-700 bg-ink-950/80 px-4 py-3 backdrop-blur md:hidden">
          <Logo />
        </header>

        <main className="flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-8">
          {session.dbError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300"
            >
              Não foi possível ler os dados da sua conta. Verifique se a migração
              do banco (supabase/migrations/0001_fundacao.sql) foi aplicada.
            </div>
          )}
          {children}
        </main>
      </div>

      <MobileNav signOut={<SignOutButton compact />} />
    </div>
  );
}
