import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import NotaPreco from './NotaPreco.tsx'
import { motos } from '../data/motos.ts'
import type { Moto } from '../data/motos.ts'

const mt07 = motos.find((m) => m.id === 'yamaha-mt-07') as Moto

// o toLocaleString põe um espaço não separável entre "R$" e o número
const semNbsp = (t: string | null) => (t ?? '').replace(/ /g, ' ')

describe('NotaPreco', () => {
    it('mostra a composição do preço final e fecha no total', () => {
        render(<NotaPreco moto={mt07} />)
        const nota = screen.getByRole('figure', { name: /nota de preço/i })
        expect(within(nota).getByText('Frete internacional')).toBeInTheDocument()
        expect(within(nota).getByText('Imposto de importação')).toBeInTheDocument()
        const total = within(nota).getByText('Total').nextElementSibling
        expect(semNbsp(total?.textContent ?? null)).toBe('R$ 54.900,00')
    })

    it('declara a taxa surpresa zerada e leva o carimbo', () => {
        render(<NotaPreco moto={mt07} />)
        const taxa = screen.getByText('Taxa surpresa').nextElementSibling
        expect(semNbsp(taxa?.textContent ?? null)).toBe('R$ 0,00')
        expect(screen.getByText('Sem taxa surpresa')).toBeInTheDocument()
    })

    it('não aparece quando o preço é menor que os custos fixos', () => {
        const { container } = render(<NotaPreco moto={{ ...mt07, preco: 1000 }} />)
        expect(container).toBeEmptyDOMElement()
    })
})
