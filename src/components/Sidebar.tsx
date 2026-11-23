"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav';
import { Logo } from './Logo';

export function Sidebar({
  orgName,
  email,
  signOut,
}: {
  orgName: string | null;
  email: string;
  signOut: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-900 md:flex">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ label, href, icon: Icon, status }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          if (status === 'soon') {
            return (
              <div
                key={href}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="flex-1">{label}</span>
                <span className="rounded-full bg-ink-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Em breve
                </span>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600/15 text-brand-300 ring-1 ring-brand-500/30'
                  : 'text-slate-400 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-ink-700 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{orgName ?? 'Sem organização'}</p>
          <p className="truncate text-xs text-slate-500">{email}</p>
        </div>
        {signOut}
      </div>
    </aside>
  );
}
