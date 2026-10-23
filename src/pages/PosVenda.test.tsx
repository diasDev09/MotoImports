import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { dataIsoLocal, formatarDataIso } from '../domain/agendamento.ts'
import PosVenda from './PosVenda.tsx'

type Usuario = ReturnType<typeof userEvent.setup>

const dia = (diferenca: number) => dataIsoLocal(new Date(Date.now() + diferenca * 24 * 60 * 60 * 1000))
const AMANHA = dia(2) // 2 dias à frente: nunca cai em "hoje" por causa de fuso ou horário

function abrir() {
    return render(
        <MemoryRouter>
            <PosVenda />
        </MemoryRouter>,
    )
}

async function preencher(user: Usuario, { consentir = true } = {}) {
    await user.click(screen.getByRole('radio', { name: /troca de óleo/i }))
    await user.type(screen.getByLabelText('Nome completo'), 'Maria Silva')
    await user.type(screen.getByLabelText('Telefone'), '81999999999')
    await user.type(screen.getByLabelText('Modelo da moto'), 'Honda CG 160, ano 2024')
    fireEvent.change(screen.getByLabelText('Data desejada'), { target: { value: AMANHA } })
    await user.selectOptions(screen.getByLabelText('Horário desejado'), '09:00')
    await user.type(screen.getByLabelText(/observações/i), 'Barulho no motor')
    if (consentir) await user.click(screen.getByLabelText(/autorizo a motoimports/i))
}

const enviar = (user: Usuario) => user.click(screen.getByRole('button', { name: /solicitar agendamento/i }))

describe('Pós-venda · agendamento', () => {
    it('mostra o título, os 4 serviços e os 8 horários', () => {
        abrir()
        expect(screen.getByRole('heading', { level: 1, name: /cuidado com sua moto/i })).toBeInTheDocument()
        expect(screen.getAllByRole('radio')).toHaveLength(4)
        expect(screen.getByRole('option', { name: '08:00' })).toBeInTheDocument()
        expect(screen.getAllByRole('option')).toHaveLength(9) // 8 horários + "Selecione"
    })

    it('tem link para a boutique', () => {
        abrir()
        expect(screen.getByRole('link', { name: /boutique/i })).toHaveAttribute('href', '/boutique')
    })

    it('enviar vazio mostra todos os erros e não confirma', async () => {
        const user = userEvent.setup()
        abrir()
        await enviar(user)

        expect(await screen.findAllByRole('alert')).toHaveLength(7) // serviço, nome, telefone, moto, data, horário e LGPD
        expect(screen.getByText('Selecione o serviço desejado.')).toBeInTheDocument()
        expect(screen.queryByText(/aguarde a confirmação/i)).not.toBeInTheDocument()
    })

    it('não aceita data no passado', async () => {
        const user = userEvent.setup()
        abrir()
        fireEvent.change(screen.getByLabelText('Data desejada'), { target: { value: dia(-3) } })
        await enviar(user)
        expect(await screen.findByText('Escolha uma data de hoje em diante.')).toBeInTheDocument()
        expect(screen.getByLabelText('Data desejada')).toHaveAttribute('min', dataIsoLocal())
    })

    it('marca o campo inválido para leitores de tela', async () => {
        const user = userEvent.setup()
        abrir()
        await enviar(user)
        const nome = await screen.findByLabelText('Nome completo')
        expect(nome).toHaveAttribute('aria-invalid', 'true')
        expect(nome).toHaveAccessibleDescription(/informe seu nome completo/i)
    })

    it('RNF-05: sem consentimento não confirma', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user, { consentir: false })
        await enviar(user)
        expect(await screen.findByText(/aceite o uso dos seus dados/i)).toBeInTheDocument()
        expect(screen.queryByText(/aguarde a confirmação/i)).not.toBeInTheDocument()
    })

    it('aplica a máscara no telefone', async () => {
        const user = userEvent.setup()
        abrir()
        const telefone = screen.getByLabelText('Telefone')
        await user.type(telefone, '81999999999')
        expect(telefone).toHaveValue('(81) 99999-9999')
    })

    it('confirma o pedido e mostra o resumo, dizendo que depende da oficina', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await enviar(user)

        const resumo = (await screen.findByRole('heading', { name: /aguarde a confirmação/i })).closest('section')!
        expect(resumo).toHaveTextContent('Maria Silva')
        expect(resumo).toHaveTextContent('(81) 99999-9999')
        expect(resumo).toHaveTextContent('Troca de óleo')
        expect(resumo).toHaveTextContent(formatarDataIso(AMANHA))
        expect(resumo).toHaveTextContent('09:00')
        expect(resumo).toHaveTextContent('Barulho no motor')
        expect(resumo).toHaveTextContent(/depende da confirmação da oficina/i)
    })

    it('mexer em qualquer campo esconde o resumo anterior', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await enviar(user)
        await screen.findByRole('heading', { name: /aguarde a confirmação/i })

        await user.type(screen.getByLabelText('Nome completo'), ' Souza')
        expect(screen.queryByRole('heading', { name: /aguarde a confirmação/i })).not.toBeInTheDocument()
    })

    it('"Fazer novo agendamento" limpa o formulário', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await enviar(user)
        await user.click(await screen.findByRole('button', { name: /fazer novo agendamento/i }))

        expect(screen.queryByRole('heading', { name: /aguarde a confirmação/i })).not.toBeInTheDocument()
        expect(screen.getByLabelText('Nome completo')).toHaveValue('')
        expect(screen.getByLabelText(/autorizo a motoimports/i)).not.toBeChecked()
    })
})