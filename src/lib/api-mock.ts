import type {
  Agendamento,
  AgendamentoStatus,
  Usuario,
  LoginRequest,
  LoginResponse,
  DisponibilidadeRequest,
  DisponibilidadeResponse,
  MesaConfig,
} from './api-types';
import {
  getMesaConfig,
  saveMesaConfig,
  verificarDisponibilidade,
  incrementarMesasOcupadas,
  decrementarMesasOcupadas,
  calcularMesasOcupadas,
} from './mesa-utils';

// Keys do localStorage
const AGENDAMENTOS_KEY = 'mittesp_agendamentos';
const USUARIOS_KEY = 'mittesp_usuarios';

// Inicializa dados mock se não existirem
const initializeMockData = () => {
  // Inicializa usuários
  if (!localStorage.getItem(USUARIOS_KEY)) {
    const usuarios: Usuario[] = [
      {
        id: '1',
        email: 'admin@mittesp.com.br',
        senha: 'Teste@123',
        nome: 'Administrador',
      },
    ];
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  // Inicializa agendamentos de exemplo
  if (!localStorage.getItem(AGENDAMENTOS_KEY)) {
    const hoje = getTodayLocal();
    const amanhaDate = new Date();
    amanhaDate.setDate(amanhaDate.getDate() + 1);
    const amanha = `${amanhaDate.getFullYear()}-${String(amanhaDate.getMonth() + 1).padStart(2, '0')}-${String(amanhaDate.getDate()).padStart(2, '0')}`;
    
    const agendamentos: Agendamento[] = [
      {
        id: '1',
        nome: 'João Silva',
        telefone: '11987654321',
        data: hoje,
        horario: '20:00',
        pessoas: 4,
        observacoes: 'Aniversário',
        mesas: [1, 2],
        mesaDupla: true,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        nome: 'Maria Santos',
        telefone: '11976543210',
        data: hoje,
        horario: '21:00',
        pessoas: 6,
        observacoes: 'Celebração',
        mesas: [3],
        mesaDupla: true,
        status: 'confirmado',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        nome: 'Pedro Costa',
        telefone: '11965432109',
        data: amanha,
        horario: '19:00',
        pessoas: 2,
        observacoes: '',
        mesas: [4],
        mesaDupla: true,
        status: 'cancelado',
        motivoCancelamento: 'Cliente desistiu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        telefone: '11954321098',
        data: amanha,
        pessoas: 8,
        observacoes: 'Sem mesas disponíveis',
        mesas: [],
        mesaDupla: true,
        status: 'indisponivel',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(agendamentos));
  }

  // Inicializa configuração de mesas
  if (!localStorage.getItem('mittesp_mesas_config')) {
    const config: MesaConfig = {
      total: 20,
      ocupadasPorData: {},
      diasAbertos: [3, 4, 5], // Quinta, Sexta, Sábado (0 = domingo, 6 = sábado)
    };
    localStorage.setItem('mittesp_mesas_config', JSON.stringify(config));
  }
};

// Inicializa ao carregar
initializeMockData();

// Helper para obter agendamentos
const getAgendamentos = (): Agendamento[] => {
  try {
    const data = localStorage.getItem(AGENDAMENTOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper para salvar agendamentos
const saveAgendamentos = (agendamentos: Agendamento[]): void => {
  localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(agendamentos));
};

// Helper para obter usuários
const getUsuarios = (): Usuario[] => {
  try {
    const data = localStorage.getItem(USUARIOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// API Mock
export const apiMock = {
  /**
   * POST /login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuarios = getUsuarios();
        const usuario = usuarios.find(
          (u) => u.email === credentials.email && u.senha === credentials.senha
        );

        if (!usuario) {
          reject(new Error('Email ou senha inválidos'));
          return;
        }

        const token = `mock_token_${Date.now()}_${Math.random()}`;
        const { senha, ...userWithoutPassword } = usuario;

        resolve({
          token,
          user: userWithoutPassword,
        });
      }, 500); // Simula delay de rede
    });
  },

  /**
   * GET /agendamento?status=...
   */
  getAgendamentos: async (status?: AgendamentoStatus): Promise<Agendamento[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let agendamentos = getAgendamentos();
        
        if (status) {
          agendamentos = agendamentos.filter((a) => a.status === status);
        }

        // Ordena por data e horário
        agendamentos.sort((a, b) => {
          if (a.data !== b.data) {
            return a.data.localeCompare(b.data);
          }
          return (a.horario || '').localeCompare(b.horario || '');
        });

        resolve(agendamentos);
      }, 300);
    });
  },

  /**
   * POST /agendamento
   */
  createAgendamento: async (data: Partial<Agendamento>): Promise<Agendamento> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agendamentos = getAgendamentos();
        const novoAgendamento: Agendamento = {
          id: `agendamento_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          nome: data.nome,
          telefone: data.telefone || '',
          data: data.data || '',
          horario: data.horario,
          pessoas: data.pessoas || 0,
          observacoes: data.observacoes || '',
          mesas: data.mesas || [],
          mesaDupla: data.mesaDupla !== undefined ? data.mesaDupla : true, // Padrão: true
          status: data.status || 'pendente',
          motivoCancelamento: data.motivoCancelamento,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        agendamentos.push(novoAgendamento);
        saveAgendamentos(agendamentos);

        resolve(novoAgendamento);
      }, 300);
    });
  },

  /**
   * PUT /agendamento/:id
   */
  updateAgendamento: async (
    id: string,
    updates: Partial<Agendamento>
  ): Promise<Agendamento> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agendamentos = getAgendamentos();
        const index = agendamentos.findIndex((a) => a.id === id);

        if (index === -1) {
          reject(new Error('Agendamento não encontrado'));
          return;
        }

        const agendamentoAtualizado: Agendamento = {
          ...agendamentos[index],
          ...updates,
          id, // Garante que o ID não mude
          updatedAt: new Date().toISOString(),
        };

        agendamentos[index] = agendamentoAtualizado;
        saveAgendamentos(agendamentos);

        resolve(agendamentoAtualizado);
      }, 300);
    });
  },

  /**
   * POST /agendamento/:id/confirmar
   */
  confirmarAgendamento: async (id: string): Promise<Agendamento> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agendamentos = getAgendamentos();
        const index = agendamentos.findIndex((a) => a.id === id);

        if (index === -1) {
          reject(new Error('Agendamento não encontrado'));
          return;
        }

        const agendamento = agendamentos[index];
        const eraPendente = agendamento.status === 'pendente';
        
        // Atualiza status
        agendamento.status = 'confirmado';
        agendamento.updatedAt = new Date().toISOString();

        // Incrementa mesas ocupadas apenas se estava pendente
        if (eraPendente) {
          incrementarMesasOcupadas(agendamento.data, agendamento.mesaDupla);
        }

        agendamentos[index] = agendamento;
        saveAgendamentos(agendamentos);

        resolve(agendamento);
      }, 300);
    });
  },

  /**
   * POST /agendamento/:id/cancelar
   */
  cancelarAgendamento: async (
    id: string,
    motivo?: string
  ): Promise<Agendamento> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agendamentos = getAgendamentos();
        const index = agendamentos.findIndex((a) => a.id === id);

        if (index === -1) {
          reject(new Error('Agendamento não encontrado'));
          return;
        }

        const agendamento = agendamentos[index];
        const eraConfirmado = agendamento.status === 'confirmado';

        // Atualiza status
        agendamento.status = 'cancelado';
        agendamento.motivoCancelamento = motivo;
        agendamento.updatedAt = new Date().toISOString();

        // Se era confirmado, decrementa mesas ocupadas
        if (eraConfirmado) {
          decrementarMesasOcupadas(agendamento.data, agendamento.mesaDupla);
        }

        agendamentos[index] = agendamento;
        saveAgendamentos(agendamentos);

        resolve(agendamento);
      }, 300);
    });
  },

  /**
   * POST /agendamento/:id/retornar
   */
  retornarAgendamento: async (id: string): Promise<Agendamento> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agendamentos = getAgendamentos();
        const index = agendamentos.findIndex((a) => a.id === id);

        if (index === -1) {
          reject(new Error('Agendamento não encontrado'));
          return;
        }

        const agendamento = agendamentos[index];

        if (agendamento.status !== 'cancelado') {
          reject(new Error('Apenas agendamentos cancelados podem ser retornados'));
          return;
        }

        // Verifica se é da mesma data (hoje)
        const hoje = getTodayLocal();
        if (agendamento.data !== hoje) {
          reject(new Error('Apenas agendamentos do dia atual podem ser retornados'));
          return;
        }

        // Atualiza status
        agendamento.status = 'confirmado';
        agendamento.motivoCancelamento = undefined;
        agendamento.updatedAt = new Date().toISOString();

        // Incrementa mesas ocupadas
        incrementarMesasOcupadas(agendamento.data, agendamento.mesaDupla);

        agendamentos[index] = agendamento;
        saveAgendamentos(agendamentos);

        resolve(agendamento);
      }, 300);
    });
  },

  /**
   * GET /disponibilidade
   */
  verificarDisponibilidade: async (
    request: DisponibilidadeRequest
  ): Promise<DisponibilidadeResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const disponibilidade = verificarDisponibilidade(request.data, request.horario);
        resolve({
          disponivel: disponibilidade.disponivel,
          mesasDisponiveis: disponibilidade.mesasDisponiveis,
          mesasOcupadas: disponibilidade.mesasOcupadas,
          mesasTotal: disponibilidade.mesasTotal,
        });
      }, 200);
    });
  },

  /**
   * GET /baixar
   */
  baixarExcel: async (status?: AgendamentoStatus): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let agendamentos = getAgendamentos();
        
        if (status) {
          agendamentos = agendamentos.filter((a) => a.status === status);
        }

        // Formata como CSV
        const headers = ['ID', 'Nome', 'Telefone', 'Data', 'Horário', 'Pessoas', 'Observações', 'Mesa Dupla', 'Status', 'Motivo Cancelamento'];
        const rows = agendamentos.map((a) => [
          a.id,
          a.nome || '',
          a.telefone,
          a.data,
          a.horario || '',
          a.pessoas.toString(),
          a.observacoes,
          a.mesaDupla ? 'Sim' : 'Não',
          a.status,
          a.motivoCancelamento || '',
        ]);

        const csv = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        resolve(csv);
      }, 300);
    });
  },

  /**
   * GET /mesas/config
   */
  getMesaConfig: async (): Promise<MesaConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMesaConfig());
      }, 100);
    });
  },

  /**
   * PUT /mesas/config
   */
  updateMesaConfig: async (config: Partial<MesaConfig>): Promise<MesaConfig> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentConfig = getMesaConfig();
        const updatedConfig: MesaConfig = {
          ...currentConfig,
          ...config,
        };

        // Validações
        if (updatedConfig.total < 1) {
          reject(new Error('Total de mesas deve ser pelo menos 1'));
          return;
        }

        // Garante que diasAbertos existe
        if (!updatedConfig.diasAbertos || updatedConfig.diasAbertos.length === 0) {
          updatedConfig.diasAbertos = currentConfig.diasAbertos || [3, 4, 5]; // Padrão: Quinta, Sexta, Sábado
        }

        saveMesaConfig(updatedConfig);
        resolve(updatedConfig);
      }, 200);
    });
  },

  /**
   * Calcula mesas ocupadas por confirmados para uma data
   */
  calcularMesasConfirmadas: (data: string): number => {
    return calcularMesasOcupadas(data);
  },
};
