import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { apiMock } from '@/lib/api-mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Força tema dark na página de login
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiMock.login(data);
      login(response.user, response.token);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando para o painel administrativo...',
      });
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 500);
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Email ou senha inválidos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold uppercase tracking-widest text-primary text-glow-pink">
              MITTS
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Painel Administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium uppercase tracking-wide text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mittesp.com.br"
                  className="input-neon"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium uppercase tracking-wide text-foreground">
                  Senha
                </label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  className="input-neon"
                  {...register('senha')}
                  disabled={isLoading}
                />
                {errors.senha && (
                  <p className="text-sm text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="btn-neon w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
