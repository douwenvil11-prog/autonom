import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnv } from './env';

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 * Usa a sessão do usuário (cookies), portanto as regras RLS do banco valem.
 */
export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado a partir de um Server Component (somente leitura).
          // É seguro ignorar: o middleware renova a sessão.
        }
      },
    },
  });
}
