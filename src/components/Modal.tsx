import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

// Modal compartilhado (RF-05 e RF-06). Comportamento da v1, da Mylena:
// Esc fecha, clique no fundo fecha, a rolagem da página trava enquanto aberto.
// Acessibilidade (WCAG 2.4.3): o foco entra no diálogo, fica preso nele (Tab) e volta ao botão de origem.
interface ModalProps {
    aberto: boolean
    titulo: string
    aoFechar: () => void
    children: ReactNode
}

export default function Modal({ aberto, titulo, aoFechar, children }: ModalProps) {
    const idTitulo = useId()
    const dialogoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!aberto) return

        const origem = document.activeElement as HTMLElement | null
        dialogoRef.current?.focus()

        function aoApertarTecla(e: KeyboardEvent) {
            if (e.key === 'Escape') aoFechar()
            if (e.key === 'Tab') prenderFoco(e)
        }

        function prenderFoco(e: KeyboardEvent) {
            const dialogo = dialogoRef.current
            if (!dialogo) return
            const focaveis = dialogo.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), textarea, select, iframe, [tabindex]:not([tabindex="-1"])',
            )
            if (focaveis.length === 0) {
                e.preventDefault()
                return
            }
            const primeiro = focaveis[0]
            const ultimo = focaveis[focaveis.length - 1]
            const atual = document.activeElement
            if (e.shiftKey && (atual === primeiro || atual === dialogo)) {
                e.preventDefault()
                ultimo.focus()
            } else if (!e.shiftKey && atual === ultimo) {
                e.preventDefault()
                primeiro.focus()
            }
        }
        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', aoApertarTecla)

        return () => {
            document.body.style.overflow = overflowAnterior
            document.removeEventListener('keydown', aoApertarTecla)
            origem?.focus()
        }
    }, [aberto, aoFechar])

    if (!aberto) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/85 p-4"
            onClick={aoFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={idTitulo}
                ref={dialogoRef}
                tabIndex={-1}
                className="folha folha-sombra max-h-full w-full max-w-2xl overflow-auto border-2 border-tinta p-6 outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <h2 id={idTitulo} className="text-2xl">
                        {titulo}
                    </h2>
                    <button
                        type="button"
                        onClick={aoFechar}
                        aria-label="Fechar"
                        className="botao-vazado size-11 shrink-0 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    )
}