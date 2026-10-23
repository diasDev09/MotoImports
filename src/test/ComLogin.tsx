import type { ReactNode } from 'react'
import { AuthProvider } from '../auth/AuthProvider.tsx'
import type { Usuario } from '../auth/AuthContext.ts'
import { RepositorioProvider } from '../storage/RepositorioProvider.tsx'
import type { Repositorio } from '../storage/Repositorio.ts'
import { criarServicoFalso, USUARIO_TESTE } from './servicoAuth.ts'

// Envolve a árvore com login falso e, se quiser, um repositório falso.
// Sem argumentos, a pessoa já está logada e nada é gravado (repositório nulo).
export function ComLogin({
    children,
    usuario = USUARIO_TESTE,
    repositorio = null,
}: {
    children: ReactNode
    usuario?: Usuario | null
    repositorio?: Repositorio | null
}) {
    const { servico } = criarServicoFalso(usuario)
    return (
        <AuthProvider servico={servico}>
            <RepositorioProvider repositorio={repositorio}>{children}</RepositorioProvider>
        </AuthProvider>
    )
}
