const USERS_KEY = 'spl_users';
const SESSION_KEY = 'spl_session';
const TRIAGE_KEY = 'spl_triage';

const wait = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

function getUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const hasDemo = users.some(user => user.email === 'test@mail.com');
  if (!hasDemo) {
    users.push({ id: crypto.randomUUID(), nome: 'Usuário Teste', email: 'test@mail.com', senha: 'senha', telefone: '(88) 99999-9999' });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(email, senha) {
  await wait();
  const user = getUsers().find(item => item.email === email && item.senha === senha);
  if (!user) throw new Error('Usuário ou senha inválido. Caso não seja cadastrado, crie uma conta!');
  const session = { id: user.id, nome: user.nome, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function register({ nome, email, senha, telefone }) {
  await wait();
  const users = getUsers();
  if (users.some(user => user.email === email)) throw new Error('Este e-mail já está cadastrado.');
  const user = { id: crypto.randomUUID(), nome, email, senha, telefone };
  users.push(user);
  saveUsers(users);
  return { id: user.id, nome: user.nome, email: user.email };
}

export async function saveTriage(userId, data) {
  await wait();
  const all = JSON.parse(localStorage.getItem(TRIAGE_KEY) || '{}');
  all[userId] = { ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(TRIAGE_KEY, JSON.stringify(all));
  return all[userId];
}

export function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getTriage(userId) {
  const all = JSON.parse(localStorage.getItem(TRIAGE_KEY) || '{}');
  return all[userId] || null;
}
