import { createContext, useContext, useMemo, useState } from 'react';
import { clearSession, getSession, login as apiLogin, logout as apiLogout } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  async function login(email, senha) {
    const loggedUser = await apiLogin(email, senha);
    setUser(loggedUser);
    return loggedUser;
  }

  async function logout() {
    try {
      await apiLogout();
    } catch {
      clearSession();
    }
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return context;
}
