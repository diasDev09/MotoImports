import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppProvider.tsx'
import { agendaSimulada } from '../domain/agenda.ts'
import { formatarDataIso } from '../domain/agendamento.ts'
import { HORARIOS } from '../data/posVenda.ts'
import PosVenda from './PosVenda.tsx'
import { ComLogin } from '../test/ComLogin.tsx'

type Usuario = ReturnType<typeof userEvent.setup>

// Só o relógio (Date) é simulado: sexta, 23/10/2026. Os timers reais continuam, então o user-event e o RHF funcionam.
const HOJE = '2026-10-23'
const DIA = '2026-10-26' // segunda-feira
const ROTULO_DIA = /26 de outubro de 2026/
const OCUPADOS = agendaSimulada(DIA)
const LIVRE = HORARIOS.find((h) => !OCUPADOS.includes(h))!

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${HOJE}T12:00:00`))
})
afterEach(() => vi.useRealTimers())

const escolherDia = (user: Usuario, rotulo = ROTULO_DIA) => user.click(screen.getByRole('button', { name: rotulo }))

function abrir() {
    return render(
        <ComLogin>
            <AppProvider>
                <MemoryRouter>
                    <PosVenda />
                </MemoryRouter>
            </AppProvider>
        </ComLogin>,
    )
}

async function preencher(user: Usuario, { consentir = true } = {}) {
    await user.click(screen.getByRole('radio', { name: /troca de óleo/i }))
    await user.type(screen.getByLabelText('Nome completo'), 'Maria Silva')
    await user.type(screen.getByLabelText('Telefone'), '81999999999')
    await user.type(screen.getByLabelText('Modelo da moto'), 'Honda CG 160, ano 2024')
    await escolherDia(user)
    await user.selectOptions(screen.getByLabelText('Horário desejado'), LIVRE)
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
        expect(within(screen.getByRole('group', { name: 'Data desejada' })).getAllByRole('grid')).toHaveLength(1)
        expect(screen.getAllByRole('option')).toHaveLength(9) // 8 horários + o texto-guia
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

    it('RF-10: dias passados ficam desabilitados e hoje está disponível', () => {
        abrir()
        expect(screen.getByRole('button', { name: /22 de outubro de 2026/ })).toBeDisabled()
        expect(screen.getByRole('button', { name: /23 de outubro de 2026/ })).toBeEnabled()
    })

    it('RF-10: o horário só libera depois de escolher o dia', async () => {
        const user = userEvent.setup()
        abrir()
        const horario = screen.getByLabelText('Horário desejado')
        expect(horario).toBeDisabled()
        await escolherDia(user)
        expect(horario).toBeEnabled()
    })

    it('RF-10: horários ocupados aparecem desabilitados e marcados', async () => {
        const user = userEvent.setup()
        abrir()
        await escolherDia(user)
        for (const h of OCUPADOS) {
            expect(screen.getByRole('option', { name: `${h} (ocupado)` })).toBeDisabled()
        }
        expect(screen.getByRole('option', { name: LIVRE })).toBeEnabled()
        expect(screen.getAllByRole('option', { name: /ocupado/ })).toHaveLength(OCUPADOS.length)
    })

    it('RF-10: trocar de dia limpa o horário escolhido', async () => {
        const user = userEvent.setup()
        abrir()
        await escolherDia(user)
        await user.selectOptions(screen.getByLabelText('Horário desejado'), LIVRE)
        await escolherDia(user, /27 de outubro de 2026/)
        expect(screen.getByLabelText('Horário desejado')).toHaveValue('')
    })

    it('RF-10: o horário recém-agendado fica ocupado para o mesmo dia', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await enviar(user)
        await user.click(await screen.findByRole('button', { name: /fazer novo agendamento/i }))

        await escolherDia(user)
        expect(screen.getByRole('option', { name: `${LIVRE} (ocupado)` })).toBeDisabled()
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
        expect(resumo).toHaveTextContent(formatarDataIso(DIA))
        expect(resumo).toHaveTextContent(LIVRE)
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