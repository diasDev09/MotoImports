import { ESTOQUE } from '../data/motos.ts'
import type { StatusEstoque } from '../data/motos.ts'

// RF-09: o status NÃO pode depender só da cor, então cada estado tem ícone + texto.
// Contrastes: papel sobre tinta 10,5:1; tinta sobre fita 5,5:1; papel sobre jeans 5,3:1.
const ESTILOS: Record<StatusEstoque, { icone: string; fundo: string }> = {
    'pronta-entrega': { icone: '✓', fundo: 'bg-tinta text-papel border-2 border-papel' },
    'em-transito': { icone: '⏱', fundo: 'bg-fita text-tinta' },
    'sob-pedido': { icone: '✈', fundo: 'bg-jeans text-papel' },
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