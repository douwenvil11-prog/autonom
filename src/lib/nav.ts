import {
  LayoutDashboard,
  Radar,
  LineChart,
  Globe,
  Users,
  Bot,
  Handshake,
  MessageCircle,
  Truck,
  Wallet,
  Workflow,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** "ready" = módulo implementado e navegável; "soon" = ainda não desenvolvido. */
  status: 'ready' | 'soon';
}

/**
 * Fonte única da navegação. Ao concluir um módulo, troque status para "ready".
 * Módulos "soon" aparecem desabilitados: não há botões que não fazem nada.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, status: 'ready' },
  { label: 'Radar AI', href: '/radar', icon: Radar, status: 'soon' },
  { label: 'Business Intelligence', href: '/inteligencia', icon: LineChart, status: 'soon' },
  { label: 'Website Builder', href: '/sites', icon: Globe, status: 'soon' },
  { label: 'Smart CRM', href: '/crm', icon: Users, status: 'soon' },
  { label: 'Sales Agent', href: '/vendas', icon: Bot, status: 'soon' },
  { label: 'Closing Agent', href: '/fechamento', icon: Handshake, status: 'soon' },
  { label: 'WhatsApp', href: '/whatsapp', icon: MessageCircle, status: 'soon' },
  { label: 'Delivery', href: '/entregas', icon: Truck, status: 'soon' },
  { label: 'Finance', href: '/financeiro', icon: Wallet, status: 'soon' },
  { label: 'Automations', href: '/automacoes', icon: Workflow, status: 'soon' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, status: 'soon' },
  { label: 'Configurações', href: '/configuracoes', icon: Settings, status: 'soon' },
];
