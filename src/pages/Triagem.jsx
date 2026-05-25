import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { saveTriage } from '../services/api.js';

export default function Triagem() {
  const navigate = useNavigate();
  useAuth();
  const [step, setStep] = useState(1);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nascimento: '', sexo: '', peso: '', altura: '', atividade: '', diabetes: '', hipertensao: false, obesidade: false, usa_medicamentos: false, objetivo: '' });

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function nextStep() {
    setErro('');
    if (!form.nascimento || !form.sexo || !form.peso || !form.altura) {
      setErro('Preencha todos os dados pessoais para continuar.');
      return;
    }
    setStep(2);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    if (!form.atividade || !form.diabetes || !form.objetivo) {
      setErro('Preencha todos os campos da etapa 2.');
      return;
    }
    try {
      setLoading(true);
      await saveTriage(form);
      navigate('/dashboard');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar a triagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card wide">
        <div className="brand-icon">+</div>
        <div className="progress"><span style={{ width: step === 1 ? '50%' : '100%' }} /></div>
        <p className="progress-label">Etapa {step} de 2</p>
        <h1>Triagem de saúde</h1>
        <p className="subtitle">Responda com atenção para montarmos seu perfil personalizado.</p>

        <form onSubmit={handleSubmit} className="form grid-form">
          {step === 1 ? (
            <>
              <label>
                Data de nascimento
                <input type="date" value={form.nascimento} onChange={e => update('nascimento', e.target.value)} />
              </label>
              <label>
                Sexo
                <select value={form.sexo} onChange={e => update('sexo', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Feminino</option>
                  <option>Masculino</option>
                  <option>Prefiro não informar</option>
                </select>
              </label>
              <label>
                Peso (kg)
                <input type="number" value={form.peso} onChange={e => update('peso', e.target.value)} placeholder="70" />
              </label>
              <label>
                Altura (cm)
                <input type="number" value={form.altura} onChange={e => update('altura', e.target.value)} placeholder="170" />
              </label>
              {erro && <div className="error full">{erro}</div>}
              <button type="button" className="full" onClick={nextStep}>Continuar</button>
            </>
          ) : (
            <>
              <label>
                Nível de atividade física
                <select value={form.atividade} onChange={e => update('atividade', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Sedentário</option>
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Intenso</option>
                </select>
              </label>
              <label>
                Possui diabetes?
                <select value={form.diabetes} onChange={e => update('diabetes', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </label>
              <label className="check"><input type="checkbox" checked={form.hipertensao} onChange={e => update('hipertensao', e.target.checked)} /> Hipertensão</label>
              <label className="check"><input type="checkbox" checked={form.obesidade} onChange={e => update('obesidade', e.target.checked)} /> Obesidade</label>
              <label className="check"><input type="checkbox" checked={form.usa_medicamentos} onChange={e => update('usa_medicamentos', e.target.checked)} /> Usa medicamentos</label>
              <label className="full">
                Objetivo principal
                <select value={form.objetivo} onChange={e => update('objetivo', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Controlar glicemia</option>
                  <option>Perder peso</option>
                  <option>Melhorar alimentação</option>
                  <option>Fazer acompanhamento preventivo</option>
                </select>
              </label>
              {erro && <div className="error full">{erro}</div>}
              <button type="button" className="secondary" onClick={() => setStep(1)}>Voltar</button>
              <button disabled={loading}>{loading ? 'Salvando...' : 'Finalizar triagem'}</button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
