# AUTONOM — AI Sales Operating System

SaaS para prospecção, CRM, criação de sites e atendimento com agentes de IA.

## Stack

- **Frontend + Backend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Banco de dados + Login:** Supabase (Postgres com RLS, Auth)
- **Hospedagem:** Vercel ou Netlify (o repositório mantém o `netlify.toml` original)

## Estado atual (branch `feat/fundacao`)

| Etapa | Estado |
|---|---|
| Estrutura do repositório | Concluída |
| Identidade visual dark premium (tema, componentes base) | Escrita, **não verificada no navegador** |
| Dashboard (dados reais do banco, sem números inventados) | Escrito, **não verificado em execução** |
| Autenticação: cadastro, login, logout, recuperação de senha | Escrita, **não verificada em execução** |
| Proteção de rotas (middleware, falha fechada) | Escrita; regras de rota **testadas** |
| Banco de dados: organizações, papéis, leads, atividades + RLS | Escrito, **ainda não aplicado** a um projeto Supabase |
| Radar AI, BI, Website Builder, CRM, agentes, WhatsApp, Delivery, Finance, Automations, Client Portal, Analytics, Settings | **Não iniciados** (aparecem como "Em breve" no menu) |

"Verificado" significa executado de fato. Até aqui só foram executados os testes unitários da lógica pura
(validação, rotas públicas/anti open-redirect, métricas): 18 testes. Ainda **não** houve `npm install`,
`npm run build` nem teste no navegador, porque o ambiente de desenvolvimento não tinha acesso à rede.

## Como rodar

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Supabase > Project Settings > API). A URL tem o formato `https://SEU-PROJETO.supabase.co`.
3. No Supabase, abra o **SQL Editor** e execute `supabase/migrations/0001_fundacao.sql`.
4. Em Authentication > URL Configuration, cadastre a URL do app e `SUA_URL/auth/callback` como URL de redirecionamento.
5. `npm run dev` e abra http://localhost:3000
6. `npm run typecheck` e `npm test` para checar tipos e testes.

## Segurança

- Credenciais ficam só em variáveis de ambiente. `.env.local` está no `.gitignore`.
- A chave `service_role` nunca deve ir ao navegador nem ao GitHub.
- Todas as tabelas têm RLS. Cada usuário só acessa dados da própria organização, conforme o papel
  (`owner`, `admin`, `agent`, `client`).
- **Chave exposta no histórico:** uma chave `service_role` do Supabase foi commitada no passado. Ela foi removida do
  código, mas continua no histórico do Git. É obrigatório **gerar uma nova chave no painel do Supabase e invalidar a antiga**.

## Estrutura

```
src/app/(app)/      área logada (layout com sidebar, dashboard)
src/app/login/      login, cadastro e recuperação de senha
src/app/auth/       callback de e-mail, logout, redefinição de senha
src/lib/supabase/   clientes (navegador, servidor, middleware)
src/lib/            validação, rotas, métricas, navegação, sessão
supabase/migrations esquema do banco
```

## Backup

A versão anterior à reorganização está preservada na tag `backup/pre-fundacao-2026-11-23`.
Foram removidos desta branch (e continuam na tag): `src/lib/supabase.ts.` (arquivo com nome inválido que continha
a chave), `supabase.ts` da raiz (duplicado e fora do lugar) e as duas versões antigas do dashboard, unificadas em
`src/app/(app)/dashboard/page.tsx`.

## Próximas etapas

1. Verificar a fundação em execução (build, login real, RLS)
2. Radar AI + Smart CRM (cadastro e edição de leads, funil, atividades)
3. Website Builder AI
4. Sales Agent e Closing Agent
5. WhatsApp Business, Delivery, Finance, Client Portal
6. AUTONOM BRAIN, Automations, Analytics, Settings
7. Testes completos, segurança e publicação
