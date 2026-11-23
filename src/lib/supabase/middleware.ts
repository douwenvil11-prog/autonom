import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isPublicPath } from '../routes';

/**
 * Renova a sessão do Supabase e aplica a proteção de rotas.
 * - Sem sessão em rota privada  -> redireciona para /login?next=<rota>
 * - Com sessão em /login        -> redireciona para /dashboard
 * Se o Supabase não estiver configurado, bloqueia rotas privadas
 * (falha fechada) em vez de liberar o acesso.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (isPublicPath(pathname)) return NextResponse.next({ request });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '?erro=config';
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() valida o token no servidor do Supabase (getSession() não valida).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === '/login') {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = '/dashboard';
    dashUrl.search = '';
    return NextResponse.redirect(dashUrl);
  }

  return response;
}
