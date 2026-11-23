export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Menu Lateral (Só aparece no Computador) */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AUTONOM
        </h2>
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl text-blue-400 font-medium">
            <span>📊</span> Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <span>🤖</span> Agentes de IA
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <span>🌐</span> Meus Sites
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <span>💬</span> Conversas
          </a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        
        {/* Cabeçalho */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Painel de Controle</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-600/20 active:scale-95">
            Meu Perfil
          </button>
        </header>

        {/* Conteúdo */}
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cartão 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-xl">🌐</div>
                <h3 className="text-slate-500 font-medium">Sites Criados</h3>
              </div>
              <p className="text-4xl font-bold text-slate-800">0</p>
            </div>

            {/* Cartão 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xl">💰</div>
                <h3 className="text-slate-500 font-medium">Vendas no Mês</h3>
              </div>
              <p className="text-4xl font-bold text-slate-800">R$ 0,00</p>
            </div>

            {/* Cartão 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-xl">🤖</div>
                <h3 className="text-slate-500 font-medium">Atendimentos IA</h3>
              </div>
              <p className="text-4xl font-bold text-slate-800">0</p>
            </div>

          </div>
        </div>
      </main>

      {/* Menu Inferior (Só aparece no Celular) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-4 z-20 pb-safe">
        <a href="#" className="flex flex-col items-center text-blue-600 text-xs gap-1">
          <span className="text-2xl">📊</span> Visão
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 hover:text-slate-600 text-xs gap-1">
          <span className="text-2xl">🤖</span> Agentes
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 hover:text-slate-600 text-xs gap-1">
          <span className="text-2xl">🌐</span> Sites
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 hover:text-slate-600 text-xs gap-1">
          <span className="text-2xl">💬</span> Chat
        </a>
      </nav>
    </div>
  );
}
