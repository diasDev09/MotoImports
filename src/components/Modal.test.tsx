import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal.tsx'

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