export type Role = 'owner' | 'admin' | 'agent' | 'client';

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Novos' },
  { value: 'contacted', label: 'Contatados' },
  { value: 'negotiating', label: 'Em negociação' },
  { value: 'won', label: 'Ganhos' },
  { value: 'lost', label: 'Perdidos' },
];

export interface Lead {
  id: string;
  org_id: string;
  name: string;
  category: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  instagram: string | null;
  source: string;
  status: LeadStatus;
  score: number | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  org_id: string;
  actor_id: string | null;
  type: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

/** Quem pode acessar a área interna (o papel "client" usa o Client Portal). */
export const INTERNAL_ROLES: Role[] = ['owner', 'admin', 'agent'];
