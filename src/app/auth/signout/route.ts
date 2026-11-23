import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Encerra a sessão. Aceita apenas POST para evitar logout por link externo. */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${request.nextUrl.origin}/login`, {
    status: 303,
  });
}
