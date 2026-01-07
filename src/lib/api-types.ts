export type AgendamentoStatus = 'pendente' | 'confirmado' | 'cancelado' | 'indisponivel';

export interface Agendamento {
  id: string;
  nome?: string; // Para indisponíveis
  telefone: string;
  data: string; // ISO format YYYY-MM-DD
  horario?: string; // HH:MM
  pessoas: number;
  observacoes: string;
  mesas: number[]; // IDs das mesas ou quantidade
  mesaDupla: boolean; // Se true, ocupa 2 mesas (PADRÃO: true)
  status: AgendamentoStatus;
  motivoCancelamento?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MesaConfig {
  total: number;
  ocupadasPorData: Record<string, number>; // { "2025-04-11": 4 }
  diasAbertos: number[]; // [0, 1, 2, 3, 4, 5, 6] - 0 = domingo, 6 = sábado
}

export interface Usuario {
  id: string;
  email: string;
  senha: string; // Em produção, seria hash
  nome: string;
}

export interface Sessao {
  token: string;
  userId: string;
  expiresAt: string; // ISO format
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<Usuario, 'senha'>;
}

export interface DisponibilidadeRequest {
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
}

export interface DisponibilidadeResponse {
  disponivel: boolean;
  mesasDisponiveis: number;
  mesasOcupadas: number;
  mesasTotal: number;
}
