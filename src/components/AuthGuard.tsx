import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(true);
      
      if (!auth.isAuthenticated()) {
        navigate('/login', { replace: true });
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-lg font-bold uppercase tracking-widest text-primary">
            Verificando...
          </div>
          <div className="h-1 w-32 bg-muted">
            <div className="h-full w-full animate-pulse bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
