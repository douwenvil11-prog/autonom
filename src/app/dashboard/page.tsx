export default function Dashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', margin: 0 }}>
      {/* Menu Lateral */}
      <aside style={{ width: '250px', backgroundColor: '#1a202c', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>AUTONOM</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>📊 Visão Geral</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>🤖 Agentes de IA</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>🌐 Meus Sites</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>💬 Conversas</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>⚙️ Configurações</a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', color: '#2d3748', margin: 0 }}>Painel de Controle</h1>
          <div style={{ backgroundColor: '#3182ce', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
            Meu Perfil
          </div>
        </header>

        {/* Cartões de Resumo */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#718096' }}>Sites Criados</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#1a202c' }}>0</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#718096' }}>Vendas no Mês</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#38a169' }}>R$ 0,00</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#718096' }}>Atendimentos IA</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#805ad5' }}>0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
