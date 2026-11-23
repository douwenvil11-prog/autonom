export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'Informe o e-mail.';
  if (value.length > 254 || !EMAIL_REGEX.test(value)) {
    return 'Informe um e-mail válido.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Informe a senha.';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'A senha deve conter letras e números.';
  }
  return null;
}

/** Traduz erros comuns do Supabase Auth para mensagens em português. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.';
  if (m.includes('user already registered')) return 'Este e-mail já possui cadastro.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if (m.includes('password should be')) return 'A senha não atende aos requisitos de segurança.';
  if (m.includes('network') || m.includes('fetch')) return 'Falha de conexão. Verifique sua internet e tente novamente.';
  return 'Não foi possível concluir a operação. Tente novamente.';
}
