import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext.ts'
import type { AuthContextValue, EstadoAuth, ServicoAuth, Usuario } from './AuthContext.ts'
import { criarServicoAuthFirebase } from '../lib/firebase.ts'

// Criado uma vez; null quando o Firebase não está configurado.
const servicoPadrao = criarServicoAuthFirebase()

// Mensagem para o usuário: o popup fechado pela própria pessoa não é um erro de verdade.
function mensagemDeErro(e: unknown): string | null {
    const codigo = typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : ''
    if (codigo === 'auth/popup-closed-by-user' || codigo === 'auth/cancelled-popup-request') return null
    if (codigo === 'auth/popup-blocked') return 'O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.'
    return 'Não foi possível entrar com o Google agora. Tente novamente em instantes.'
}

export function AuthProvider({
    children,
    servico = servicoPadrao,
}: {
    children: ReactNode
    servico?: ServicoAuth | null
}) {
    const [estado, setEstado] = useState<EstadoAuth>(servico ? 'carregando' : 'anonimo')
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        if (!servico) return
        return servico.observar((u) => {
            setUsuario(u)
            setEstado(u ? 'logado' : 'anonimo')
        })
    }, [servico])

    const entrar = useCallback(async () => {
        if (!servico) {
            setErro('O login com Google ainda não foi configurado neste ambiente.')
            return
        }
        setErro(null)
        try {
            await servico.entrarComGoogle()
        } catch (e) {
            setErro(mensagemDeErro(e))
        }
    }, [servico])

    const sair = useCallback(async () => {
        setErro(null)
        try {
            await servico?.sair()
        } catch {
            setErro('Não foi possível sair agora. Tente novamente.')
        }
    }, [servico])

    const valor = useMemo<AuthContextValue>(
        () => ({ estado, usuario, disponivel: servico !== null, erro, entrar, sair }),
        [estado, usuario, servico, erro, entrar, sair],
    )

    return <AuthContext value={valor}>{children}</AuthContext>
}
