import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CartaoDestaque from './CartaoDestaque.tsx'
import { motos } from '../data/motos.ts'

const mt07 = motos.find((m) => m.id === 'yamaha-mt-07')!

function mostrar(moto = mt07) {
    return render(
        <MemoryRouter>
            <CartaoDestaque moto={moto} />
        </MemoryRouter>,
    )
}

describe('CartaoDestaque (vitrine)', () => {
    it('mostra nome, marca, ficha técnica e preço final', () => {
        mostrar()
        expect(screen.getByRole('heading', { level: 3, name: 'MT-07' })).toBeInTheDocument()
        expect(screen.getByText(/Yamaha · Naked/)).toBeInTheDocument()
        expect(screen.getByText(/689 cc · 73 cv/)).toBeInTheDocument()
        expect(screen.getByText(/54\.900/)).toBeInTheDocument()
        expect(screen.getByText('com frete e impostos')).toBeInTheDocument()
    })

    it('mostra o selo de estoque da moto (RF-09)', () => {
        mostrar()
        expect(screen.getByText('Pronta entrega')).toBeInTheDocument()
    })

    it('o link leva para a página de detalhes da moto', () => {
        mostrar()
        expect(screen.getByRole('link', { name: /ver detalhes/i })).toHaveAttribute('href', '/moto/yamaha-mt-07')
    })

    it('sem imagem, mostra a cilindrada grande e nenhuma <img>', () => {
        const { container } = mostrar()
        expect(container.querySelector('img')).not.toBeInTheDocument()
        expect(screen.getByText('689', { selector: 'span[aria-hidden="true"]' })).toBeInTheDocument()
    })

    it('com imagem, mostra a foto com texto alternativo', () => {
        mostrar({ ...mt07, imagem: '/img/mt07.jpg' })
        expect(screen.getByRole('img', { name: 'Yamaha MT-07' })).toHaveAttribute('src', '/img/mt07.jpg')
    })
})
