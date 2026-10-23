import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from '../context/AppProvider.tsx'
import { useApp } from '../context/AppContext.ts'
import { motos } from '../data/motos.ts'
import { formatarPreco } from '../utils/formatters.ts'
import MotoDetalhe from './MotoDetalhe.tsx'

// toLocaleString usa espaço não separável entre "R$" e o valor; aqui comparamos ignorando a diferença.
const semNbsp = (texto: string | null) => (texto ?? '').replace(/\s/g, ' ')

const moto = motos.find((m) => m.id === 'yamaha-mt-07')!

function Destino() {
    const { pathname, search } = useLocation()
    const { motoSelecionada } = useApp()
    return <p>destino {pathname}{search} / {motoSelecionada?.id ?? 'nenhuma'}</p>
}

function abrir(id: string) {
    return render(
        <AppProvider>
            <MemoryRouter initialEntries={[`/moto/${id}`]}>
                <Routes>
                    <Route path="/moto/:id" element={<MotoDetalhe />} />
                    <Route path="*" element={<Destino />} />
                </Routes>
            </MemoryRouter>
        </AppProvider>,
    )
}

describe('Detalhe da moto', () => {
    it('mostra nome, preço final, selo de estoque e ficha técnica', () => {
        abrir(moto.id)
        expect(screen.getByRole('heading', { level: 1, name: moto.nome })).toBeInTheDocument()
        expect(screen.getByText((_, el) => el?.tagName === 'P' && semNbsp(el.textContent) === semNbsp(formatarPreco(moto.preco)))).toBeInTheDocument()
        expect(screen.getByText(/com frete e impostos incluídos/i)).toBeInTheDocument()
        const ficha = screen.getByRole('region', { name: 'Ficha técnica' })
        expect(within(ficha).getByText(`${moto.potenciaCv} cv`)).toBeInTheDocument()
        for (const d of moto.destaques) expect(within(ficha).getByText(d)).toBeInTheDocument()
    })

    it('RF-02: a composição soma o preço final e informa que não há taxas adicionais', async () => {
        const user = userEvent.setup()
        abrir(moto.id)
        const secao = screen.getByRole('region', { name: /como chegamos ao preço/i })
        expect(within(secao).getByText(/sem taxas adicionais/i)).toBeInTheDocument()
        await user.click(within(secao).getByText(/ver composição do preço/i))
        for (const item of ['Preço base da moto', 'Frete internacional', 'Despacho aduaneiro', 'Imposto de importação', 'Impostos fiscais']) {
            expect(within(secao).getByText(item)).toBeInTheDocument()
        }
        expect(semNbsp(within(secao).getByText('Total').nextElementSibling!.textContent)).toBe(semNbsp(formatarPreco(moto.preco)))
    })

    it('"Simular" leva ao simulador com a moto na URL', async () => {
        const user = userEvent.setup()
        abrir(moto.id)
        await user.click(screen.getByRole('link', { name: /simular financiamento/i }))
        expect(screen.getByText(`destino /simulador?moto=${moto.id} / nenhuma`)).toBeInTheDocument()
    })

    it('"Reservar" seleciona a moto e abre o checkout', async () => {
        const user = userEvent.setup()
        abrir(moto.id)
        await user.click(screen.getByRole('button', { name: /reservar esta moto/i }))
        expect(screen.getByText(`destino /checkout / ${moto.id}`)).toBeInTheDocument()
    })

    it('"Pedir proposta" seleciona a moto e abre o contato', async () => {
        const user = userEvent.setup()
        abrir(moto.id)
        await user.click(screen.getByRole('button', { name: /pedir proposta/i }))
        expect(screen.getByText(`destino /contato / ${moto.id}`)).toBeInTheDocument()
    })

    it('RF-05: sem vídeo cadastrado, não mostra o botão de test-ride', () => {
        abrir(moto.id)
        expect(moto.videoUrl).toBe('')
        expect(screen.queryByRole('button', { name: /ver test-ride/i })).not.toBeInTheDocument()
    })

    it('RNF-10: define o título da aba com o nome da moto', () => {
        abrir(moto.id)
        expect(document.title).toBe(`${moto.marca} ${moto.nome} | MotoImports`)
    })

    it('moto inexistente mostra aviso e link para o catálogo', () => {
        abrir('nao-existe')
        expect(screen.getByRole('heading', { level: 1, name: /moto não encontrada/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /ver o catálogo/i })).toHaveAttribute('href', '/catalogo')
    })
})