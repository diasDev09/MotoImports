import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'

// Modal compartilhado (RF-05 e RF-06). Comportamento da v1, da Mylena:
// Esc fecha, clique no fundo fecha, a rolagem da página trava enquanto aberto.
interface ModalProps {
    aberto: boolean
    titulo: string
    aoFechar: () => void
    children: ReactNode
}

export default function Modal({ aberto, titulo, aoFechar, children }: ModalProps) {
    const idTitulo = useId()

    useEffect(() => {
        if (!aberto) return

        function aoApertarTecla(e: KeyboardEvent) {
            if (e.key === 'Escape') aoFechar()
        }
        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', aoApertarTecla)

        return () => {
            document.body.style.overflow = overflowAnterior
            document.removeEventListener('keydown', aoApertarTecla)
        }
    }, [aberto, aoFechar])

    if (!aberto) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-musgo-900/70 p-4"
            onClick={aoFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={idTitulo}
                className="max-h-full w-full max-w-2xl overflow-auto rounded-card bg-musgo-50 p-6 text-musgo-900"
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
                        className="rounded-lg px-3 py-1 text-xl hover:bg-musgo-200"
                    >
                        ×
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    )
}