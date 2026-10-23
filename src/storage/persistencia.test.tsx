import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppProvider.tsx'
import { motos } from '../data/motos.ts'
import Checkout from '../pages/Checkout.tsx'
import Boutique from '../pages/Boutique.tsx'
import Contato from '../pages/Contato.tsx'
import { ComLogin } from '../test/ComLogin.tsx'
import { criarRepositorioFalso, USUARIO_TESTE } from '../test/servicoAuth.ts'
import type { Repositorio } from './Repositorio.ts'

const rebel = motos.find((m) => m.id === 'honda-rebel-500')!
type Usuario = ReturnType<typeof userEvent.setup>

function abrirCheckout(repositorio: Repositorio) {
    return render(
        <ComLogin repositorio={repositorio}>
            <MemoryRouter>
                <AppProvider inicial={{ moto: rebel }}>
                    <Checkout />
                </AppProvider>
            </MemoryRouter>
        </ComLogin>,
    )
}

async function preencherCheckout(user: Usuario) {
    await user.type(await screen.findByLabelText('Nome completo'), 'Maria Silva')
    await user.type(screen.getByLabelText('WhatsApp com DDD'), '81999999999')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Cidade'), 'Recife')
    await user.click(screen.getByLabelText(/autorizo a motoimports/i))
    await user.click(screen.getByRole('button', { name: /confirmar reserva/i }))
}

describe('Armazenamento · reserva', () => {
    it('guarda o voucher sob o uid de quem reservou e mostra o comprovante', async () => {
        const user = userEvent.setup()
        const { repositorio, salvos } = criarRepositorioFalso()
        abrirCheckout(repositorio)
        await preencherCheckout(user)

        expect(await screen.findByTestId('codigo')).toBeInTheDocument()
        expect(salvos.reservas).toHaveLength(1)
        expect(salvos.reservas[0].uid).toBe(USUARIO_TESTE.uid)
        expect(salvos.reservas[0].voucher.moto.nome).toBe('Rebel 500')
        // o código mostrado na tela é o mesmo que foi guardado
        expect(screen.getByTestId('codigo')).toHaveTextContent(salvos.reservas[0].voucher.codigo)
    })

    it('se a gravação falhar, não emite voucher, avisa e deixa tentar de novo', async () => {
        const user = userEvent.setup()
        const { repositorio, salvos } = criarRepositorioFalso({ falhar: true })
        abrirCheckout(repositorio)
        await preencherCheckout(user)

        expect(await screen.findByText(/não conseguimos guardar a sua reserva/i)).toBeInTheDocument()
        expect(screen.queryByTestId('codigo')).not.toBeInTheDocument()
        expect(salvos.reservas).toHaveLength(0)
        expect(screen.getByRole('button', { name: /confirmar reserva/i })).toBeEnabled()
    })
})

describe('Armazenamento · pedido da boutique', () => {
    async function pedir(user: Usuario) {
        await user.click(screen.getByRole('button', { name: 'Adicionar Capa de Chuva ao carrinho' }))
        await user.click(screen.getByRole('button', { name: /^carrinho/i }))
        await user.click(screen.getByRole('radio', { name: /pix/i }))
        await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    }

    it('guarda os itens, o total e a forma de pagamento', async () => {
        const user = userEvent.setup()
        const { repositorio, salvos } = criarRepositorioFalso()
        render(<ComLogin repositorio={repositorio}><Boutique /></ComLogin>)
        await pedir(user)

        expect(await screen.findByRole('status')).toHaveTextContent(/pedido de demonstração confirmado/i)
        expect(salvos.pedidos).toHaveLength(1)
        expect(salvos.pedidos[0].uid).toBe(USUARIO_TESTE.uid)
        expect(salvos.pedidos[0].pedido).toMatchObject({ total: 150, pagamento: 'pix' })
        expect(salvos.pedidos[0].pedido.itens[0]).toMatchObject({ nome: 'Capa de Chuva', quantidade: 1 })
    })

    it('se a gravação falhar, não confirma o pedido e mostra o aviso', async () => {
        const user = userEvent.setup()
        const { repositorio } = criarRepositorioFalso({ falhar: true })
        render(<ComLogin repositorio={repositorio}><Boutique /></ComLogin>)
        await pedir(user)

        expect(await screen.findByText(/não conseguimos guardar o seu pedido/i)).toBeInTheDocument()
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
})

describe('Armazenamento · contato', () => {
    async function enviarContato(user: Usuario) {
        await user.type(screen.getByLabelText('Nome'), 'João Pereira')
        await user.type(screen.getByLabelText('E-mail'), 'joao@exemplo.com')
        await user.type(screen.getByLabelText('Telefone com DDD'), '81988887777')
        await user.type(screen.getByLabelText('Cidade'), 'Olinda')
        await user.click(screen.getByLabelText(/autorizo a motoimports/i))
        await user.click(screen.getByRole('button', { name: 'Enviar' }))
    }

    it('guarda o lead, com o uid quando a pessoa está logada', async () => {
        const user = userEvent.setup()
        const { repositorio, salvos } = criarRepositorioFalso()
        render(<ComLogin repositorio={repositorio}><AppProvider><Contato /></AppProvider></ComLogin>)
        await enviarContato(user)

        expect(await screen.findByText(/recebemos seu contato/i)).toBeInTheDocument()
        expect(salvos.leads).toHaveLength(1)
        expect(salvos.leads[0].uid).toBe(USUARIO_TESTE.uid)
        expect(salvos.leads[0].lead).toMatchObject({ nome: 'João Pereira', telefone: '81988887777', consentimento: true })
    })

    it('sem login, guarda o lead sem uid', async () => {
        const user = userEvent.setup()
        const { repositorio, salvos } = criarRepositorioFalso()
        render(<ComLogin usuario={null} repositorio={repositorio}><AppProvider><Contato /></AppProvider></ComLogin>)
        await enviarContato(user)

        await screen.findByText(/recebemos seu contato/i)
        expect(salvos.leads[0].uid).toBeUndefined()
    })

    it('se a gravação falhar, a pessoa não é barrada e o erro vai ao console', async () => {
        const user = userEvent.setup()
        const erro = vi.spyOn(console, 'error').mockImplementation(() => {})
        const { repositorio } = criarRepositorioFalso({ falhar: true })
        render(<ComLogin repositorio={repositorio}><AppProvider><Contato /></AppProvider></ComLogin>)
        await enviarContato(user)

        expect(await screen.findByText(/recebemos seu contato/i)).toBeInTheDocument()
        await vi.waitFor(() => expect(erro).toHaveBeenCalled())
        erro.mockRestore()
    })
})
