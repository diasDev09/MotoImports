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
}

const botaoQuantidade = 'size-8 rounded-lg border border-musgo-400 bg-white text-lg hover:bg-musgo-200'

export default function CarrinhoBoutique({
    itens,
    pagamento,
    pedidoFinalizado,
    aoAlterarQuantidade,
    aoRemover,
    aoEscolherPagamento,
    aoConfirmar,
}: CarrinhoBoutiqueProps) {
    const quantidade = totalItens(itens)
    const total = valorTotal(itens)
    const forma = FORMAS_PAGAMENTO_BOUTIQUE.find((f) => f.valor === pagamento)

    return (
        <section id="carrinho-boutique" className="mb-8 rounded-card border border-musgo-200 bg-white p-6" aria-label="Carrinho de compras">
            <h2 className="text-2xl">Meu carrinho ({quantidade} {quantidade === 1 ? 'item' : 'itens'})</h2>

            {itens.length === 0 ? (
                <p className="mt-3 text-musgo-600">Seu carrinho está vazio. Adicione um produto para começar.</p>
            ) : (
                <>
                    <ul className="mt-4 divide-y divide-musgo-200">
                        {itens.map((item) => (
                            <li key={item.chave} className="flex flex-wrap items-center justify-between gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.produto.imagem} alt="" className="size-16 rounded-lg bg-musgo-200 object-contain" />
                                    <div className="text-sm">
                                        <p className="font-semibold">{item.produto.nome}</p>
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
                                        className="rounded-lg border border-erro px-3 py-1 text-sm text-erro hover:bg-erro-fundo"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="my-4 text-right text-2xl font-extrabold">Total: {formatarPrecoComCentavos(total)}</p>

                    <fieldset className="border-t border-musgo-200 pt-5">
                        <legend className="text-lg font-bold">Escolha a forma de pagamento</legend>
                        <div className="my-4 grid gap-3 sm:grid-cols-2">
                            {FORMAS_PAGAMENTO_BOUTIQUE.map((f) => (
                                <label
                                    key={f.valor}
                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm ${pagamento === f.valor ? 'border-musgo-900 bg-musgo-50' : 'border-musgo-200 hover:bg-musgo-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="formaPagamento"
                                        value={f.valor}
                                        checked={pagamento === f.valor}
                                        onChange={() => aoEscolherPagamento(f.valor)}
                                        className="mt-1 accent-musgo-600"
                                    />
                                    <span>
                                        <strong className="block">{f.nome}</strong>
                                        <small>{f.descricao}</small>
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={!pagamento}
                            onClick={aoConfirmar}
                            className="w-full rounded-lg bg-musgo-900 px-6 py-3 font-semibold text-white hover:bg-musgo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Confirmar pedido
                        </button>
                    </fieldset>

                    {pedidoFinalizado && forma && (
                        <p role="status" className="mt-4 rounded-lg border border-musgo-400 bg-musgo-200 p-4 text-sm">
                            Pedido de demonstração confirmado! Forma de pagamento: <strong>{forma.nome}</strong>. Total:{' '}
                            {formatarPrecoComCentavos(total)}. Nenhum pagamento real foi realizado.
                        </p>
                    )}
                </>
            )}
        </section>
    )
}