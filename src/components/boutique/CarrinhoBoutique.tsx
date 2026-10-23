import ExigeLogin from '../../auth/ExigeLogin.tsx'
import { FORMAS_PAGAMENTO_BOUTIQUE } from '../../data/boutique.ts'
import type { FormaPagamentoBoutique } from '../../data/boutique.ts'
import { subtotal, totalItens, valorTotal } from '../../domain/boutique.ts'
import type { ItemCarrinho } from '../../domain/boutique.ts'
import { formatarPrecoComCentavos } from '../../utils/formatters.ts'

interface CarrinhoBoutiqueProps {
    itens: readonly ItemCarrinho[]
    pagamento: FormaPagamentoBoutique | ''
    pedidoFinalizado: boolean
    aoAlterarQuantidade: (chave: string, variacao: number) => void
    aoRemover: (chave: string) => void
    aoEscolherPagamento: (forma: FormaPagamentoBoutique) => void
    aoConfirmar: () => void
    salvando?: boolean
    erroPedido?: string | null
}

const botaoQuantidade = 'botao-vazado size-11 text-lg'

export default function CarrinhoBoutique({
    itens,
    pagamento,
    pedidoFinalizado,
    aoAlterarQuantidade,
    aoRemover,
    aoEscolherPagamento,
    aoConfirmar,
    salvando = false,
    erroPedido = null,
}: CarrinhoBoutiqueProps) {
    const quantidade = totalItens(itens)
    const total = valorTotal(itens)
    const forma = FORMAS_PAGAMENTO_BOUTIQUE.find((f) => f.valor === pagamento)

    return (
        <section id="carrinho-boutique" className="mb-8 folha folha-sombra p-6" aria-label="Carrinho de compras">
            <h2 className="text-3xl">Meu carrinho ({quantidade} {quantidade === 1 ? 'item' : 'itens'})</h2>

            {itens.length === 0 ? (
                <p className="mt-3 text-suave">Seu carrinho está vazio. Adicione um produto para começar.</p>
            ) : (
                <>
                    <ul className="mt-4 divide-y divide-linha">
                        {itens.map((item) => (
                            <li key={item.chave} className="flex flex-wrap items-center justify-between gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.produto.imagem} alt="" className="size-16 border-2 border-navy bg-almond object-cover" />
                                    <div className="text-sm">
                                        <p className="font-bold">{item.produto.nome}</p>
                                        {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
                                        <p>{formatarPrecoComCentavos(item.produto.preco)} por unidade</p>
                                        <p>Subtotal: {formatarPrecoComCentavos(subtotal(item))}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button type="button" className={botaoQuantidade} aria-label={`Diminuir quantidade de ${item.produto.nome}`} onClick={() => aoAlterarQuantidade(item.chave, -1)}>
                                        −
                                    </button>
                                    <strong aria-label={`Quantidade de ${item.produto.nome}`}>{item.quantidade}</strong>
                                    <button type="button" className={botaoQuantidade} aria-label={`Aumentar quantidade de ${item.produto.nome}`} onClick={() => aoAlterarQuantidade(item.chave, 1)}>
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => aoRemover(item.chave)}
                                        aria-label={`Remover ${item.produto.nome} do carrinho`}
                                        className="min-h-11 border-2 border-erro px-3 text-sm font-bold text-erro hover:bg-erro hover:text-fundo"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="my-4 text-right text-2xl font-bold">Total: {formatarPrecoComCentavos(total)}</p>

                    <fieldset className="border-t-2 border-linha pt-5">
                        <legend className="text-xl font-bold">Escolha a forma de pagamento</legend>
                        <div className="my-4 grid gap-3 sm:grid-cols-2">
                            {FORMAS_PAGAMENTO_BOUTIQUE.map((f) => (
                                <label
                                    key={f.valor}
                                    className={`flex cursor-pointer items-start gap-3 p-4 text-sm ${pagamento === f.valor ? 'opcao-card-marcada' : 'opcao'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="formaPagamento"
                                        value={f.valor}
                                        checked={pagamento === f.valor}
                                        onChange={() => aoEscolherPagamento(f.valor)}
                                        className="mt-1 accent-fg"
                                    />
                                    <span>
                                        <strong className="block">{f.nome}</strong>
                                        <small>{f.descricao}</small>
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* só quem entrou com o Google confirma o pedido */}
                        <ExigeLogin motivo="confirmar o seu pedido">
                            <button
                                type="button"
                                disabled={!pagamento || salvando}
                                onClick={aoConfirmar}
                                className="botao min-h-11 w-full px-6 py-3 text-sm"
                            >
                                {salvando ? 'Guardando o pedido…' : 'Confirmar pedido'}
                            </button>
                            {erroPedido && (
                                <p role="alert" className="mt-3 text-sm font-bold text-erro">
                                    {erroPedido}
                                </p>
                            )}
                        </ExigeLogin>
                    </fieldset>

                    {pedidoFinalizado && forma && (
                        <p role="status" className="mt-4 bg-mist p-4 text-sm text-noir">
                            Pedido de demonstração confirmado! Forma de pagamento: <strong>{forma.nome}</strong>. Total:{' '}
                            {formatarPrecoComCentavos(total)}. Nenhum pagamento real foi realizado.
                        </p>
                    )}
                </>
            )}
        </section>
    )
}