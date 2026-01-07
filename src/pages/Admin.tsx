import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { apiMock } from '@/lib/api-mock';
import { getMesaConfig, atualizarMesasOcupadas, podeDiminuirMesas, calcularMesasOcupadas, contarAgendamentosConfirmados, getMesasOcupadas } from '@/lib/mesa-utils';
import { getTodayLocal } from '@/lib/utils';
import type { Agendamento, AgendamentoStatus, MesaConfig } from '@/lib/api-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import CancelModal from '@/components/CancelModal';
import MesaDuplaToggle from '@/components/MesaDuplaToggle';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Plus,
  Minus,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<AgendamentoStatus | undefined>('pendente');
  const [mesaConfig, setMesaConfig] = useState<MesaConfig>(getMesaConfig());
  const [dataSelecionada, setDataSelecionada] = useState<string>(
    getTodayLocal()
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<Agendamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Nomes dos dias da semana
  const diasSemana = [
    { valor: 0, nome: 'Dom' },
    { valor: 1, nome: 'Seg' },
    { valor: 2, nome: 'Ter' },
    { valor: 3, nome: 'Qua' },
    { valor: 4, nome: 'Qui' },
    { valor: 5, nome: 'Sex' },
    { valor: 6, nome: 'Sáb' },
  ];

  const handleToggleDiaAberto = async (dia: number) => {
    const diasAbertosAtuais = mesaConfig.diasAbertos || [];
    const novosDiasAbertos = diasAbertosAtuais.includes(dia)
      ? diasAbertosAtuais.filter(d => d !== dia)
      : [...diasAbertosAtuais, dia].sort();
    
    try {
      await apiMock.updateMesaConfig({ diasAbertos: novosDiasAbertos });
      await carregarMesaConfig();
      toast({
        title: 'Dias atualizados!',
        description: `Dias abertos: ${novosDiasAbertos.map(d => diasSemana.find(ds => ds.valor === d)?.nome).join(', ')}`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  // Carrega agendamentos
  const carregarAgendamentos = async () => {
    setIsLoading(true);
    try {
      const dados = await apiMock.getAgendamentos(statusFiltro);
      setAgendamentos(dados);
      setPaginaAtual(1);
    } catch (error) {
      toast({
        title: 'Erro ao carregar agendamentos',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega configuração de mesas
  const carregarMesaConfig = async () => {
    try {
      let config = await apiMock.getMesaConfig();
      let precisaSalvar = false;
      
      // Sincroniza mesas ocupadas com confirmados para todas as datas
      const agendamentosTodos = await apiMock.getAgendamentos();
      const todasAsDatas = new Set<string>();
      
      // Coleta todas as datas que têm agendamentos confirmados
      agendamentosTodos
        .filter(a => a.status === 'confirmado')
        .forEach(a => todasAsDatas.add(a.data));
      
      // Também verifica a data selecionada para garantir sincronização
      todasAsDatas.add(dataSelecionada);
      
      // Para cada data (incluindo a selecionada), garante que mesas ocupadas seja exatamente o número de mesas dos confirmados
      todasAsDatas.forEach(data => {
        const mesasConfirmadas = calcularMesasOcupadas(data);
        const ocupadasAtuais = config.ocupadasPorData[data] || 0;
        
        // Se diferente, atualiza para o valor correto
        if (ocupadasAtuais !== mesasConfirmadas) {
          if (mesasConfirmadas === 0) {
            // Remove a entrada se não há confirmados (reseta para 0)
            delete config.ocupadasPorData[data];
          } else {
            config.ocupadasPorData[data] = mesasConfirmadas;
          }
          precisaSalvar = true;
        }
      });
      
      // Remove datas que não têm mais confirmados (reseta para 0)
      Object.keys(config.ocupadasPorData).forEach(data => {
        if (!todasAsDatas.has(data)) {
          const mesasConfirmadas = calcularMesasOcupadas(data);
          if (mesasConfirmadas === 0 && config.ocupadasPorData[data] > 0) {
            delete config.ocupadasPorData[data];
            precisaSalvar = true;
          }
        }
      });
      
      // Salva apenas se houve mudanças
      if (precisaSalvar) {
        await apiMock.updateMesaConfig(config);
      }
      
      setMesaConfig(config);
    } catch (error) {
      console.error('Erro ao carregar configuração de mesas:', error);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [statusFiltro]);

  useEffect(() => {
    carregarMesaConfig();
  }, [dataSelecionada]);

  // Calcula valores para a data selecionada
  // Primeiro calcula mesas ocupadas por confirmados
  const mesasOcupadasPorConfirmados = calcularMesasOcupadas(dataSelecionada);
  const agendamentosConfirmados = contarAgendamentosConfirmados(dataSelecionada);
  
  // Obtém valor do config
  const mesasOcupadasConfig = mesaConfig.ocupadasPorData[dataSelecionada] || 0;
  
  // Mesas ocupadas atuais deve ser exatamente o número de mesas dos confirmados
  // Se não há confirmados, deve ser 0 (não usa o valor do config se não há confirmados)
  const mesasOcupadasAtuais = mesasOcupadasPorConfirmados;
  
  // Pode diminuir apenas se configurado for maior que confirmados (mas não deve acontecer após sincronização)
  const podeDiminuir = mesasOcupadasConfig > mesasOcupadasPorConfirmados;

  // Paginação
  const totalPaginas = Math.ceil(agendamentos.length / ITEMS_PER_PAGE);
  const inicio = (paginaAtual - 1) * ITEMS_PER_PAGE;
  const fim = inicio + ITEMS_PER_PAGE;
  const agendamentosPagina = agendamentos.slice(inicio, fim);

  // Formata data
  const formatarData = (data: string) => {
    try {
      return format(new Date(data + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return data;
    }
  };

  // Ações
  const handleConfirmar = async (id: string) => {
    try {
      const agendamento = agendamentos.find(a => a.id === id);
      if (!agendamento) return;
      
      // Confirma o agendamento (isso já incrementa as mesas no api-mock)
      await apiMock.confirmarAgendamento(id);
      
      // Recarrega agendamentos primeiro
      await carregarAgendamentos();
      
      // Aguarda um pouco para garantir que os dados foram salvos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recarrega config e sincroniza
      await carregarMesaConfig();
      
      toast({
        title: 'Agendamento confirmado!',
        description: 'O agendamento foi movido para concluídos.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao confirmar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleAbrirCancelModal = (agendamento: Agendamento) => {
    setAgendamentoParaCancelar(agendamento);
    setCancelModalOpen(true);
  };

  const handleCancelar = async (motivo?: string) => {
    if (!agendamentoParaCancelar) return;

    try {
      const eraConfirmado = agendamentoParaCancelar.status === 'confirmado';
      await apiMock.cancelarAgendamento(agendamentoParaCancelar.id, motivo);
      
      // Se era confirmado, atualiza mesas ocupadas
      if (eraConfirmado) {
        const mesasOcupadasConfig = mesaConfig.ocupadasPorData[agendamentoParaCancelar.data] || 0;
        const mesasConfirmadas = calcularMesasOcupadas(agendamentoParaCancelar.data);
        const novaQuantidade = Math.max(mesasOcupadasConfig, mesasConfirmadas);
        await apiMock.updateMesaConfig({
          ...mesaConfig,
          ocupadasPorData: {
            ...mesaConfig.ocupadasPorData,
            [agendamentoParaCancelar.data]: novaQuantidade,
          },
        });
      }
      
      toast({
        title: 'Agendamento cancelado!',
        description: 'O agendamento foi movido para cancelados.',
      });
      await carregarAgendamentos();
      await carregarMesaConfig();
    } catch (error) {
      toast({
        title: 'Erro ao cancelar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleRetornar = async (id: string) => {
    try {
      await apiMock.retornarAgendamento(id);
      toast({
        title: 'Agendamento retornado!',
        description: 'O agendamento foi movido para concluídos.',
      });
      await carregarAgendamentos();
      await carregarMesaConfig();
    } catch (error) {
      toast({
        title: 'Erro ao retornar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleMesaDuplaToggle = async (agendamento: Agendamento, novoValor: boolean) => {
    try {
      await apiMock.updateAgendamento(agendamento.id, { mesaDupla: novoValor });
      
      // Se o agendamento está confirmado, recalcula mesas ocupadas
      if (agendamento.status === 'confirmado') {
        // Aguarda um pouco para garantir que o agendamento foi atualizado no localStorage
        await new Promise(resolve => setTimeout(resolve, 100));
        const mesasConfirmadas = calcularMesasOcupadas(agendamento.data);
        const configAtual = await apiMock.getMesaConfig();
        await apiMock.updateMesaConfig({
          ...configAtual,
          ocupadasPorData: {
            ...configAtual.ocupadasPorData,
            [agendamento.data]: mesasConfirmadas,
          },
        });
      }
      
      toast({
        title: 'Mesa atualizada!',
        description: novoValor ? 'Mesa marcada como dupla (2 mesas)' : 'Mesa marcada como simples (1 mesa)',
      });
      await carregarAgendamentos();
      await carregarMesaConfig();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}`, '_blank');
  };

  const handleBaixarExcel = async () => {
    try {
      const csv = await apiMock.baixarExcel(statusFiltro);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `agendamentos_${statusFiltro || 'todos'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Download iniciado!',
        description: 'O arquivo CSV foi baixado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao baixar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleAumentarMesasOcupadas = async () => {
    const mesasOcupadasConfig = mesaConfig.ocupadasPorData[dataSelecionada] || 0;
    const novaQuantidade = Math.max(mesasOcupadasConfig, mesasOcupadasPorConfirmados) + 1;
    
    if (novaQuantidade > mesaConfig.total) {
      toast({
        title: 'Erro',
        description: `Não é possível ter mais de ${mesaConfig.total} mesas ocupadas.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (atualizarMesasOcupadas(dataSelecionada, novaQuantidade)) {
      await carregarMesaConfig();
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível aumentar mesas ocupadas.',
        variant: 'destructive',
      });
    }
  };

  const handleDiminuirMesasOcupadas = async () => {
    if (!podeDiminuir) return;
    const novaQuantidade = mesasOcupadasAtuais - 1;
    if (atualizarMesasOcupadas(dataSelecionada, novaQuantidade)) {
      await carregarMesaConfig();
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível diminuir mesas ocupadas.',
        variant: 'destructive',
      });
    }
  };

  const handleAumentarTotalMesas = async () => {
    try {
      await apiMock.updateMesaConfig({ total: mesaConfig.total + 1 });
      await carregarMesaConfig();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleDiminuirTotalMesas = async () => {
    if (mesaConfig.total <= 1) return;
    try {
      await apiMock.updateMesaConfig({ total: mesaConfig.total - 1 });
      await carregarMesaConfig();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (isLoading && agendamentos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-lg font-bold uppercase tracking-widest text-primary">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-primary text-glow-pink">
            MITTS
          </h1>
          <div className="text-sm uppercase tracking-wide text-muted-foreground">
            DATA: {formatarData(dataSelecionada)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="border-muted hover:border-primary"
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-muted hover:border-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Controles de Mesas */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-muted bg-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  MESAS USADAS
                </div>
                <div className="text-2xl font-bold text-foreground">{mesasOcupadasAtuais}</div>
                <div className="text-xs text-muted-foreground">
                  Confirmados: {agendamentosConfirmados} cliente{agendamentosConfirmados !== 1 ? 's' : ''} ({mesasOcupadasPorConfirmados} {mesasOcupadasPorConfirmados === 1 ? 'mesa' : 'mesas'})
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDiminuirMesasOcupadas}
                  disabled={!podeDiminuir}
                  className="h-10 w-10 border-muted"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAumentarMesasOcupadas}
                  className="h-10 w-10 border-muted"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted bg-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  NUMERO MESAS
                </div>
                <div className="text-2xl font-bold text-foreground">{mesaConfig.total}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDiminuirTotalMesas}
                  disabled={mesaConfig.total <= 1}
                  className="h-10 w-10 border-muted"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAumentarTotalMesas}
                  className="h-10 w-10 border-muted"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted bg-card/80">
          <CardContent className="p-4">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                DIAS ABERTOS
              </div>
              <div className="flex flex-wrap gap-2">
                {diasSemana.map((dia) => (
                  <div key={dia.valor} className="flex items-center gap-2">
                    <Checkbox
                      checked={mesaConfig.diasAbertos?.includes(dia.valor) || false}
                      onCheckedChange={() => handleToggleDiaAberto(dia.valor)}
                    />
                    <label className="text-sm font-medium cursor-pointer">
                      {dia.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Botão Baixar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={statusFiltro || 'todos'}
          onValueChange={(value) => setStatusFiltro(value === 'todos' ? undefined : (value as AgendamentoStatus))}
          className="flex-1"
        >
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="pendente" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="confirmado" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Concluídos
            </TabsTrigger>
            <TabsTrigger value="cancelado" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
              Cancelados
            </TabsTrigger>
            <TabsTrigger value="indisponivel" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              Indisponíveis
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          onClick={handleBaixarExcel}
          className="btn-neon"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Excel
        </Button>
      </div>

      {/* Listagem */}
      <div className="space-y-4">
        {agendamentosPagina.length === 0 ? (
          <Card className="border-2 border-muted bg-card/50">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground">
                Nenhum agendamento encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          agendamentosPagina.map((agendamento) => (
            <Card
              key={agendamento.id}
              className="border-2 border-muted bg-card/80 transition-all hover:border-primary/50"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 space-y-2">
                    {agendamento.nome && (
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Nome:
                        </span>{' '}
                        <span className="font-semibold text-foreground">{agendamento.nome}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Telefone:
                      </span>{' '}
                      <span className="font-semibold text-foreground">{agendamento.telefone}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Data:
                      </span>{' '}
                      <span className="font-semibold text-foreground">
                        {formatarData(agendamento.data)}
                      </span>
                      {agendamento.horario && (
                        <span className="ml-2 text-muted-foreground">
                          às {agendamento.horario}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Pessoas:
                      </span>{' '}
                      <span className="font-semibold text-foreground">{agendamento.pessoas}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Mesa:
                      </span>{' '}
                      <Badge variant={agendamento.mesaDupla ? 'secondary' : 'outline'}>
                        {agendamento.mesaDupla ? 'Mesa Dupla (2)' : 'Mesa Simples (1)'}
                      </Badge>
                    </div>
                    {agendamento.observacoes && (
                      <div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Observações:
                        </span>{' '}
                        <span className="text-foreground">{agendamento.observacoes}</span>
                      </div>
                    )}
                    {agendamento.motivoCancelamento && (
                      <div>
                        <span className="text-xs uppercase tracking-wide text-destructive">
                          Motivo Cancelamento:
                        </span>{' '}
                        <span className="text-destructive">{agendamento.motivoCancelamento}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleWhatsApp(agendamento.telefone)}
                      className="h-10 w-10 border-secondary hover:bg-secondary hover:text-secondary-foreground"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>

                    {statusFiltro === 'pendente' && (
                      <>
                        <Button
                          variant="default"
                          onClick={() => handleConfirmar(agendamento.id)}
                          className="bg-accent hover:bg-accent/90"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Confirmar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleAbrirCancelModal(agendamento)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Recusar
                        </Button>
                        <MesaDuplaToggle
                          checked={agendamento.mesaDupla}
                          onCheckedChange={(checked) => handleMesaDuplaToggle(agendamento, checked)}
                        />
                      </>
                    )}

                    {statusFiltro === 'confirmado' && (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => handleAbrirCancelModal(agendamento)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                        <MesaDuplaToggle
                          checked={agendamento.mesaDupla}
                          onCheckedChange={(checked) => handleMesaDuplaToggle(agendamento, checked)}
                        />
                      </>
                    )}

                    {statusFiltro === 'cancelado' && (
                      <>
                        {agendamento.data === dataSelecionada && (
                          <Button
                            variant="default"
                            onClick={() => handleRetornar(agendamento.id)}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Retornar
                          </Button>
                        )}
                      </>
                    )}

                    {statusFiltro === 'indisponivel' && (
                      <MesaDuplaToggle
                        checked={agendamento.mesaDupla}
                        onCheckedChange={(checked) => handleMesaDuplaToggle(agendamento, checked)}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="border-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaAtual ? 'default' : 'outline'}
                size="icon"
                onClick={() => setPaginaAtual(pagina)}
                className={pagina === paginaAtual ? '' : 'border-muted'}
              >
                {pagina}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="border-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal de Cancelamento */}
      <CancelModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleCancelar}
        agendamentoNome={agendamentoParaCancelar?.nome}
      />
    </div>
  );
};

export default Admin;
