/**
 * Horário de funcionamento do Outs Pub.
 * As chaves são o dia da semana do JS (0 = domingo) e os valores vão em horas
 * decimais. Fim maior que 24 significa que a casa vira a noite — sexta às 05h
 * é 29 no domingo seguinte da conta.
 */
const SCHEDULE: Record<number, { start: number; end: number }> = {
  0: { start: 17, end: 24 }, // domingo
  3: { start: 17, end: 24 }, // quarta
  4: { start: 19, end: 27 }, // quinta → 03h
  5: { start: 20, end: 29 }, // sexta → 05h
  6: { start: 20, end: 29 }, // sábado → 05h
};

const DAY_LABEL = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export interface OpenState {
  open: boolean;
  label: string;
}

export function getOpenState(now: Date = new Date()): OpenState {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  const today = SCHEDULE[day];
  if (today && hour >= today.start && hour < today.end) {
    return { open: true, label: "Aberto agora" };
  }

  // Ainda é a madrugada do dia anterior?
  const yesterday = SCHEDULE[(day + 6) % 7];
  if (yesterday && yesterday.end > 24 && hour + 24 < yesterday.end) {
    return { open: true, label: "Aberto agora" };
  }

  // Abre hoje mais tarde?
  if (today && hour < today.start) {
    const h = Math.floor(today.start);
    return { open: false, label: `Abre hoje às ${h}h` };
  }

  for (let step = 1; step <= 7; step += 1) {
    const next = SCHEDULE[(day + step) % 7];
    if (next) {
      const h = Math.floor(next.start);
      const when = step === 1 ? "amanhã" : DAY_LABEL[(day + step) % 7];
      return { open: false, label: `Abre ${when} às ${h}h` };
    }
  }

  return { open: false, label: "Fechado" };
}
