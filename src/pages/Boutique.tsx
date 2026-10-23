import { useAuth } from '../auth/AuthContext.ts'
import { useRepositorio } from '../storage/Repositorio.ts'
import { montarPedidoBoutique } from '../storage/documentos.ts'
import { useState } from 'react'
import CartaoProduto from '../components/boutique/CartaoProduto.tsx'
import CarrinhoBoutique from '../components/boutique/CarrinhoBoutique.tsx'
import GuiaTamanhos from '../components/boutique/GuiaTamanhos.tsx'
import {
    CATEGORIAS_BOUTIQUE,
    CERTIFICACOES,
    ESTILOS_CAPACETE,
    PRODUTOS_BOUTIQUE,
} from '../data/boutique.ts'
import type { FormaPagamentoBoutique, ProdutoBoutique } from '../data/boutique.ts'
import {
    FILTROS_INICIAIS,
    adicionarAoCarrinho,
    alterarQuantidade,
    exigeTamanho,
    filtrarProdutos,
    removerItem,
    totalItens,
} from '../domain/boutique.ts'
import type { Filtros, ItemCarrinho } from '../domain/boutique.ts'

// Boutique: equipamentos e acessórios do piloto (porte da v1, da Ariely).
// Este carrinho é só da boutique, separado dos acessórios da moto (reserva). O pedido é de demonstração.

const selectFiltro = 'campo text-sm'

