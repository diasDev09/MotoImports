import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'
import { ComLogin } from './test/ComLogin.tsx'
import { criarServicoFalso } from './test/servicoAuth.ts'
import { AuthProvider } from './auth/AuthProvider.tsx'

function abrir(url: string) {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <ComLogin>
                <AppProvider>
                    <App />
                </AppProvider>
            </ComLogin>
        </MemoryRouter>,
    )
}

describe('layout e rotas', () => {
    it('mostra a página de cada rota', () => {
        abrir('/catalogo')
        expect(screen.getByRole('heading', { level: 1, name: 'Catálogo' })).toBeInTheDocument()
    })

    it('a rota /moto/:id mostra a ficha da moto', () => {
        abrir('/moto/yamaha-mt-07')
        expect(screen.getByRole('heading', { level: 1, name: 'MT-07' })).toBeInTheDocument()
    })

    it('a rota /pos-venda mostra o pós-venda', () => {
        abrir('/pos-venda')
        expect(screen.getByRole('heading', { level: 1, name: /cuidado com sua moto/i })).toBeInTheDocument()
    })

    it('a rota /boutique mostra a boutique', () => {
        abrir('/boutique')
        expect(screen.getByRole('heading', { level: 1, name: /boutique moto imports/i })).toBeInTheDocument()
    })

    it('mostra "não encontrada" para rota desconhecida', () => {
        abrir('/rota-que-nao-existe')
        expect(screen.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeInTheDocument()
    })

    it('tem navegação principal, conteúdo e rodapé', () => {
        abrir('/')
        expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
        expect(document.getElementById('conteudo')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('o link do menu leva para a página (navegação sem recarregar)', async () => {
        const user = userEvent.setup()
        abrir('/')
        // o mesmo texto existe no rodapé; por isso a busca fica dentro da navegação principal
        const menu = screen.getByRole('navigation', { name: 'Principal' })
        await user.click(within(menu).getByRole('link', { name: 'Simulador' }))
        expect(screen.getByRole('heading', { level: 1, name: /simulador de financiamento e consórcio/i })).toBeInTheDocument()
    })
})

describe('Navbar (menu no celular)', () => {
    it('abre e fecha o menu, informando o estado para leitores de tela', async () => {
        const user = userEvent.setup()
        abrir('/')
        const botao = screen.getByRole('button', { name: 'Menu' })
        expect(botao).toHaveAttribute('aria-expanded', 'false')

        await user.click(botao)
        expect(screen.getByRole('button', { name: 'Fechar' })).toHaveAttribute('aria-expanded', 'true')

        await user.click(screen.getByRole('button', { name: 'Fechar' }))
        expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    })

    it('tem o link "Ir para o conteúdo" para quem usa teclado', () => {
        abrir('/')
        expect(screen.getByRole('link', { name: 'Ir para o conteúdo' })).toHaveAttribute('href', '#conteudo')
    })

    it('RF-11: o link Reserva mostra quantos acessórios já estão na reserva', async () => {
        const user = userEvent.setup()
        abrir('/simulador?moto=yamaha-mt-07')
        const menu = screen.getByRole('navigation', { name: 'Principal' })
        expect(within(menu).getByRole('link', { name: 'Reserva' })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /adicionar protetor de motor/i }))
        expect(within(menu).getByRole('link', { name: 'Reserva, 1 acessório' })).toBeInTheDocument()
    })

    it('"Sobre nós" aponta para a âncora da Home', () => {
        abrir('/')
        const links = screen.getAllByRole('link', { name: 'Sobre nós' })
        links.forEach((l) => expect(l).toHaveAttribute('href', '/#sobre'))
    })
})

describe('login com Google', () => {
    function abrirComoVisitante(url: string) {
        const { servico } = criarServicoFalso(null)
        return render(
            <MemoryRouter initialEntries={[url]}>
                <AuthProvider servico={servico}>
                    <AppProvider>
                        <App />
                    </AppProvider>
                </AuthProvider>
            </MemoryRouter>,
        )
    }

    it('o checkout pede login de quem não entrou', () => {
        abrirComoVisitante('/checkout')
        expect(screen.getByRole('heading', { level: 1, name: /entre para continuar/i })).toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: /reserva e retirada/i })).not.toBeInTheDocument()
    })

    it('o checkout abre normal para quem está logado', () => {
        abrir('/checkout')
        expect(screen.getByRole('heading', { level: 1, name: /reserva e retirada/i })).toBeInTheDocument()
    })

    it('o menu mostra "Entrar" para visitante e o nome com "Sair" para quem entrou', async () => {
        const user = userEvent.setup()
        abrirComoVisitante('/')
        const menu = screen.getByRole('navigation', { name: 'Principal' })
        await user.click(within(menu).getByRole('button', { name: 'Entrar' }))
        expect(await within(menu).findByText(/olá, maria/i)).toBeInTheDocument()
        expect(within(menu).getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    })
})
