import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadForm from './LeadForm.tsx'

type Usuario = ReturnType<typeof userEvent.setup>

interface Dados {
    nome?: string
    email?: string
    telefone?: string
    consentir?: boolean
}

// preenche o formulário como uma pessoa faria
async function preencher(user: Usuario, { nome, email, telefone, consentir = true }: Dados) {
    if (nome) await user.type(screen.getByLabelText('Nome'), nome)
    if (email) await user.type(screen.getByLabelText('E-mail'), email)
    if (telefone) await user.type(screen.getByLabelText('Telefone com DDD'), telefone)
    if (consentir) await user.click(screen.getByLabelText(/autorizo a motoimports/i))
}

const enviar = (user: Usuario) => user.click(screen.getByRole('button', { name: 'Enviar' }))

describe('RF-01 · LeadForm', () => {
    it('mostra todos os erros ao enviar vazio e NÃO chama aoEnviar', async () => {
        const user = userEvent.setup()
        const aoEnviar = vi.fn()
        render(<LeadForm aoEnviar={aoEnviar} />)

        await enviar(user)

        const alertas = await screen.findAllByRole('alert')
        expect(alertas).toHaveLength(4) // nome, e-mail, telefone e consentimento
        expect(aoEnviar).not.toHaveBeenCalled()
    })

    it('marca o campo inválido para leitores de tela (aria-invalid + aria-describedby)', async () => {
        const user = userEvent.setup()
        render(<LeadForm aoEnviar={vi.fn()} />)
        await enviar(user)

        const email = await screen.findByLabelText('E-mail')
        expect(email).toHaveAttribute('aria-invalid', 'true')
        expect(email).toHaveAccessibleDescription(/e-mail válido/i)
    })

    it('RNF-05: bloqueia o envio sem o consentimento LGPD', async () => {
        const user = userEvent.setup()
        const aoEnviar = vi.fn()
        render(<LeadForm aoEnviar={aoEnviar} />)

        await preencher(user, {
            nome: 'Maria Silva',
            email: 'maria@exemplo.com',
            telefone: '(81) 99999-9999',
            consentir: false,
        })
        await enviar(user)

        expect(await screen.findByText(/aceite o uso dos seus dados/i)).toBeInTheDocument()
        expect(aoEnviar).not.toHaveBeenCalled()
    })

    it('envia o lead validado, com telefone só em dígitos, e mostra a confirmação', async () => {
        const user = userEvent.setup()
        const aoEnviar = vi.fn()
        render(<LeadForm aoEnviar={aoEnviar} motoInteresse={{ id: 'rebel-500', nome: 'Rebel 500' }} />)

        expect(screen.getByText('Rebel 500')).toBeInTheDocument()
        await preencher(user, {
            nome: 'Maria Silva',
            email: 'maria@exemplo.com',
            telefone: '(81) 99999-9999',
        })
        await enviar(user)

        await waitFor(() => expect(aoEnviar).toHaveBeenCalledTimes(1))
        expect(aoEnviar).toHaveBeenCalledWith(
            expect.objectContaining({
                nome: 'Maria Silva',
                email: 'maria@exemplo.com',
                telefone: '81999999999',
                consentimento: true,
                motoId: 'rebel-500',
            }),
        )
        expect(await screen.findByRole('status')).toHaveTextContent(/recebemos seu contato/i)
    })

    it('limpa os campos depois de enviar', async () => {
        const user = userEvent.setup()
        render(<LeadForm aoEnviar={vi.fn()} />)
        await preencher(user, { nome: 'Maria Silva', email: 'm@e.com', telefone: '8133334444' })
        await enviar(user)

        await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''))
        expect(screen.getByLabelText(/autorizo a motoimports/i)).not.toBeChecked()
    })
})