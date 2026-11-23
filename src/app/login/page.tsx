"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { safeNextPath } from '@/lib/routes';
import {
  translateAuthError,
  validateEmail,
  validatePassword,
} from '@/lib/validation';
import { Logo } from '@/components/Logo';

type Mode = 'login' | 'signup' | 'recover';
type Feedback = { type: 'error' | 'success'; text: string } | null;

const TITLES: Record<Mode, string> = {
  login: 'Acesse sua conta para continuar',
  signup: 'Crie sua conta',
  recover: 'Enviaremos um link para redefinir sua senha',
};

const URL_ERRORS: Record<string, string> = {
  config: 'O servidor ainda não está configurado (variáveis do Supabase ausentes).',
  link: 'Link inválido ou expirado. Solicite um novo.',
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const urlError = params.get('erro');

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(
    urlError && URL_ERRORS[urlError]
      ? { type: 'error', text: URL_ERRORS[urlError] }
      : null
  );

  function switchMode(next: Mode) {
    setMode(next);
    setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!isSupabaseConfigured()) {
      setFeedback({ type: 'error', text: URL_ERRORS.config });
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) return setFeedback({ type: 'error', text: emailError });
    if (mode !== 'recover') {
      // No login só exigimos que haja senha; a regra de força vale no cadastro.
      const passwordError =
        mode === 'signup'
          ? validatePassword(password)
          : password
            ? null
            : 'Informe a senha.';
      if (passwordError) return setFeedback({ type: 'error', text: passwordError });
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const cleanEmail = email.trim();

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) {
          setFeedback({ type: 'error', text: translateAuthError(error.message) });
          return;
        }
        router.push(safeNextPath(params.get('next')));
        router.refresh();
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: `${origin}/auth/callback` },
        });
        if (error) {
          setFeedback({ type: 'error', text: translateAuthError(error.message) });
          return;
        }
        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setFeedback({
            type: 'success',
            text: 'Conta criada! Enviamos um link de confirmação para o seu e-mail.',
          });
          setMode('login');
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${origin}/auth/callback?next=/auth/redefinir-senha`,
        });
        if (error) {
          setFeedback({ type: 'error', text: translateAuthError(error.message) });
          return;
        }
        // Mensagem neutra: não revela se o e-mail tem cadastro.
        setFeedback({
          type: 'success',
          text: 'Se este e-mail estiver cadastrado, você receberá um link em instantes.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Falha de conexão. Verifique sua internet e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 p-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand-700/20 blur-3xl" />

      <div className="card relative z-10 w-full max-w-md animate-fade-up p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="mb-8 text-center text-sm text-slate-400">{TITLES[mode]}</p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
            />
          </div>

          {mode !== 'recover' && (
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
              {mode === 'signup' && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Mínimo de 8 caracteres, com letras e números.
                </p>
              )}
            </div>
          )}

          {feedback && (
            <p
              role={feedback.type === 'error' ? 'alert' : 'status'}
              className={`rounded-lg px-3 py-2 text-center text-sm font-medium ${
                feedback.type === 'error'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {feedback.text}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : mode === 'signup'
                  ? 'Criar conta'
                  : 'Enviar link'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => switchMode('recover')}
                className="block w-full text-slate-400 transition-colors hover:text-white"
              >
                Esqueci minha senha
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="block w-full text-slate-400 transition-colors hover:text-white"
              >
                Não tem uma conta? Cadastre-se
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-slate-400 transition-colors hover:text-white"
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
