import { ESTOQUE } from '../data/motos.ts'
import type { StatusEstoque } from '../data/motos.ts'

// RF-09: o status NÃO pode depender só da cor, então cada estado tem ícone + texto.
// Contrastes: Ivory sobre Navy 13,0:1; Noir sobre Mist 7,1:1; Noir sobre Ivory 14,2:1.
const ESTILOS: Record<StatusEstoque, { icone: string; fundo: string }> = {
    'pronta-entrega': { icone: '✓', fundo: 'bg-navy text-ivory' },
    'em-transito': { icone: '⏱', fundo: 'bg-mist text-noir' },
    'sob-pedido': { icone: '✈', fundo: 'border-2 border-navy bg-ivory text-noir' },
}

export default function StockBadge({ status }: { status: StatusEstoque }) {
    // status desconhecido: não quebra a tela inteira, só não mostra o selo
    if (!(status in ESTOQUE)) return null
    const { icone, fundo } = ESTILOS[status]

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold ${fundo}`}
        >
            <span aria-hidden="true">{icone}</span>
            {ESTOQUE[status].rotulo}
        </span>
    )
}