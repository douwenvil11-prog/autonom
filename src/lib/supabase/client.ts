import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

/** Cliente Supabase para componentes do navegador ("use client"). */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
