import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Boutique from './Boutique.tsx'

type Usuario = ReturnType<typeof userEvent.setup>

const abrir = () => render(<Boutique />)

const botaoCarrinho = () => screen.getByRole('button', { name: /^carrinho/i })
const abrirCarrinho = (user: Usuario) => user.click(botaoCarrinho())
const adicionar = (user: Usuario, produto: string) =>
    user.click(screen.getByRole('button', { name: `Adicionar ${produto} ao carrinho` }))

describe('Boutique · catálogo', () => {
    it('mostra os 11 produtos com preço e centavos', () => {
        abrir()
        expect(screen.getAllByRole('article')).toHaveLength(11)
        expect(screen.getByText('R$ 599,90')).toBeInTheDocument()
        expect(screen.getByText('R$ 120,00')).toBeInTheDocument()
    })

    it('busca por nome ou descrição, ignorando acento', async () => {
        const user = userEvent.setup()
        abrir()
        await user.type(screen.getByLabelText('Buscar produtos'), 'protecao')
        expect(screen.getAllByRole('article')).toHaveLength(2)
        expect(screen.getByText('Óculos para Motociclista')).toBeInTheDocument()
    })

    it('mostra mensagem quando nada é encontrado', async () => {
        const user = userEvent.setup()
        abrir()
        await user.type(screen.getByLabelText('Buscar produtos'), 'foguete')
        expect(screen.getByText(/nenhum produto encontrado/i)).toBeInTheDocument()
    })

    it('filtra por categoria e informa o botão ativo', async () => {
        const user = userEvent.setup()
        abrir()
        await user.click(screen.getByRole('button', { name: 'Vestuário' }))
        expect(screen.getByRole('button', { name: 'Vestuário', pressed: true })).toBeInTheDocument()
        expect(screen.getAllByRole('article')).toHaveLength(2)
    })

    it('filtros de estilo e certificação só aparecem em Capacetes', async () => {
        const user = userEvent.setup()
        abrir()
        expect(screen.queryByLabelText('Estilo')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Capacetes' }))
        await user.selectOptions(screen.getByLabelText('Estilo'), 'Touring')
        expect(screen.getAllByRole('article')).toHaveLength(1)
        expect(screen.getByText('Touring Premium')).toBeInTheDocument()

        await user.selectOptions(screen.getByLabelText('Estilo'), 'Todos')
        await user.selectOptions(screen.getByLabelText('Certificação'), 'Snell')
        expect(screen.getAllByRole('article')).toHaveLength(2)
    })

    it('trocar de categoria zera os filtros de capacete', async () => {
        const user = userEvent.setup()
        abrir()
        await user.click(screen.getByRole('button', { name: 'Capacetes' }))
        await user.selectOptions(screen.getByLabelText('Estilo'), 'Street')
        await user.click(screen.getByRole('button', { name: 'Vestuário' }))
        await user.click(screen.getByRole('button', { name: 'Capacetes' }))
        expect(screen.getByLabelText('Estilo')).toHaveValue('Todos')
        expect(screen.getAllByRole('article')).toHaveLength(6)
    })

    it('abre e fecha o guia de tamanhos', async () => {
        const user = userEvent.setup()
        abrir()
        await user.click(screen.getByRole('button', { name: 'Capacetes' }))
        const botao = screen.getByRole('button', { name: 'Guia de tamanhos' })
        expect(botao).toHaveAttribute('aria-expanded', 'false')

        await user.click(botao)
        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getByText(/esta tabela é apenas uma referência/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Fechar guia de tamanhos' }))
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
})

describe('Boutique · carrinho', () => {
    it('começa com zero itens e carrinho vazio', async () => {
        const user = userEvent.setup()
        abrir()
        expect(botaoCarrinho()).toHaveTextContent('0')
        await abrirCarrinho(user)
        expect(screen.getByText(/seu carrinho está vazio/i)).toBeInTheDocument()
    })

    it('capacete sem tamanho: mostra o erro no cartão e não adiciona', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Racing Pro Black')

        expect(await screen.findByRole('alert')).toHaveTextContent(/selecione o tamanho do capacete/i)
        expect(botaoCarrinho()).toHaveTextContent('0')
    })

    it('escolher o tamanho limpa o erro e permite adicionar', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Racing Pro Black')
        const cartao = screen.getByRole('heading', { name: 'Racing Pro Black' }).closest('article')!

        await user.selectOptions(within(cartao).getByLabelText('Escolha o tamanho'), 'M')
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()

        await adicionar(user, 'Racing Pro Black')
        expect(botaoCarrinho()).toHaveTextContent('1')
    })

    it('produto sem tamanho entra direto; repetir soma a quantidade', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Luvas para Motociclista')
        await adicionar(user, 'Luvas para Motociclista')
        await abrirCarrinho(user)

        expect(screen.getByText(/meu carrinho \(2 itens\)/i)).toBeInTheDocument()
        expect(screen.getByLabelText('Quantidade de Luvas para Motociclista')).toHaveTextContent('2')
        expect(screen.getByText('Total: R$ 240,00')).toBeInTheDocument()
    })

    it('o mesmo capacete em dois tamanhos vira dois itens', async () => {
        const user = userEvent.setup()
        abrir()
        const cartao = screen.getByRole('heading', { name: 'Racing Pro Black' }).closest('article')!
        const tamanho = within(cartao).getByLabelText('Escolha o tamanho')

        await user.selectOptions(tamanho, 'M')
        await adicionar(user, 'Racing Pro Black')
        await user.selectOptions(tamanho, 'G')
        await adicionar(user, 'Racing Pro Black')
        await abrirCarrinho(user)

        const itens = within(screen.getByRole('region', { name: 'Carrinho de compras' })).getAllByRole('listitem')
        expect(itens).toHaveLength(2)
        expect(itens[0]).toHaveTextContent('Tamanho: M')
        expect(itens[1]).toHaveTextContent('Tamanho: G')
    })

    it('aumenta, diminui (zero remove) e remove itens, com total certo em centavos', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Kit de Ferramentas') // R$ 95
        await adicionar(user, 'Luvas para Motociclista') // R$ 120
        await abrirCarrinho(user)

        await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Kit de Ferramentas' }))
        expect(screen.getByText('Total: R$ 310,00')).toBeInTheDocument() // 95*2 + 120

        await user.click(screen.getByRole('button', { name: 'Diminuir quantidade de Luvas para Motociclista' }))
        expect(screen.queryByText('Luvas para Motociclista', { selector: 'p' })).not.toBeInTheDocument() // zerou: saiu

        await user.click(screen.getByRole('button', { name: 'Remover Kit de Ferramentas do carrinho' }))
        expect(screen.getByText(/seu carrinho está vazio/i)).toBeInTheDocument()
    })

    it('só confirma o pedido depois de escolher a forma de pagamento', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Capa de Chuva')
        await abrirCarrinho(user)
        expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled()

        await user.click(screen.getByRole('radio', { name: /pix/i }))
        await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

        const aviso = screen.getByRole('status')
        expect(aviso).toHaveTextContent(/pedido de demonstração confirmado/i)
        expect(aviso).toHaveTextContent('Pix')
        expect(aviso).toHaveTextContent('R$ 150,00')
        expect(aviso).toHaveTextContent(/nenhum pagamento real/i)
    })

    it('mudar o carrinho depois de confirmar esconde a confirmação antiga', async () => {
        const user = userEvent.setup()
        abrir()
        await adicionar(user, 'Capa de Chuva')
        await abrirCarrinho(user)
        await user.click(screen.getByRole('radio', { name: /pix/i }))
        await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
        expect(screen.getByRole('status')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Capa de Chuva' }))
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('o botão do carrinho informa se está aberto ou fechado', async () => {
        const user = userEvent.setup()
        abrir()
        expect(botaoCarrinho()).toHaveAttribute('aria-expanded', 'false')
        await abrirCarrinho(user)
        expect(botaoCarrinho()).toHaveAttribute('aria-expanded', 'true')
    })
})