import { describe, it, expect } from 'vitest';
import { isPublicPath, safeNextPath } from '../routes';

describe('isPublicPath (proteção de rotas)', () => {
  it('libera apenas login e rotas de auth', () => {
    expect(isPublicPath('/login')).toBe(true);
    expect(isPublicPath('/auth/callback')).toBe(true);
    expect(isPublicPath('/auth/redefinir-senha')).toBe(true);
  });
  it('bloqueia áreas privadas', () => {
    expect(isPublicPath('/')).toBe(false);
    expect(isPublicPath('/dashboard')).toBe(false);
    expect(isPublicPath('/crm')).toBe(false);
  });
  it('não confunde prefixos parecidos', () => {
    expect(isPublicPath('/login-falso')).toBe(false);
    expect(isPublicPath('/authentic')).toBe(false);
  });
});

describe('safeNextPath (anti open redirect)', () => {
  it('mantém caminhos internos', () => {
    expect(safeNextPath('/crm')).toBe('/crm');
    expect(safeNextPath('/crm?aba=leads')).toBe('/crm?aba=leads');
  });
  it('usa /dashboard por padrão', () => {
    expect(safeNextPath(null)).toBe('/dashboard');
    expect(safeNextPath(undefined)).toBe('/dashboard');
    expect(safeNextPath('')).toBe('/dashboard');
  });
  it('rejeita URLs externas e tentativas de bypass', () => {
    expect(safeNextPath('https://malicioso.com')).toBe('/dashboard');
    expect(safeNextPath('//malicioso.com')).toBe('/dashboard');
    expect(safeNextPath('/\\malicioso.com')).toBe('/dashboard');
    expect(safeNextPath('javascript:alert(1)')).toBe('/dashboard');
  });
});
