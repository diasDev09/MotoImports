import type { ReactNode } from 'react'
import { useAuth } from './AuthContext.ts'

// Mostra o conteúdo só para quem está logado; os demais veem um convite para entrar com o Google.
// "motivo" completa a frase: "Entre com a sua conta Google para <motivo>."
// Com "pagina", o convite ocupa a página inteira (rota protegida) e usa o título principal h1.
export default function ExigeLogin({
    motivo,
    children,
    pagina = false,
}: {
    motivo: string
    children: ReactNode
    pagina?: boolean
}) {
    const { estado, disponivel, erro, entrar } = useAuth()

    if (estado === 'logado') return <>{children}</>

    if (estado === 'carregando') {
        return (
            <p role="status" className={pagina ? 'mx-auto max-w-site px-6 py-12 text-suave' : 'py-6 text-suave'}>
                Verificando seu login…
            </p>
        )
    }

    const Titulo = pagina ? 'h1' : 'h2'
    const convite = (
        <div className="folha folha-sombra fita my-8 max-w-xl p-6">
            <Titulo className="text-3xl">Entre para continuar</Titulo>
            <p className="mt-2">Entre com a sua conta Google para {motivo}. É rápido e não cria senha nova.</p>

            {!disponivel && (
                <p className="mt-3 bg-fita p-3 text-sm text-tinta">
                    O login ainda não foi configurado neste ambiente (faltam as variáveis do Firebase).
                </p>
            )}
            {erro && (
                <p role="alert" className="mt-3 text-sm font-bold text-erro">
                    {erro}
                </p>
            )}

            <button
                type="button"
                onClick={() => void entrar()}
                disabled={!disponivel}
                className="botao mt-5 min-h-11 px-6 py-3 text-sm"
            >
                Entrar com Google
            </button>
        </div>
    )

    return pagina ? (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">{convite}</div>
        </section>
    ) : (
        convite
    )
}
