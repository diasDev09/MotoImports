// RF-10: quais horários da oficina estão livres.
// Funções puras, sem React: recebem o que já está ocupado e devolvem o que sobra.
import { HORARIOS } from '../data/posVenda.ts'

export interface ReservaHorario {
    data: string // "2026-10-24"
    horario: string // "09:00"
}

// Quem diz o que está ocupado numa data: hoje é uma simulação, amanhã pode ser uma API da oficina.
export type Ocupacao = (data: string) => readonly string[]

// SIMULAÇÃO: enquanto não há sistema da oficina, 2 dos 8 horários de cada dia ficam "ocupados",
// sempre os mesmos para a mesma data (assim o comportamento é previsível e testável).
export function agendaSimulada(data: string): readonly string[] {
    const soma = [...data.replace(/\D/g, '')].reduce((total, digito) => total + Number(digito), 0)
    return HORARIOS.filter((_, indice) => (indice + soma) % 4 === 0)
}

// ocupado = o que a oficina já tem + o que foi agendado nesta sessão
export function horarioOcupado(
    data: string,
    horario: string,
    ocupacao: Ocupacao,
    reservas: readonly ReservaHorario[] = [],
): boolean {
    return (
        ocupacao(data).includes(horario) || reservas.some((r) => r.data === data && r.horario === horario)
    )
}

export function horariosLivres(
    data: string,
    ocupacao: Ocupacao,
    reservas: readonly ReservaHorario[] = [],
): string[] {
    return HORARIOS.filter((h) => !horarioOcupado(data, h, ocupacao, reservas))
}