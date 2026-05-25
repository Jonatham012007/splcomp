import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api.js';

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    if (!form.nome.trim()) return setErro('Informe seu nome completo.');
    if (!form.cpf.replace(/\D/g, '').match(/^\d{11}$/)) return setErro('Informe um CPF válido com 11 dígitos.');
    if (!form.email.includes('@') || !form.email.includes('.')) return setErro('Informe um e-mail válido.');
    if (form.senha.length < 8) return setErro('A senha deve ter pelo menos 8 caracteres.');
    if (form.senha !== form.confirmar) return setErro('As senhas não conferem.');

    try {
      setLoading(true);
      await register(form);
      navigate('/triagem');
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card wide">
        <div className="brand-icon">+</div>
        <h1>Criar conta</h1>
        <p className="subtitle">Preencha os dados para iniciar sua triagem no SPL.</p>
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>
            Nome completo
            <input value={form.nome} onChange={e => update('nome', e.target.value)} placeholder="Seu nome" />
          </label>
          <label>
            CPF
            <input value={form.cpf} onChange={e => update('cpf', e.target.value)} placeholder="000.000.000-00" />
          </label>
          <label>
            E-mail
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="voce@email.com" />
          </label>
          <label>
            Telefone
            <input value={form.telefone} onChange={e => update('telefone', e.target.value)} placeholder="(88) 99999-9999" />
          </label>
          <label>
            Senha
            <input type="password" value={form.senha} onChange={e => update('senha', e.target.value)} placeholder="Mínimo 8 caracteres" />
          </label>
          <label>
            Confirmar senha
            <input type="password" value={form.confirmar} onChange={e => update('confirmar', e.target.value)} />
          </label>
          {erro && <div className="error full">{erro}</div>}
          <button className="full" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
        </form>
        <p className="footer-text">Já tem conta? <Link to="/">Voltar para login</Link></p>
      </section>
    </main>
  );
}
