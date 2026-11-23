import { LogOut } from 'lucide-react';

/** Logout via POST (rota /auth/signout): funciona sem JavaScript no cliente. */
export function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={
          compact
            ? 'flex flex-col items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-white'
            : 'btn-ghost w-full'
        }
        aria-label="Sair da conta"
      >
        <LogOut className={compact ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden />
        Sair
      </button>
    </form>
  );
}
