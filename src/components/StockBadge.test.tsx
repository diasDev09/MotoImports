import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StockBadge from './StockBadge.tsx'
import type { StatusEstoque } from '../data/motos.ts'

describe('RF-09 · StockBadge', () => {
    it.each([
        ['pronta-entrega', 'Pronta entrega'],
        ['em-transito', 'Em trânsito aduaneiro (15 a 30 dias)'],
        ['sob-pedido', 'Importação sob pedido'],
    ] as const)('mostra o texto do estado %s', (status, texto) => {
        render(<StockBadge status={status} />)
        expect(screen.getByText(texto)).toBeInTheDocument()
    })

    it('tem um ícone decorativo além da cor e do texto', () => {
        const { container } = render(<StockBadge status="pronta-entrega" />)
        const icone = container.querySelector('[aria-hidden="true"]')
        expect(icone).toBeInTheDocument()
        expect(icone?.textContent).not.toBe('')
    })

    it('cada estado tem um ícone diferente (não depende só da cor)', () => {
        const status: StatusEstoque[] = ['pronta-entrega', 'em-transito', 'sob-pedido']
        const icones = status.map((s) => {
            const { container, unmount } = render(<StockBadge status={s} />)
            const texto = container.querySelector('[aria-hidden="true"]')?.textContent
            unmount()
            return texto
        })
        expect(new Set(icones).size).toBe(3)
    })

    it('não renderiza nada para um status desconhecido', () => {
        const { container } = render(<StockBadge status={'inexistente' as StatusEstoque} />)
        expect(container).toBeEmptyDOMElement()
    })
})