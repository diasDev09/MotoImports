import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '../context/AppProvider.tsx'
import { useApp } from '../context/AppContext.ts'
import Simulador from './Simulador.tsx'

// mostra o que o simulador guardou no contexto, para o teste conferir
function Checkout() {
    const { simulacao, motoSelecionada } = useApp()
    return (
        <output data-testid="checkout">
            {motoSelecionada?.id}|{simulacao?.meses}|{simulacao?.modalidade}
        </output>
    )
}

function abrir(url = '/simulador?moto=ducati-panigale-v2') {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <AppProvider>
                <Routes>
                    <Route path="/simulador" element={<Simulador />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </AppProvider>
        </MemoryRouter>,
    )
}

const parcela = () => screen.getByTestId('parcela').textContent

describe('RF-07 · Simulador', () => {
    it('usa a moto do ?moto= da URL', () => {
        abrir('/simulador?moto=yamaha-mt-07')
        expect(screen.getByLabelText('Modelo da moto')).toHaveValue('yamaha-mt-07')
        expect(screen.getByRole('link', { name: 'Ver ficha' })).toHaveAttribute('href', '/moto/yamaha-mt-07')
    })

    it('sem parâmetro, cai na primeira moto da lista (navegação direta)', () => {
        abrir('/simulador')
        expect(screen.getByLabelText('Modelo da moto')).toHaveValue('ducati-panigale-v2')
    })

    it('trocar a moto no seletor funciona mesmo com ?moto= na URL', async () => {
        const user = userEvent.setup()
        abrir()
        await user.selectOptions(screen.getByLabelText('Modelo da moto'), 'honda-rebel-500')
        expect(screen.getByLabelText('Modelo da moto')).toHaveValue('honda-rebel-500')
        expect(screen.getByRole('link', { name: 'Ver ficha' })).toHaveAttribute('href', '/moto/honda-rebel-500')
    })

    it('mostra a parcela e muda quando o prazo muda (RN-03)', async () => {
        const user = userEvent.setup()
        abrir()
        const em48 = parcela()
        expect(screen.getByRole('button', { name: '48x', pressed: true })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: '72x' }))
        expect(parcela()).not.toBe(em48)
        expect(screen.getByText(/parcela mensal estimada \(72x\)/i)).toBeInTheDocument()
    })

    it('RN-04: financiamento aceita entrada de 20% a 80%', () => {
        abrir()
        const slider = screen.getByLabelText('Percentual de entrada')
        expect(slider).toHaveAttribute('min', '20')
        expect(slider).toHaveAttribute('max', '80')
    })

    it('RN-04: ao trocar para consórcio, os limites mudam (10–70%) e a entrada é reajustada à vista', async () => {
        const user = userEvent.setup()
        abrir()
        fireEvent.change(screen.getByLabelText('Percentual de entrada'), { target: { value: '80' } })

        await user.click(screen.getByRole('tab', { name: /consórcio/i }))
        const slider = screen.getByLabelText('Percentual de entrada')
        expect(slider).toHaveAttribute('min', '10')
        expect(slider).toHaveAttribute('max', '70')
        expect(slider).toHaveValue('70') // 80% não existe no consórcio; o slider mostra o valor real usado
        expect(screen.getByText(/mínimo 10%/i)).toBeInTheDocument()
    })

    it('consórcio não promete "zero de juros" e avisa que depende de sorteio ou lance', async () => {
        const user = userEvent.setup()
        abrir()
        await user.click(screen.getByRole('tab', { name: /consórcio/i }))
        expect(screen.queryByText(/zero de juros/i)).not.toBeInTheDocument()
        expect(screen.getByText(/sem juros, com taxa administrativa/i)).toBeInTheDocument()
        expect(screen.getByText(/sorteio ou lance/i)).toBeInTheDocument()
    })

    it('lista só acessórios compatíveis com a categoria da moto', () => {
        abrir('/simulador?moto=honda-rebel-500') // Custom
        expect(screen.getByRole('button', { name: /adicionar par de bauletos/i })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /adicionar escapamento akrapovič/i })).not.toBeInTheDocument()
    })

    it('RN-07: acessório incluído soma ao valor da operação; desmarcar tira da parcela', async () => {
        const user = userEvent.setup()
        abrir('/simulador?moto=yamaha-mt-07')
        const semAcessorio = parcela()

        await user.click(screen.getByRole('button', { name: /adicionar protetor de motor/i }))
        expect(screen.getByText('✓ No carrinho')).toBeInTheDocument()
        expect(parcela()).not.toBe(semAcessorio) // entrou na parcela

        await user.click(screen.getByLabelText(/incluir acessórios no parcelamento/i))
        expect(parcela()).toBe(semAcessorio) // saiu da parcela...
        expect(screen.getByText(/devido no ato/i)).toBeInTheDocument() // ...e passou a ser devido no ato
    })

    it('remove acessório do carrinho', async () => {
        const user = userEvent.setup()
        abrir('/simulador?moto=yamaha-mt-07')
        await user.click(screen.getByRole('button', { name: /adicionar protetor de motor/i }))
        const lista = screen.getByRole('list', { name: 'Acessórios no carrinho' })
        await user.click(within(lista).getByRole('button', { name: /remover/i }))
        expect(screen.queryByRole('list', { name: 'Acessórios no carrinho' })).not.toBeInTheDocument()
    })

    it('RF-08: "Reservar" guarda moto e simulação e vai para o checkout', async () => {
        const user = userEvent.setup()
        abrir()
        await user.click(screen.getByRole('button', { name: '24x' }))
        await user.click(screen.getByRole('button', { name: /reservar e emitir voucher/i }))
        expect(screen.getByTestId('checkout')).toHaveTextContent('ducati-panigale-v2|24|financiamento')
    })

    it('RF-06: o link do WhatsApp leva a cotação da moto e é seguro', () => {
        abrir()
        const link = screen.getByRole('link', { name: /receber esta cotação no whatsapp/i })
        expect(decodeURIComponent(link.getAttribute('href') ?? '')).toContain('Ducati Panigale V2')
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
})