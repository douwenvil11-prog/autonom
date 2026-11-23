import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, translateAuthError } from '../validation';

describe('validateEmail', () => {
  it('aceita e-mail válido', () => {
    expect(validateEmail('pessoa@empresa.com.br')).toBeNull();
    expect(validateEmail('  pessoa@empresa.com  ')).toBeNull();
  });
  it('rejeita vazio e formatos inválidos', () => {
    expect(validateEmail('')).not.toBeNull();
    expect(validateEmail('   ')).not.toBeNull();
    expect(validateEmail('sem-arroba.com')).not.toBeNull();
    expect(validateEmail('a@b')).not.toBeNull();
    expect(validateEmail('a b@c.com')).not.toBeNull();
  });
  it('rejeita e-mail acima de 254 caracteres', () => {
    expect(validateEmail('a'.repeat(250) + '@x.com')).not.toBeNull();
  });
});

describe('validatePassword', () => {
  it('aceita senha com 8+ caracteres, letras e números', () => {
    expect(validatePassword('abc12345')).toBeNull();
  });
  it('rejeita vazia, curta, sem número ou sem letra', () => {
    expect(validatePassword('')).not.toBeNull();
    expect(validatePassword('abc123')).not.toBeNull();
    expect(validatePassword('somenteletras')).not.toBeNull();
    expect(validatePassword('1234567890')).not.toBeNull();
  });
});

describe('translateAuthError', () => {
  it('traduz erros conhecidos', () => {
    expect(translateAuthError('Invalid login credentials')).toBe('E-mail ou senha incorretos.');
    expect(translateAuthError('User already registered')).toMatch(/já possui cadastro/);
  });
  it('não vaza mensagens internas desconhecidas', () => {
    expect(translateAuthError('pg: relation "x" does not exist')).toBe(
      'Não foi possível concluir a operação. Tente novamente.'
    );
  });
});
