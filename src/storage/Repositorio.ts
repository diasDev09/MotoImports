import { createContext, useContext } from 'react'
import type { VoucherReserva } from '../domain/reservation.ts'
import type { Agendamento } from '../domain/agendamento.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import type { PedidoBoutique } from './documentos.ts'

// Armazenamento dos dados (fase 2). A tela só conhece esta interface;
// o Firestore é uma implementação (lib/firestore.ts) e os testes usam uma falsa.
//
// Tudo que pertence a uma pessoa fica sob o uid dela. Nada é lido de volta pelo app nesta fase:
// guardamos para o atendimento e para a futura página "minhas reservas".
export interface Repositorio {
    salvarReserva: (uid: string, voucher: VoucherReserva) => Promise<void>
    salvarPedidoBoutique: (uid: string, pedido: PedidoBoutique) => Promise<void>
    salvarAgendamento: (uid: string, agendamento: Agendamento) => Promise<void>
    // o contato não exige login, então o uid é opcional
    salvarLead: (lead: LeadRegistrado, uid?: string) => Promise<void>
}

// null = sem armazenamento (Firebase não configurado, ou testes que não se importam com isso)
export const RepositorioContext = createContext<Repositorio | null>(null)

export function useRepositorio(): Repositorio | null {
    return useContext(RepositorioContext)
}
