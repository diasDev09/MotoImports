import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Moto } from '../data/motos.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import { AppContext } from './AppContext.ts'
import type { Acessorio, AppContextValue } from './AppContext.ts'

export function AppProvider({ children }: { children: ReactNode }) {
    const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null)
    const [acessorios, setAcessorios] = useState<Acessorio[]>([])
    const [lead, setLead] = useState<LeadRegistrado | null>(null)

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
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}