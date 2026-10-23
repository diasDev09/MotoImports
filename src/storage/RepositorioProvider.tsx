import type { ReactNode } from 'react'
import { RepositorioContext } from './Repositorio.ts'
import type { Repositorio } from './Repositorio.ts'
import { criarRepositorioFirestore } from '../lib/firestore.ts'

// Criado uma vez; null quando o Firebase não está configurado.
const repositorioPadrao = criarRepositorioFirestore()

export function RepositorioProvider({
    children,
    repositorio = repositorioPadrao,
}: {
    children: ReactNode
    repositorio?: Repositorio | null
}) {
    return <RepositorioContext value={repositorio}>{children}</RepositorioContext>
}
