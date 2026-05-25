import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getDashboard } from '../services/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        if (error.message.includes('Triagem pendente') || error.message.includes('Triagem')) {
          navigate('/triagem');
          return;
        }
        setErro(error.message || 'Não foi possível carregar o dashboard.');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [navigate]);

  const perfil = dashboard?.perfil_saude;
  const linhas = useMemo(() => perfil?.linhas_ativas || [], [perfil]);

  async function sair() {
    await logout();
    navigate('/');
  }

  return (
    <main className="dashboard">
      <nav className="navbar">
        <strong>SPL - Dashboard de Saúde</strong>
        <button className="logout" onClick={sair}>Sair</button>
      </nav>

      <section className="dash-content">
        {loading && <p>Carregando dashboard...</p>}
        {erro && <div className="error">{erro}</div>}

        {dashboard && (
          <>
            <header>
              <h1>{dashboard.saudacao || `Olá, ${user.nome}`}</h1>
              <p>Resumo inicial do seu acompanhamento personalizado.</p>
            </header>

            <div className="cards">
              <article className="metric-card">
                <span>IMC</span>
                <strong>{perfil?.imc?.toFixed ? perfil.imc.toFixed(1) : perfil?.imc || '--'}</strong>
                <p>{perfil?.classificacao || 'Calculado a partir da triagem.'}</p>
              </article>
              <article className="metric-card">
                <span>Linhas de cuidado</span>
                <strong>{linhas.length || 0}</strong>
                <p>{linhas.length ? linhas.join(', ') : 'Nenhuma linha ativa.'}</p>
              </article>
              <article className="metric-card">
                <span>Atividade</span>
                <strong>{perfil?.nivel_atividade || 'Não informado'}</strong>
                <p>Nível informado na triagem.</p>
              </article>
            </div>

            <section className="recommendations">
              <h2>Recomendações personalizadas</h2>
              {dashboard.recomendacoes?.length ? dashboard.recomendacoes.map((rec, index) => (
                <div className="rec-card" key={rec.slug || index}>
                  <strong>{rec.titulo}</strong>
                  <p>{rec.descricao}</p>
                </div>
              )) : <p>Nenhuma recomendação encontrada.</p>}
            </section>

            <section className="recommendations">
              <h2>Metas semanais</h2>
              {dashboard.metas?.length ? dashboard.metas.map((meta, index) => (
                <div className="rec-card" key={`${meta.titulo}-${index}`}>
                  <strong>{meta.titulo}</strong>
                  <p>{meta.meta}</p>
                </div>
              )) : <p>Nenhuma meta encontrada.</p>}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
