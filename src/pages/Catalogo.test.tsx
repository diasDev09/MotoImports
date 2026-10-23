import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Catalogo from './Catalogo.tsx'
import { motos } from '../data/motos.ts'

// renderiza a página como se o usuário tivesse aberto aquela URL
function abrir(url = '/catalogo') {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <Catalogo />
        </MemoryRouter>,
    )
}

const cartoes = () => screen.queryAllByRole('article')

describe('RF-03 · página do catálogo', () => {
    it('mostra todas as motos quando não há filtros', () => {
        abrir()
        expect(cartoes()).toHaveLength(motos.length)
        expect(screen.getByText(`${motos.length} motos encontradas`)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /limpar filtros/i })).not.toBeInTheDocument()
    })

    it('aplica a categoria que vem da URL (link da Home)', () => {
        abrir('/catalogo?categoria=Sport')
        expect(cartoes()).toHaveLength(2)
        expect(screen.getByLabelText('Categoria')).toHaveValue('Sport')
    })

    it('atualiza a lista ao escolher uma categoria, sem recarregar', async () => {
        const user = userEvent.setup()
        abrir()
        await user.selectOptions(screen.getByLabelText('Categoria'), 'Custom')
        expect(cartoes()).toHaveLength(2)
        expect(screen.getByRole('heading', { name: 'Fat Boy 114' })).toBeInTheDocument()
    })

    it('filtra pelo modo de pilotagem', async () => {
        const user = userEvent.setup()
        abrir()
        await user.selectOptions(screen.getByLabelText('Modo de pilotagem'), 'Off-Road')
        const nomes = cartoes().map((c) => c.querySelector('h3')?.textContent)
        expect(nomes).toEqual(['R 1250 GS', 'Tiger 900 Rally Pro'])
    })

    it('filtra pelo slider de cilindrada', () => {
        abrir()
        fireEvent.change(screen.getByLabelText(/cilindrada até/i), { target: { value: '500' } })
        expect(cartoes()).toHaveLength(1)
        expect(screen.getByRole('heading', { name: 'Rebel 500' })).toBeInTheDocument()
        expect(screen.getByText('1 moto encontrada')).toBeInTheDocument()
    })

    it('combina filtros e mostra "nenhum resultado" com botão de limpar', async () => {
        const user = userEvent.setup()
        abrir('/catalogo?categoria=Custom')
        await user.selectOptions(screen.getByLabelText('Modo de pilotagem'), 'Track')

        expect(cartoes()).toHaveLength(0)
        expect(screen.getByText(/nenhuma moto encontrada/i)).toBeInTheDocument()

        // há dois botões "Limpar filtros" (barra de filtros e mensagem vazia); qualquer um serve
        await user.click(screen.getAllByRole('button', { name: /limpar filtros/i })[0])
        expect(cartoes()).toHaveLength(motos.length)
    })

    it('ignora valores inválidos na URL em vez de quebrar', () => {
        abrir('/catalogo?categoria=Inexistente&modo=Foo&cc=abc')
        expect(cartoes()).toHaveLength(motos.length)
    })

    it('o slider alcança todas as motos (nenhuma fica de fora pelo limite)', () => {
        abrir('/catalogo?cc=99999')
        expect(cartoes()).toHaveLength(motos.length)
    })
})