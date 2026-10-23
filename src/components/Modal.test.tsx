import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal.tsx'

function ComBotao() {
    const [aberto, setAberto] = useState(false)
    return (
        <>
            <button onClick={() => setAberto(true)}>Abrir</button>
            <Modal aberto={aberto} titulo="T" aoFechar={() => setAberto(false)}>
                <button>Primeiro</button>
                <button>Último</button>
            </Modal>
        </>
    )
}

describe('Modal · foco (acessibilidade)', () => {
    it('ao abrir, o foco vai para o diálogo', async () => {
        const user = userEvent.setup()
        render(<ComBotao />)
        await user.click(screen.getByRole('button', { name: 'Abrir' }))
        expect(screen.getByRole('dialog')).toHaveFocus()
    })

    it('Tab fica preso dentro do diálogo (volta do último para o primeiro)', async () => {
        const user = userEvent.setup()
        render(<ComBotao />)
        await user.click(screen.getByRole('button', { name: 'Abrir' }))

        screen.getByRole('button', { name: 'Último' }).focus()
        await user.tab()
        expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    })

    it('Shift+Tab no primeiro item vai para o último', async () => {
        const user = userEvent.setup()
        render(<ComBotao />)
        await user.click(screen.getByRole('button', { name: 'Abrir' }))

        screen.getByRole('button', { name: 'Fechar' }).focus()
        await user.tab({ shift: true })
        expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus()
    })

    it('ao fechar, o foco volta ao botão que abriu', async () => {
        const user = userEvent.setup()
        render(<ComBotao />)
        const abrir = screen.getByRole('button', { name: 'Abrir' })
        await user.click(abrir)
        await user.keyboard('{Escape}')
        expect(abrir).toHaveFocus()
    })
})

describe('Modal', () => {
    it('fechado, não renderiza nada', () => {
        render(<Modal aberto={false} titulo="Título" aoFechar={vi.fn()}>conteúdo</Modal>)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('aberto, é um diálogo modal nomeado pelo título', () => {
        render(<Modal aberto titulo="Meu título" aoFechar={vi.fn()}>conteúdo</Modal>)
        const dialogo = screen.getByRole('dialog', { name: 'Meu título' })
        expect(dialogo).toHaveAttribute('aria-modal', 'true')
        expect(dialogo).toHaveTextContent('conteúdo')
    })

    it('fecha com Esc, com o botão Fechar e clicando no fundo', async () => {
        const user = userEvent.setup()
        const aoFechar = vi.fn()
        const { container } = render(<Modal aberto titulo="T" aoFechar={aoFechar}>x</Modal>)

        await user.keyboard('{Escape}')
        expect(aoFechar).toHaveBeenCalledTimes(1)

        await user.click(screen.getByRole('button', { name: 'Fechar' }))
        expect(aoFechar).toHaveBeenCalledTimes(2)

        await user.click(container.firstElementChild as HTMLElement) // fundo
        expect(aoFechar).toHaveBeenCalledTimes(3)
    })

    it('clicar dentro do diálogo NÃO fecha', async () => {
        const user = userEvent.setup()
        const aoFechar = vi.fn()
        render(<Modal aberto titulo="T" aoFechar={aoFechar}>texto interno</Modal>)
        await user.click(screen.getByText('texto interno'))
        expect(aoFechar).not.toHaveBeenCalled()
    })

    it('trava a rolagem da página enquanto aberto e devolve ao fechar', () => {
        document.body.style.overflow = 'auto'
        const { rerender } = render(<Modal aberto titulo="T" aoFechar={vi.fn()}>x</Modal>)
        expect(document.body.style.overflow).toBe('hidden')

        rerender(<Modal aberto={false} titulo="T" aoFechar={vi.fn()}>x</Modal>)
        expect(document.body.style.overflow).toBe('auto')
    })
})