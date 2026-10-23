import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home.tsx'

function abrir(url = '/') {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <Home />
        </MemoryRouter>,
    )
}

describe('Home', () => {
    it('tem um único h1 com a promessa da loja', () => {
        abrir()
        const titulos = screen.getAllByRole('heading', { level: 1 })
        expect(titulos).toHaveLength(1)
        expect(titulos[0]).toHaveTextContent('Sua próxima moto já chega com tudo pago.')
    })

    it('leva ao catálogo e ao simulador pelos botões do hero', () => {
        abrir()
        expect(screen.getByRole('link', { name: 'Ver as motos' })).toHaveAttribute('href', '/catalogo')
        expect(screen.getByRole('link', { name: 'Simular parcelas' })).toHaveAttribute('href', '/simulador')
    })

    it('mostra as 4 vantagens da loja', () => {
        abrir()
        const lista = within(screen.getByRole('region', { name: 'Vantagens da loja' })).getAllByRole('listitem')
        expect(lista).toHaveLength(4)
    })

    it('mostra a vitrine com 4 motos em destaque', () => {
        abrir()
        const vitrine = screen.getByRole('region', { name: /motos em destaque/i })
        expect(within(vitrine).getAllByRole('article')).toHaveLength(4)
        expect(within(vitrine).getByRole('heading', { name: 'Panigale V2' })).toBeInTheDocument()
    })

    it('os estilos de pilotagem levam ao catálogo já filtrado', () => {
        abrir()
        expect(screen.getByRole('link', { name: /^Sport/ })).toHaveAttribute('href', '/catalogo?categoria=Sport')
        // a barra de "Trail/Adventure" precisa ser codificada na URL
        expect(screen.getByRole('link', { name: /^Trail\/Adventure/ })).toHaveAttribute(
            'href',
            '/catalogo?categoria=Trail%2FAdventure',
        )
    })

    it('tem os 4 passos numerados em lista ordenada', () => {
        abrir()
        const passos = screen.getByRole('region', { name: /do clique à garagem/i })
        expect(within(passos).getAllByRole('listitem')).toHaveLength(4)
    })

    it('a seção "Sobre nós" existe com o id usado pela âncora do menu', () => {
        const { container } = abrir()
        expect(container.querySelector('#sobre')).toBeInTheDocument()
    })

    it('rola até a seção quando a URL tem #sobre', () => {
        const rolar = vi.fn()
        Element.prototype.scrollIntoView = rolar
        abrir('/#sobre')
        expect(rolar).toHaveBeenCalledTimes(1)
    })

    it('a chamada final leva ao formulário de contato', () => {
        abrir()
        expect(screen.getByRole('link', { name: 'Quero uma proposta' })).toHaveAttribute('href', '/contato')
    })
})