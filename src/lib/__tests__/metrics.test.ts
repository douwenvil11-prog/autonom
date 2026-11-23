import { describe, it, expect } from 'vitest';
import { conversionRate, emptyCounts, pipelineShares, totalLeads } from '../metrics';

describe('metrics', () => {
  it('total é zero sem leads e conversão é null (não 0%)', () => {
    const c = emptyCounts();
    expect(totalLeads(c)).toBe(0);
    expect(conversionRate(c)).toBeNull();
  });

  it('calcula conversão = ganhos / total com 1 casa decimal', () => {
    const c = { ...emptyCounts(), new: 5, won: 1, lost: 1 };
    expect(totalLeads(c)).toBe(7);
    expect(conversionRate(c)).toBe(14.3);
  });

  it('100% quando todos os leads foram ganhos', () => {
    expect(conversionRate({ ...emptyCounts(), won: 4 })).toBe(100);
  });

  it('funil: percentuais por etapa e ordem fixa', () => {
    const shares = pipelineShares({ ...emptyCounts(), new: 2, contacted: 2 });
    expect(shares.map((s) => s.value)).toEqual(['new', 'contacted', 'negotiating', 'won', 'lost']);
    expect(shares[0].percent).toBe(50);
    expect(shares[1].percent).toBe(50);
    expect(shares[2].percent).toBe(0);
  });

  it('funil sem leads não divide por zero', () => {
    expect(pipelineShares(emptyCounts()).every((s) => s.percent === 0)).toBe(true);
  });
});
