"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav';

/** Barra inferior para celular/tablet: lista só os módulos já disponíveis. */
export function MobileNav({ signOut }: { signOut: React.ReactNode }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.status === 'ready');

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-ink-700 bg-ink-900/95 px-2 pt-2 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] transition-colors ${
              active ? 'text-brand-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </Link>
        );
      })}
      <div className="px-3 py-1">{signOut}</div>
    </nav>
  );
}
