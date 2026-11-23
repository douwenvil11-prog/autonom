import { Sparkles } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${box} flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow`}
      >
        <Sparkles className="h-5 w-5 text-white" aria-hidden />
      </div>
      <span
        className={`${text} bg-gradient-to-r from-white to-brand-300 bg-clip-text font-bold tracking-tight text-transparent`}
      >
        AUTONOM
      </span>
    </div>
  );
}
