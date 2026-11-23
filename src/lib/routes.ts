/** Rotas acessíveis sem login. Todo o resto exige sessão. */
const PUBLIC_PREFIXES = ['/login', '/auth'];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Impede open redirect: só aceita caminhos internos ("/algo"),
 * nunca URLs externas nem "//host".
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return '/dashboard';
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return '/dashboard';
  }
  return next;
}
