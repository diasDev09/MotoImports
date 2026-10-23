import { createContext, useContext } from 'react'
import type { Moto } from '../data/motos.ts'
import type { LeadRegistrado } from '../domain/lead.ts'

// Estado que as partes do grupo dividem: moto escolhida, acessórios e lead.
// (porte da v1, da Emilly; o componente Provider ficou em AppProvider.tsx)

export interface Acessorio {
    id: string
    nome: string
    preco: number
}

export interface AppContextValue {
    motoSelecionada: Moto | null
    selecionarMoto: (moto: Moto | null) => void
    limparMoto: () => void
    acessorios: Acessorio[]
    adicionarAcessorio: (item: Acessorio) => void
    removerAcessorio: (id: string) => void
    limparAcessorios: () => void
    totalAcessorios: number
    lead: LeadRegistrado | null
    registrarLead: (lead: LeadRegistrado | null) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

// atalho para usar o contexto em qualquer componente: const { motoSelecionada } = useApp()
export function useApp(): AppContextValue {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp precisa estar dentro do AppProvider')
    return ctx
}