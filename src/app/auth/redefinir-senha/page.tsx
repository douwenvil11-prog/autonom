"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { translateAuthError, validatePassword } from '@/lib/validation';
import { Logo } from '@/components/Logo';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirm) return setError('As senhas não conferem.');

    setLoading(true);
    try {
      const supabase = createClient();
      // Exige a sessão de recuperação criada pelo link do e-mail.
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError('Link inválido ou expirado. Solicite uma nova recuperação de senha.');
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(translateAuthError(updateError.message));
        return;
      }
      setDone(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch {
      setError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 p-4">
      <div className="card w-full max-w-md animate-fade-up p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="mb-8 text-center text-sm text-slate-400">Defina sua nova senha</p>

        {done ? (
          <p role="status" className="rounded-lg bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-emerald-400">
            Senha atualizada! Redirecionando...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Mínimo de 8 caracteres, com letras e números.
              </p>
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-slate-300">
                Confirmar nova senha
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm font-medium text-red-400">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
