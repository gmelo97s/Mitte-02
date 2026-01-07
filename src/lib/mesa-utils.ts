import type { Agendamento, MesaConfig } from './api-types';

const MESAS_CONFIG_KEY = 'mittesp_mesas_config';
const AGENDAMENTOS_KEY = 'mittesp_agendamentos';

/**
 * Obtém configuração de mesas do localStorage
 */
export const getMesaConfig = (): MesaConfig => {
  try {
    const data = localStorage.getItem(MESAS_CONFIG_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignora erros
  }

  // Configuração padrão
  return {
    total: 20,
    ocupadasPorData: {},
    diasAbertos: [3, 4, 5], // Quinta, Sexta, Sábado
  };
};

/**
 * Salva configuração de mesas no localStorage
 */
export const saveMesaConfig = (config: MesaConfig): void => {
  localStorage.setItem(MESAS_CONFIG_KEY, JSON.stringify(config));
};

/**
 * Obtém todos os agendamentos do localStorage
 */
const getAgendamentos = (): Agendamento[] => {
  try {
    const data = localStorage.getItem(AGENDAMENTOS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignora erros
  }
  return [];
};

/**
 * Calcula mesas ocupadas por agendamentos confirmados para uma data
 */
export const calcularMesasOcupadas = (data: string): number => {
  const agendamentos = getAgendamentos();
  const confirmados = agendamentos.filter(
    (a) => a.status === 'confirmado' && a.data === data
  );

  return confirmados.reduce((total, agendamento) => {
    return total + (agendamento.mesaDupla ? 2 : 1);
  }, 0);
};

/**
 * Conta número de agendamentos confirmados (não mesas) para uma data
 */
export const contarAgendamentosConfirmados = (data: string): number => {
  const agendamentos = getAgendamentos();
  return agendamentos.filter(
    (a) => a.status === 'confirmado' && a.data === data
  ).length;
};

/**
 * Verifica se pode diminuir mesas ocupadas
 */
export const podeDiminuirMesas = (data: string, ocupadasAtuais: number): boolean => {
  const confirmados = calcularMesasOcupadas(data);
  return ocupadasAtuais > confirmados;
};

/**
 * Atualiza mesas ocupadas para uma data com validação
 */
export const atualizarMesasOcupadas = (
  data: string,
  novaQuantidade: number
): boolean => {
  const config = getMesaConfig();
  const mesasConfirmadas = calcularMesasOcupadas(data);

  // Não pode diminuir abaixo do número de mesas ocupadas por confirmados
  if (novaQuantidade < mesasConfirmadas) {
    return false;
  }

  // Não pode ser negativo
  if (novaQuantidade < 0) {
    return false;
  }

  // Não pode ser maior que o total
  if (novaQuantidade > config.total) {
    return false;
  }

  config.ocupadasPorData[data] = novaQuantidade;
  saveMesaConfig(config);
  return true;
};

/**
 * Obtém mesas ocupadas para uma data, garantindo que seja pelo menos o número de confirmados
 */
export const getMesasOcupadas = (data: string): number => {
  const config = getMesaConfig();
  const mesasConfirmadas = calcularMesasOcupadas(data);
  const ocupadasConfig = config.ocupadasPorData[data] || 0;
  
  // Retorna o maior valor entre config e confirmados
  // Isso garante que sempre mostre pelo menos as mesas dos confirmados
  return Math.max(ocupadasConfig, mesasConfirmadas);
};

/**
 * Verifica se uma data está em um dia aberto
 */
export const isDiaAberto = (data: string): boolean => {
  const config = getMesaConfig();
  const date = new Date(data + 'T00:00:00');
  const diaSemana = date.getDay(); // 0 = domingo, 6 = sábado
  return config.diasAbertos.includes(diaSemana);
};

/**
 * Verifica disponibilidade de mesas para uma data e horário
 */
export const verificarDisponibilidade = (
  data: string,
  horario?: string
): {
  disponivel: boolean;
  mesasDisponiveis: number;
  mesasOcupadas: number;
  mesasTotal: number;
  diaAberto: boolean;
} => {
  const config = getMesaConfig();
  const diaAberto = isDiaAberto(data);
  const ocupadas = config.ocupadasPorData[data] || 0;
  const mesasConfirmadas = calcularMesasOcupadas(data);
  // Usa o maior valor entre config e confirmados
  const ocupadasReais = Math.max(ocupadas, mesasConfirmadas);
  const disponiveis = config.total - ocupadasReais;

  return {
    disponivel: diaAberto && disponiveis > 0,
    mesasDisponiveis: disponiveis,
    mesasOcupadas: ocupadasReais,
    mesasTotal: config.total,
    diaAberto,
  };
};

/**
 * Incrementa mesas ocupadas ao confirmar agendamento
 */
export const incrementarMesasOcupadas = (data: string, mesaDupla: boolean): void => {
  const config = getMesaConfig();
  const ocupadasAtuais = config.ocupadasPorData[data] || 0;
  const incremento = mesaDupla ? 2 : 1;
  const novaQuantidade = ocupadasAtuais + incremento;

  // Garante que não ultrapasse o total
  if (novaQuantidade <= config.total) {
    config.ocupadasPorData[data] = novaQuantidade;
    saveMesaConfig(config);
  } else {
    // Se ultrapassar, define como total
    config.ocupadasPorData[data] = config.total;
    saveMesaConfig(config);
  }
};

/**
 * Decrementa mesas ocupadas ao cancelar agendamento confirmado
 */
export const decrementarMesasOcupadas = (data: string, mesaDupla: boolean): void => {
  const config = getMesaConfig();
  const ocupadasAtuais = config.ocupadasPorData[data] || 0;
  const decremento = mesaDupla ? 2 : 1;
  const novaQuantidade = Math.max(0, ocupadasAtuais - decremento);

  config.ocupadasPorData[data] = novaQuantidade;
  saveMesaConfig(config);
};
