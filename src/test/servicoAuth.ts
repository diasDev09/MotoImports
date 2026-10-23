import type { ServicoAuth, Usuario } from '../auth/AuthContext.ts'
import type { Repositorio } from '../storage/Repositorio.ts'
import type { PedidoBoutique } from '../storage/documentos.ts'
import type { VoucherReserva } from '../domain/reservation.ts'
import type { Agendamento } from '../domain/agendamento.ts'
import type { LeadRegistrado } from '../domain/lead.ts'

// Serviço de login falso para os testes: sem rede, sem Firebase.
// Começa logado (usuario) ou anônimo (null); entrarComGoogle "loga" o usuário informado.
export const USUARIO_TESTE: Usuario = {
    uid: 'u-teste',
    nome: 'Maria Teste',
    email: 'maria@exemplo.com',
}

export function criarServicoFalso(inicial: Usuario | null = USUARIO_TESTE, aoEntrar: Usuario = USUARIO_TESTE) {
    let ouvinte: ((u: Usuario | null) => void) | null = null
    const chamadas = { entrar: 0, sair: 0 }

    const servico: ServicoAuth = {
        observar(aoMudar) {
            ouvinte = aoMudar
            aoMudar(inicial)
            return () => {
                ouvinte = null
            }
        },
        async entrarComGoogle() {
            chamadas.entrar++
            ouvinte?.(aoEntrar)
        },
        async sair() {
            chamadas.sair++
            ouvinte?.(null)
        },
    }
    return { servico, chamadas }
}

// Repositório falso: guarda tudo na memória para os testes conferirem o que foi salvo.
// Com { falhar: true }, toda gravação rejeita, para testar o aviso de erro.
export function criarRepositorioFalso({ falhar = false }: { falhar?: boolean } = {}) {
    const salvos = {
        reservas: [] as { uid: string; voucher: VoucherReserva }[],
        pedidos: [] as { uid: string; pedido: PedidoBoutique }[],
        agendamentos: [] as { uid: string; agendamento: Agendamento }[],
        leads: [] as { uid?: string; lead: LeadRegistrado }[],
    }
    const gravar = async () => {
        if (falhar) throw new Error('sem conexão')
    }

    const repositorio: Repositorio = {
        async salvarReserva(uid, voucher) {
            await gravar()
            salvos.reservas.push({ uid, voucher })
        },
        async salvarPedidoBoutique(uid, pedido) {
            await gravar()
            salvos.pedidos.push({ uid, pedido })
        },
        async salvarAgendamento(uid, agendamento) {
            await gravar()
            salvos.agendamentos.push({ uid, agendamento })
        },
        async salvarLead(lead, uid) {
            await gravar()
            salvos.leads.push({ uid, lead })
        },
    }
    return { repositorio, salvos }
}
