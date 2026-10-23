import type { ReactNode } from 'react'
import { AuthProvider } from '../auth/AuthProvider.tsx'
import type { Usuario } from '../auth/AuthContext.ts'
import { criarServicoFalso, USUARIO_TESTE } from './servicoAuth.ts'

// Envolve a árvore com o AuthProvider falso. Sem argumento, a pessoa já está logada.
export function ComLogin({ children, usuario = USUARIO_TESTE }: { children: ReactNode; usuario?: Usuario | null }) {
    const { servico } = criarServicoFalso(usuario)
    return <AuthProvider servico={servico}>{children}</AuthProvider>
}
