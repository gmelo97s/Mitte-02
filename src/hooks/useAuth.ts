import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/auth';
import type { Usuario } from '@/lib/api-types';

export interface UseAuthReturn {
  user: Omit<Usuario, 'senha'> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: Omit<Usuario, 'senha'>, token: string) => void;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<Omit<Usuario, 'senha'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão ao montar
    const checkAuth = () => {
      setIsLoading(true);
      const currentUser = auth.getUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();

    // Verifica periodicamente se sessão expirou
    const interval = setInterval(() => {
      if (!auth.isAuthenticated()) {
        setUser(null);
      }
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, []);

  const login = useCallback((userData: Omit<Usuario, 'senha'>, token: string) => {
    auth.saveSession(userData, token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && auth.isAuthenticated(),
    login,
    logout,
  };
};
