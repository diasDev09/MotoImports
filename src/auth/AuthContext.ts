import { createContext, useContext } from 'react'

// Login com Google (fase 2). Só a pessoa logada reserva moto, confirma pedido da boutique
// ou agenda serviço na oficina. O Provider fica em AuthProvider.tsx.

export interface Usuario {
    uid: string
    nome: string
    email: string
    foto?: string
}

// 'carregando' = ainda perguntando ao Google se já existe uma sessão aberta
export type EstadoAuth = 'carregando' | 'anonimo' | 'logado'

// Contrato com o provedor de login. O Firebase é uma implementação (lib/firebase.ts);
// nos testes entra uma implementação falsa, sem rede.
export interface ServicoAuth {
    observar: (aoMudar: (usuario: Usuario | null) => void) => () => void
    entrarComGoogle: () => Promise<void>
    sair: () => Promise<void>
}

export interface AuthContextValue {
    estado: EstadoAuth
    usuario: Usuario | null
    // false quando o Firebase não foi configurado (faltam as variáveis VITE_FIREBASE_*)
    disponivel: boolean
    erro: string | null
    entrar: () => Promise<void>
    sair: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
    return ctx
}
