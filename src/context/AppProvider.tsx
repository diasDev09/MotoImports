import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Moto } from '../data/motos.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import type { VoucherReserva } from '../domain/reservation.ts'
import type { ReservaHorario } from '../domain/agenda.ts'
import { AppContext } from './AppContext.ts'
import type { Acessorio, AppContextValue, Simulacao } from './AppContext.ts'

// valores de partida: servem para os testes começarem com o app já em um estado (ex.: moto escolhida)
export interface EstadoInicial {
    moto?: Moto | null
    acessorios?: Acessorio[]
    lead?: LeadRegistrado | null
    simulacao?: Simulacao | null
}

export function AppProvider({ children, inicial = {} }: { children: ReactNode; inicial?: EstadoInicial }) {
    const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(inicial.moto ?? null)
    const [acessorios, setAcessorios] = useState<Acessorio[]>(inicial.acessorios ?? [])
    const [lead, setLead] = useState<LeadRegistrado | null>(inicial.lead ?? null)
    const [simulacao, setSimulacao] = useState<Simulacao | null>(inicial.simulacao ?? null)
    const [voucherReserva, setVoucherReserva] = useState<VoucherReserva | null>(null)
    const [horariosReservados, setHorariosReservados] = useState<ReservaHorario[]>([])

    // não deixa adicionar o mesmo acessório duas vezes
    function adicionarAcessorio(item: Acessorio) {
        setAcessorios((atual) => (atual.some((a) => a.id === item.id) ? atual : [...atual, item]))
    }

    function removerAcessorio(id: string) {
        setAcessorios((atual) => atual.filter((a) => a.id !== id))
    }

    // useMemo para só recalcular a soma quando a lista de acessórios mudar
    const totalAcessorios = useMemo(
        () => acessorios.reduce((soma, a) => soma + a.preco, 0),
        [acessorios],
    )

    const value: AppContextValue = {
        motoSelecionada,
        selecionarMoto: setMotoSelecionada,
        limparMoto: () => setMotoSelecionada(null),
        acessorios,
        adicionarAcessorio,
        removerAcessorio,
        limparAcessorios: () => setAcessorios([]),
        totalAcessorios,
        lead,
        registrarLead: setLead,
        simulacao,
        salvarSimulacao: setSimulacao,
        voucherReserva,
        salvarVoucherReserva: setVoucherReserva,
        horariosReservados,
        // RF-10: o horário agendado passa a contar como ocupado
        reservarHorario: (reserva: ReservaHorario) => setHorariosReservados((atual) => [...atual, reserva]),
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}