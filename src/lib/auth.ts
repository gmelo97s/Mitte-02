import type { Usuario, Sessao } from './api-types';

const SESSION_KEY = 'mittesp_session';
const SESSION_DURATION_MS = 6 * 60 * 60 * 1000; // 6 horas

export interface SessionData {
  user: Omit<Usuario, 'senha'>;
  token: string;
  expiresAt: string;
}

export const auth = {
  /**
   * Salva sessão no localStorage
   */
  saveSession(user: Omit<Usuario, 'senha'>, token: string): void {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    const sessionData: SessionData = {
      user,
      token,
      expiresAt,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  /**
   * Obtém sessão do localStorage
   */
  getSession(): SessionData | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;

      const session: SessionData = JSON.parse(data);
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Verifica se está autenticado e se a sessão é válida
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now >= expiresAt) {
      // Sessão expirada, remove
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * Obtém usuário atual
   */
  getUser(): Omit<Usuario, 'senha'> | null {
    const session = this.getSession();
    if (!session || !this.isAuthenticated()) return null;
    return session.user;
  },

  /**
   * Obtém token de autenticação
   */
  getToken(): string | null {
    const session = this.getSession();
    if (!session || !this.isAuthenticated()) return null;
    return session.token;
  },

  /**
   * Remove sessão (logout)
   */
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Verifica se sessão está expirada
   */
  isExpired(): boolean {
    const session = this.getSession();
    if (!session) return true;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    return now >= expiresAt;
  },
};
