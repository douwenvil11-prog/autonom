import { Users, Handshake, Trophy, Percent, Inbox } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getSessionContext } from '@/lib/session';
import { LEAD_STATUSES, type Activity, type LeadStatus } from '@/types/database';
import { conversionRate, emptyCounts, pipelineShares, totalLeads } from '@/lib/metrics';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-brand-400',
  contacted: 'bg-sky-400',
  negotiating: 'bg-amber-400',
  won: 'bg-emerald-400',
  lost: 'bg-slate-500',
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso));
}

export default async function DashboardPage() {
  const session = await getSessionContext();
  const counts = emptyCounts();
  let activities: Activity[] = [];
  let queryError: string | null = null;

  if (session.orgId) {
    const supabase = createClient();

    const [countResults, activityResult] = await Promise.all([
      Promise.all(
        LEAD_STATUSES.map(({ value }) =>
          supabase
            .from('leads')
            .select('id', { count: 'exact', head: true })
            .eq('org_id', session.orgId!)
            .eq('status', value)
        )
      ),
      supabase
        .from('activities')
        .select('*')
        .eq('org_id', session.orgId)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    countResults.forEach((result, i) => {
      if (result.error) queryError = result.error.message;
      else counts[LEAD_STATUSES[i].value] = result.count ?? 0;
    });
    if (activityResult.error) queryError = activityResult.error.message;
    else activities = (activityResult.data ?? []) as Activity[];
  }

  const total = totalLeads(counts);
  const rate = conversionRate(counts);
  const shares = pipelineShares(counts);

  const kpis = [
    { label: 'Leads', value: String(total), icon: Users, hint: 'Total na sua base' },
    { label: 'Em negociação', value: String(counts.negotiating), icon: Handshake, hint: 'Oportunidades ativas' },
    { label: 'Clientes ganhos', value: String(counts.won), icon: Trophy, hint: 'Negócios fechados' },
    {
      label: 'Conversão',
      value: rate === null ? '—' : `${rate.toString().replace('.', ',')}%`,
      icon: Percent,
      hint: rate === null ? 'Sem leads ainda' : 'Ganhos ÷ total de leads',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-fade-up space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Visão geral de {session.orgName ?? 'sua operação'}
        </p>
      </div>

      {queryError && (
        <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          Não foi possível carregar alguns indicadores. Verifique a migração do banco e tente novamente.
        </div>
      )}

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="card p-5 transition-shadow hover:shadow-glow">
            <div className="mb-4 flex items-center gap-2 text-slate-400">
              <span className="rounded-lg bg-brand-600/15 p-2 text-brand-300">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <h2 className="text-sm font-medium">{label}</h2>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card p-5 lg:col-span-3" aria-label="Funil de vendas">
          <h2 className="mb-5 text-base font-semibold text-white">Funil de vendas</h2>
          {total === 0 ? (
            <EmptyState text="Nenhum lead cadastrado ainda. Os leads aparecerão aqui conforme forem adicionados." />
          ) : (
            <ul className="space-y-4">
              {shares.map(({ value, label, count, percent }) => (
                <li key={value}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="tabular-nums text-slate-400">
                      {count} · {percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${STATUS_COLORS[value]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5 lg:col-span-2" aria-label="Atividades recentes">
          <h2 className="mb-5 text-base font-semibold text-white">Atividades recentes</h2>
          {activities.length === 0 ? (
            <EmptyState text="Nenhuma atividade registrada ainda." />
          ) : (
            <ul className="space-y-4">
              {activities.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200">{a.description}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(a.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <Inbox className="h-8 w-8 text-ink-600" aria-hidden />
      <p className="max-w-xs text-sm text-slate-500">{text}</p>
    </div>
  );
}
