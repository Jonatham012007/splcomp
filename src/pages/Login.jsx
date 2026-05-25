import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const sucessoCadastro = location.state?.success;

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    if (!email.includes('@') || !email.includes('.')) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (!senha) {
      setErro('Digite sua senha.');
      return;
    }
    try {
      setLoading(true);
      const loggedUser = await login(email, senha);
      navigate(loggedUser.triagem_concluida ? '/dashboard' : '/triagem');
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-icon">+</div>
        <h1>Entrar no SPL</h1>
        <p className="subtitle">Acesse sua conta para continuar o acompanhamento de saúde.</p>
        {sucessoCadastro && <div className="success">Cadastro realizado com sucesso! Faça login para continuar.</div>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            E-mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="test@mail.com" />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Digite sua senha" />
          </label>
          {erro && <div className="error">{erro}</div>}
          <button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p className="footer-text">Não tem cadastro? <Link to="/cadastro">Criar uma conta</Link></p>
        <p className="demo">Login de teste: <strong>test@mail.com</strong> / <strong>senha</strong></p>
      </section>
    </main>
  );
}
