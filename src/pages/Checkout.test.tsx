import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppProvider.tsx'
import { useApp } from '../context/AppContext.ts'
import type { Acessorio } from '../context/AppContext.ts'
import { motos } from '../data/motos.ts'
import { simularOperacao } from '../domain/financing.ts'
import type { Modalidade } from '../domain/financing.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import Checkout from './Checkout.tsx'
import { ComLogin } from '../test/ComLogin.tsx'

const rebel = motos.find((m) => m.id === 'honda-rebel-500')! // R$ 42.900, pronta entrega
const protetor: Acessorio = { id: 'ac-protetor-motor-tubular', nome: 'Protetor de motor', preco: 1000 }

interface Cena {
    moto?: boolean
    acessorios?: Acessorio[]
    modalidade?: Modalidade
    lead?: LeadRegistrado
}

function MostraLead() {
    const { lead } = useApp()
    return <output data-testid="lead">{lead ? `${lead.nome}|${lead.telefone}|${lead.motoId}` : 'nenhum'}</output>
}

// o app já começa no estado em que a pessoa estaria depois de passar pelo simulador
function abrir({ moto, acessorios, modalidade, lead }: Cena = { moto: true }) {
    return render(
        <ComLogin>
            <MemoryRouter>
                <AppProvider
                    inicial={{
                        moto: moto ? rebel : null,
                        acessorios,
                        lead,
                        simulacao: modalidade ? simularOperacao({ moto: rebel, meses: 36, modalidade }) : null,
                    }}
                >
                    <Checkout />
                    <MostraLead />
                </AppProvider>
            </MemoryRouter>
        </ComLogin>,
    )
}

async function preencher(user: ReturnType<typeof userEvent.setup>) {
    await user.type(await screen.findByLabelText('Nome completo'), 'Maria Silva')
    await user.type(screen.getByLabelText('WhatsApp com DDD'), '81999999999')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Cidade'), 'Recife')
    await user.click(screen.getByLabelText(/autorizo a motoimports/i))
}

const confirmar = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(screen.getByRole('button', { name: /confirmar reserva/i }))

describe('RF-08 · Checkout sem moto', () => {
    it('em vez de inventar uma moto, orienta a escolher uma', () => {
        abrir({})
        expect(screen.getByText(/ainda não escolheu uma moto/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /ver catálogo/i })).toHaveAttribute('href', '/catalogo')
        expect(screen.getByRole('link', { name: /ir para o simulador/i })).toHaveAttribute('href', '/simulador')
        expect(screen.queryByRole('button', { name: /confirmar reserva/i })).not.toBeInTheDocument()
    })
})

