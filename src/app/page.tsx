import { redirect } from 'next/navigation';

// A raiz leva ao dashboard. O middleware envia para /login quem não tem sessão.
export default function Home() {
  redirect('/dashboard');
}
