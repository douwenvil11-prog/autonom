import { LEAD_STATUSES, type LeadStatus } from '../types/database';

export type StatusCounts = Record<LeadStatus, number>;

export function emptyCounts(): StatusCounts {
  return { new: 0, contacted: 0, negotiating: 0, won: 0, lost: 0 };
}

export function totalLeads(counts: StatusCounts): number {
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

/**
 * Taxa de conversão = ganhos / total de leads, em %, com 1 casa decimal.
 * Retorna null quando não há leads (evita mostrar "0%" como se fosse medida).
 */
export function conversionRate(counts: StatusCounts): number | null {
  const total = totalLeads(counts);
  if (total === 0) return null;
  return Math.round((counts.won / total) * 1000) / 10;
}

/** Largura (%) de cada etapa do funil em relação ao total. */
export function pipelineShares(counts: StatusCounts) {
  const total = totalLeads(counts);
  return LEAD_STATUSES.map(({ value, label }) => ({
    value,
    label,
    count: counts[value],
    percent: total === 0 ? 0 : Math.round((counts[value] / total) * 100),
  }));
}
