import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import type { Role } from '@/types/database';

export interface SessionContext {
  userId: string;
  email: string;
  orgId: string | null;
  orgName: string | null;
  role: Role | null;
  /** Preenchido quando não foi possível ler o vínculo (ex.: migração não aplicada). */
  dbError: string | null;
}

/**
 * Resolve usuário, organização e papel do usuário logado.
 * Redireciona para /login quando não há sessão válida.
 */
export async function getSessionContext(): Promise<SessionContext> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('memberships')
    .select('org_id, role, organizations ( name )')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      userId: user.id,
      email: user.email ?? '',
      orgId: null,
      orgName: null,
      role: null,
      dbError: error.message,
    };
  }

  const org = data?.organizations as { name?: string } | { name?: string }[] | null | undefined;
  const orgName = Array.isArray(org) ? org[0]?.name : org?.name;

  return {
    userId: user.id,
    email: user.email ?? '',
    orgId: data?.org_id ?? null,
    orgName: orgName ?? null,
    role: (data?.role as Role | undefined) ?? null,
    dbError: null,
  };
}
