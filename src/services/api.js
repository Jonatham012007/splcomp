const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
const TOKEN_KEY = 'spl_token';
const SESSION_KEY = 'spl_session';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveAuth(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  const session = {
    ...data.usuario,
    token: data.token,
    triagem_concluida: data.triagem_concluida,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const campos = data.campos ? ` ${Object.values(data.campos).join(' ')}` : '';
    throw new Error(`${data.erro || 'Erro ao comunicar com a API.'}${campos}`.trim());
  }

  return data;
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export async function login(email, senha) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  return saveAuth(data);
}

export async function register({ nome, cpf, telefone, email, senha }) {
  const data = await request('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, cpf, telefone, email, senha }),
  });
  return saveAuth(data);
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    clearSession();
  }
}

export async function saveTriage(data) {
  const condicoes = [];
  if (data.diabetes === 'Sim') condicoes.push('diabetes');
  if (data.hipertensao) condicoes.push('hipertensao');
  if (data.obesidade) condicoes.push('obesidade');

  return request('/triagem', {
    method: 'POST',
    body: JSON.stringify({
      data_nascimento: data.nascimento,
      sexo: data.sexo,
      peso_kg: Number(data.peso),
      altura_cm: Number(data.altura),
      condicoes,
      usa_medicamentos: Boolean(data.usa_medicamentos),
      nivel_atividade: data.atividade,
    }),
  });
}

export async function getTriage() {
  return request('/triagem');
}

export async function getDashboard() {
  return request('/usuario/dashboard');
}
