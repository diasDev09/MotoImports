import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '../context/AppProvider.tsx'
import { useApp } from '../context/AppContext.ts'
import Contato from './Contato.tsx'

// componente auxiliar só para o teste: mostra o lead guardado no contexto
function MostraLead() {
    const { lead } = useApp()
    return <output data-testid="lead">{lead ? lead.nome : 'nenhum'}</output>
}

describe('página de contato', () => {
    it('guarda o lead no contexto do app ao enviar (RF-01)', async () => {
        const user = userEvent.setup()
        render(
            <AppProvider>
                <Contato />
                <MostraLead />
            </AppProvider>,
        )
        expect(screen.getByTestId('lead')).toHaveTextContent('nenhum')

        await user.type(screen.getByLabelText('Nome'), 'João Pereira')
        await user.type(screen.getByLabelText('E-mail'), 'joao@exemplo.com')
        await user.type(screen.getByLabelText('Telefone com DDD'), '81988887777')
        await user.type(screen.getByLabelText('Cidade'), 'Olinda')
        await user.click(screen.getByLabelText(/autorizo a motoimports/i))
        await user.click(screen.getByRole('button', { name: 'Enviar' }))

        expect(await screen.findByText(/recebemos seu contato/i)).toBeInTheDocument()
        expect(screen.getByTestId('lead')).toHaveTextContent('João Pereira')
    })

    it('RF-06: depois do envio, oferece "Receber proposta" e abre o modal com os dados', async () => {
        const user = userEvent.setup()
        render(
            <AppProvider>
                <Contato />
            </AppProvider>,
        )
        expect(screen.queryByRole('button', { name: /receber proposta/i })).not.toBeInTheDocument()

        await user.type(screen.getByLabelText('Nome'), 'João Pereira')
        await user.type(screen.getByLabelText('E-mail'), 'joao@exemplo.com')
        await user.type(screen.getByLabelText('Telefone com DDD'), '81988887777')
        await user.type(screen.getByLabelText('Cidade'), 'Olinda')
        await user.click(screen.getByLabelText(/autorizo a motoimports/i))
        await user.click(screen.getByRole('button', { name: 'Enviar' }))

        await user.click(await screen.findByRole('button', { name: /receber proposta/i }))
        const dialogo = screen.getByRole('dialog', { name: 'Sua proposta' })
        expect(dialogo).toHaveTextContent('João Pereira')
        expect(dialogo).toHaveTextContent('Olinda')
    })

    it('RF-05: sem moto selecionada, não mostra o botão de vídeo', () => {
        render(
            <AppProvider>
                <Contato />
            </AppProvider>,
        )
        expect(screen.queryByRole('button', { name: /ver test-ride/i })).not.toBeInTheDocument()
    })
})