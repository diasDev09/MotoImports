import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProposalModal from './ProposalModal.tsx'
import type { LeadRegistrado } from '../domain/lead.ts'

const lead: LeadRegistrado = {
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    telefone: '81999999999',
    cidade: 'Recife',
    consentimento: true,
    motoId: null,
}

describe('RF-06 · ProposalModal', () => {
    it('fechado, não renderiza', () => {
        render(<ProposalModal aberto={false} lead={lead} aoFechar={vi.fn()} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('mostra a mensagem com os dados do lead e da moto', () => {
        render(
            <ProposalModal
                aberto
                lead={lead}
                contexto={{ nomeMoto: 'Rebel 500', preco: 'R$ 54.900' }}
                aoFechar={vi.fn()}
            />,
        )
        const dialogo = screen.getByRole('dialog', { name: 'Sua proposta' })
        expect(dialogo).toHaveTextContent('Meu nome é Maria Silva')
        expect(dialogo).toHaveTextContent('Rebel 500')
        expect(dialogo).toHaveTextContent('(81) 99999-9999')
    })

    it('oferece WhatsApp (nova aba, seguro) e e-mail com a mensagem codificada', () => {
        render(<ProposalModal aberto lead={lead} aoFechar={vi.fn()} />)

        const whats = screen.getByRole('link', { name: /whatsapp/i })
        expect(whats.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/.*text=/)
        expect(whats).toHaveAttribute('target', '_blank')
        expect(whats).toHaveAttribute('rel', expect.stringContaining('noopener'))

        const email = screen.getByRole('link', { name: /e-mail/i })
        expect(email.getAttribute('href')).toMatch(/^mailto:\?subject=.*&body=/)
    })
})