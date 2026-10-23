import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VideoTestRide from './VideoTestRide.tsx'

const URL_VIDEO = 'https://www.youtube-nocookie.com/embed/abc123'

describe('RF-05 · VideoTestRide', () => {
    it('começa fechado, sem carregar o player', () => {
        render(<VideoTestRide urlVideo={URL_VIDEO} />)
        expect(screen.getByRole('button', { name: /ver test-ride/i })).toBeInTheDocument()
        expect(screen.queryByTitle('Test-ride em vídeo')).not.toBeInTheDocument()
    })

    it('abre o modal com o vídeo no iframe', async () => {
        const user = userEvent.setup()
        render(<VideoTestRide urlVideo={URL_VIDEO} titulo="Test-ride da Rebel 500" />)
        await user.click(screen.getByRole('button', { name: /ver test-ride/i }))

        expect(screen.getByRole('dialog', { name: 'Test-ride da Rebel 500' })).toBeInTheDocument()
        expect(screen.getByTitle('Test-ride da Rebel 500')).toHaveAttribute('src', URL_VIDEO)
    })

    it('ao fechar, remove o iframe (o vídeo para)', async () => {
        const user = userEvent.setup()
        render(<VideoTestRide urlVideo={URL_VIDEO} />)
        await user.click(screen.getByRole('button', { name: /ver test-ride/i }))
        await user.keyboard('{Escape}')

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.queryByTitle('Test-ride em vídeo')).not.toBeInTheDocument()
    })
})