import { ESTOQUE } from '../data/motos.ts'
import type { StatusEstoque } from '../data/motos.ts'

// RF-09: o status NÃO pode depender só da cor, então cada estado tem ícone + texto.
// Todos os fundos aceitam texto escuro (musgo-900) com contraste acima de 7:1.
const ESTILOS: Record<StatusEstoque, { icone: string; fundo: string }> = {
    'pronta-entrega': { icone: '✓', fundo: 'bg-musgo-200' },
    'em-transito': { icone: '⏱', fundo: 'bg-aviso' },
    'sob-pedido': { icone: '✈', fundo: 'bg-info' },
}

export default function StockBadge({ status }: { status: StatusEstoque }) {
    // status desconhecido: não quebra a tela inteira, só não mostra o selo
    if (!(status in ESTOQUE)) return null
    const { icone, fundo } = ESTILOS[status]

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-musgo-900 ${fundo}`}
        >
            <span aria-hidden="true">{icone}</span>
            {ESTOQUE[status].rotulo}
        </span>
    )
}