describe('RF-08 · Checkout', () => {
    it('mostra o resumo com moto, acessórios e total', async () => {
        abrir({ moto: true, acessorios: [protetor] })
        const resumo = await screen.findByRole('complementary', { name: 'Resumo do pedido' })
        expect(resumo).toHaveTextContent('Honda Rebel 500')
        expect(resumo).toHaveTextContent('Acessórios (1)')
        expect(resumo).toHaveTextContent('R$ 43.900') // 42.900 + 1.000
    })

    it('remove acessório pelo resumo e o total volta', async () => {
        const user = userEvent.setup()
        abrir({ moto: true, acessorios: [protetor] })
        await user.click(await screen.findByRole('button', { name: /remover protetor de motor/i }))
        expect(screen.getByText(/nenhum acessório adicionado/i)).toBeInTheDocument()
        expect(screen.getByRole('complementary', { name: 'Resumo do pedido' })).toHaveTextContent('R$ 42.900')
    })

    it('oferece as lojas de retirada e mostra o prazo pelo estoque da moto (RN-02)', async () => {
        abrir()
        expect(await screen.findAllByRole('radio')).toHaveLength(5)
        expect(screen.getAllByText(/48 horas úteis/i).length).toBeGreaterThan(0)
    })

    it('RN-06: avisa antes de confirmar que é reserva de demonstração', async () => {
        abrir()
        expect(await screen.findByText(/reserva de demonstração: nenhuma cobrança/i)).toBeInTheDocument()
    })

    it('enviar vazio mostra os erros e NÃO gera voucher', async () => {
        const user = userEvent.setup()
        abrir()
        await confirmar(user)

        const alertas = await screen.findAllByRole('alert')
        expect(alertas.length).toBeGreaterThanOrEqual(5) // nome, telefone, e-mail, cidade e LGPD
        expect(screen.queryByTestId('codigo')).not.toBeInTheDocument()
    })

    it('RNF-05: sem o consentimento LGPD não gera voucher', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await user.click(screen.getByLabelText(/autorizo a motoimports/i)) // desmarca
        await confirmar(user)
        expect(await screen.findByText(/concordar com os termos de privacidade/i)).toBeInTheDocument()
        expect(screen.queryByTestId('codigo')).not.toBeInTheDocument()
    })

    it('aplica a máscara no telefone', async () => {
        const user = userEvent.setup()
        abrir()
        const tel = await screen.findByLabelText('WhatsApp com DDD')
        await user.type(tel, '81999999999')
        expect(tel).toHaveValue('(81) 99999-9999')
    })

    it('fluxo completo: gera o voucher, guarda o contato e destaca que é demonstração', async () => {
        const user = userEvent.setup()
        abrir({ moto: true, acessorios: [protetor], modalidade: 'financiamento' })
        await preencher(user)
        await user.click(screen.getByRole('radio', { name: /hub curitiba/i }))
        await confirmar(user)

        expect(await screen.findByTestId('codigo')).toHaveTextContent(/^MI-\d{4}-PR-/)
        expect(screen.getByRole('alert')).toHaveTextContent(/simulação oficial/i)
        expect(screen.getByRole('alert')).toHaveTextContent(/nenhuma cobrança/i)
        expect(screen.getByText('Hub Curitiba — Batel')).toBeInTheDocument()
        expect(screen.getByText(/36x de/)).toBeInTheDocument() // plano da simulação entrou no voucher
        expect(screen.getByText('R$ 43.900')).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 1, name: /voucher de reserva/i })).toHaveFocus()

        // o contato foi para o contexto, com telefone só em dígitos e a moto de interesse
        expect(screen.getByTestId('lead')).toHaveTextContent('Maria Silva|81999999999|honda-rebel-500')
    })

    it('o plano do simulador só entra no voucher se a modalidade for a mesma', async () => {
        const user = userEvent.setup()
        abrir({ moto: true, modalidade: 'financiamento' })
        await user.click(await screen.findByRole('button', { name: 'Consórcio' }))

        expect(screen.queryByText(/plano da simulação/i)).not.toBeInTheDocument()
        expect(screen.getByRole('link', { name: /simular agora/i })).toHaveAttribute('href', '/simulador?moto=honda-rebel-500')

        await preencher(user)
        await confirmar(user)
        await screen.findByTestId('codigo')
        expect(screen.getByText('Consórcio')).toBeInTheDocument()
        expect(screen.queryByText(/36x de/)).not.toBeInTheDocument()
    })

    it('preenche os dados com o contato já informado', async () => {
        abrir({
            moto: true,
            lead: {
                nome: 'João Pereira',
                email: 'joao@exemplo.com',
                telefone: '81988887777',
                cidade: 'Olinda',
                consentimento: true,
                motoId: null,
            },
        })
        expect(screen.getByLabelText('Nome completo')).toHaveValue('João Pereira')
        expect(screen.getByLabelText('WhatsApp com DDD')).toHaveValue('(81) 98888-7777')
    })

    it('no voucher: copia o código, envia pelo WhatsApp da loja escolhida e permite nova reserva', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await confirmar(user)
        const codigo = (await screen.findByTestId('codigo')).textContent ?? ''

        await user.click(screen.getByRole('button', { name: /copiar código/i }))
        expect(await screen.findByRole('button', { name: /código copiado/i })).toBeInTheDocument()
        expect(await navigator.clipboard.readText()).toBe(codigo)

        const whats = screen.getByRole('link', { name: /whatsapp/i })
        expect(whats.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5511999887766\?text=/) // Hub Jardins (padrão)
        expect(decodeURIComponent(whats.getAttribute('href') ?? '')).toContain(codigo)
        expect(whats).toHaveAttribute('rel', expect.stringContaining('noopener'))

        await user.click(screen.getByRole('button', { name: /nova reserva/i }))
        expect(await screen.findByRole('button', { name: /confirmar reserva/i })).toBeInTheDocument()
    })

    it('o voucher mostra o titular e a validade de 7 dias', async () => {
        const user = userEvent.setup()
        abrir()
        await preencher(user)
        await confirmar(user)
        const comprovante = (await screen.findByTestId('codigo')).closest('article') as HTMLElement
        expect(within(comprovante).getByText(/maria silva/i)).toBeInTheDocument()
        expect(within(comprovante).getByText(/7 dias corridos/i)).toBeInTheDocument()
    })
})