export default function Boutique() {
    const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)
    const [tamanhos, setTamanhos] = useState<Record<number, string>>({})
    const [errosTamanho, setErrosTamanho] = useState<Record<number, string | undefined>>({})
    const [guiaAberto, setGuiaAberto] = useState(false)
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)
    const [pagamento, setPagamento] = useState<FormaPagamentoBoutique | ''>('')
    const [pedidoFinalizado, setPedidoFinalizado] = useState(false)
    const [salvandoPedido, setSalvandoPedido] = useState(false)
    const [erroPedido, setErroPedido] = useState<string | null>(null)
    const { usuario } = useAuth()
    const repositorio = useRepositorio()

    const produtos = filtrarProdutos(PRODUTOS_BOUTIQUE, filtros)
    const quantidade = totalItens(carrinho)
    const emCapacetes = filtros.categoria === 'Capacetes'

    // qualquer mudança no carrinho invalida a confirmação anterior
    function atualizarCarrinho(novo: ItemCarrinho[]) {
        setCarrinho(novo)
        setPedidoFinalizado(false)
    }

    // o pedido só fica "confirmado" depois de guardado; se falhar, o carrinho continua como está
    async function confirmarPedido() {
        if (carrinho.length === 0 || !pagamento || salvandoPedido) return
        if (repositorio && usuario) {
            setSalvandoPedido(true)
            setErroPedido(null)
            try {
                await repositorio.salvarPedidoBoutique(usuario.uid, montarPedidoBoutique(carrinho, pagamento))
            } catch {
                setErroPedido('Não conseguimos guardar o seu pedido agora. Confira a conexão e tente de novo.')
                setSalvandoPedido(false)
                return
            }
            setSalvandoPedido(false)
        }
        setPedidoFinalizado(true)
    }

    function adicionar(produto: ProdutoBoutique) {
        const tamanho = tamanhos[produto.id] ?? ''
        if (exigeTamanho(produto) && !tamanho) {
            setErrosTamanho((anterior) => ({
                ...anterior,
                [produto.id]: 'Selecione o tamanho do capacete antes de adicionar ao carrinho.',
            }))
            return
        }
        setErrosTamanho((anterior) => ({ ...anterior, [produto.id]: undefined }))
        atualizarCarrinho(adicionarAoCarrinho(carrinho, produto, tamanho))
    }

    function trocarCategoria(categoria: Filtros['categoria']) {
        // ao trocar de categoria, os filtros de capacete voltam ao início
        setFiltros((f) => ({ ...f, categoria, estilo: 'Todos', certificacao: 'Todas' }))
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">
                <header className="folha folha-sombra fita flex flex-wrap items-center justify-between gap-4 p-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl">Boutique Moto Imports</h1>
                        <p className="mt-2">Equipamentos, acessórios e proteção para você e sua motocicleta.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCarrinhoAberto((aberto) => !aberto)}
                        aria-expanded={carrinhoAberto}
                        aria-controls="carrinho-boutique"
                        className="botao-vazado flex min-h-11 items-center gap-2 px-5 py-3"
                    >
                        Carrinho
                        <span className="bg-sangue px-2 py-0.5 text-xs font-bold text-papel">{quantidade}</span>
                        <span className="sr-only">{quantidade === 1 ? 'item' : 'itens'} no carrinho</span>
                    </button>
                </header>

                <div className="mt-8">
                    {carrinhoAberto && (
                        <CarrinhoBoutique
                            itens={carrinho}
                            pagamento={pagamento}
                            pedidoFinalizado={pedidoFinalizado}
                            aoAlterarQuantidade={(chave, variacao) => atualizarCarrinho(alterarQuantidade(carrinho, chave, variacao))}
                            aoRemover={(chave) => atualizarCarrinho(removerItem(carrinho, chave))}
                            aoEscolherPagamento={(forma) => {
                                setPagamento(forma)
                                setPedidoFinalizado(false)
                            }}
                            aoConfirmar={() => void confirmarPedido()}
                            salvando={salvandoPedido}
                            erroPedido={erroPedido}
                        />
                    )}

                    <input
                        type="search"
                        placeholder="Buscar produto..."
                        aria-label="Buscar produtos"
                        value={filtros.busca}
                        onChange={(e) => setFiltros((f) => ({ ...f, busca: e.target.value }))}
                        className="campo w-full"
                    />

                    <nav className="my-5 flex flex-wrap gap-2" aria-label="Categorias de produtos">
                        {(['Todos', ...CATEGORIAS_BOUTIQUE] as const).map((categoria) => (
                            <button
                                key={categoria}
                                type="button"
                                aria-pressed={filtros.categoria === categoria}
                                onClick={() => trocarCategoria(categoria)}
                                className={`min-h-11 px-4 py-2 text-sm font-bold ${filtros.categoria === categoria ? 'opcao-marcada' : 'opcao'}`}
                            >
                                {categoria}
                            </button>
                        ))}
                    </nav>

                    {emCapacetes && (
                        <>
                            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 folha folha-sombra p-4">
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex flex-col gap-1 text-sm font-bold">
                                        Estilo
                                        <select
                                            className={selectFiltro}
                                            value={filtros.estilo}
                                            onChange={(e) => setFiltros((f) => ({ ...f, estilo: e.target.value as Filtros['estilo'] }))}
                                        >
                                            <option value="Todos">Todos</option>
                                            {ESTILOS_CAPACETE.map((e) => (
                                                <option key={e} value={e}>{e}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1 text-sm font-bold">
                                        Certificação
                                        <select
                                            className={selectFiltro}
                                            value={filtros.certificacao}
                                            onChange={(e) => setFiltros((f) => ({ ...f, certificacao: e.target.value as Filtros['certificacao'] }))}
                                        >
                                            <option value="Todas">Todas</option>
                                            {CERTIFICACOES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    aria-expanded={guiaAberto}
                                    onClick={() => setGuiaAberto((aberto) => !aberto)}
                                    className="botao-vazado min-h-11 px-4 py-2 text-sm"
                                >
                                    {guiaAberto ? 'Fechar guia de tamanhos' : 'Guia de tamanhos'}
                                </button>
                            </div>
                            {guiaAberto && <GuiaTamanhos />}
                        </>
                    )}

                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Lista de produtos">
                        {produtos.length > 0 ? (
                            produtos.map((produto) => (
                                <CartaoProduto
                                    key={produto.id}
                                    produto={produto}
                                    tamanho={tamanhos[produto.id] ?? ''}
                                    erro={errosTamanho[produto.id]}
                                    aoEscolherTamanho={(t) => {
                                        setTamanhos((anterior) => ({ ...anterior, [produto.id]: t }))
                                        setErrosTamanho((anterior) => ({ ...anterior, [produto.id]: undefined }))
                                    }}
                                    aoAdicionar={() => adicionar(produto)}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-suave">Nenhum produto encontrado com esses filtros.</p>
                        )}
                    </section>
                </div>
            </div>
        </section>
    )
}