import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ContaGiros from './ContaGiros.tsx'

describe('ContaGiros (hero)', () => {
    it('tem texto alternativo que explica a imagem', () => {
        render(<ContaGiros />)
        expect(screen.getByRole('img', { name: /zero taxas surpresa/i })).toBeInTheDocument()
    })

    it('mostra o valor "R$ 0" e as 13 marcações (0 a 12)', () => {
        render(<ContaGiros />)
        expect(screen.getByText('R$ 0')).toBeInTheDocument()
        expect(screen.getAllByText(/^\d{1,2}$/)).toHaveLength(13)
    })

    it('a agulha começa em 0 e sobe até o valor final', async () => {
        render(<ContaGiros />)
        const agulha = screen.getByTestId('agulha')
        // posição final: 150 + (9,5 / 12) * 240 = 340 graus
        await waitFor(() => expect(agulha.style.transform).toBe('rotate(340deg)'))
    })
})