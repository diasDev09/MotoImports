import type { ProdutoBoutique } from '../../data/boutique.ts'
import { formatarPrecoComCentavos } from '../../utils/formatters.ts'

interface CartaoProdutoProps {
    produto: ProdutoBoutique
    tamanho: string
    erro?: string
    aoEscolherTamanho: (tamanho: string) => void
    aoAdicionar: () => void
}

export default function CartaoProduto({ produto, tamanho, erro, aoEscolherTamanho, aoAdicionar }: CartaoProdutoProps) {
    const idTamanho = `tamanho-${produto.id}`

    return (
        <article className="flex flex-col overflow-hidden rounded-card border border-musgo-200 bg-white">
            <div className="flex h-56 items-center justify-center bg-musgo-200 p-3">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    loading="lazy"
                    className="size-full object-contain"
                    // se a imagem externa falhar, some o ícone quebrado e o fundo continua
                    onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                    }}
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs font-bold uppercase text-musgo-600">
                    {produto.categoria}
                    {produto.estilo ? ` · ${produto.estilo}` : ''}
                </p>
                <h2 className="text-xl">{produto.nome}</h2>
                <p className="text-sm">{produto.descricao}</p>

                {produto.certificacoes && (
                    <ul className="flex flex-wrap gap-2" aria-label="Certificações do modelo">
                        {produto.certificacoes.map((c) => (
                            <li key={c} className="rounded bg-musgo-200 px-2 py-0.5 text-xs font-semibold">
                                {c}
                            </li>
                        ))}
                    </ul>
                )}

                {produto.tamanhos && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor={idTamanho} className="text-sm font-semibold">
                            Escolha o tamanho
                        </label>
                        <select
                            id={idTamanho}
                            value={tamanho}
                            onChange={(e) => aoEscolherTamanho(e.target.value)}
                            aria-invalid={erro ? 'true' : 'false'}
                            aria-describedby={erro ? `${idTamanho}-erro` : undefined}
                            className="rounded-lg border border-musgo-400 bg-white px-3 py-2"
                        >
                            <option value="">Selecione um tamanho</option>
                            {produto.tamanhos.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {erro && (
                            <p id={`${idTamanho}-erro`} role="alert" className="text-sm font-medium text-erro">
                                {erro}
                            </p>
                        )}
                    </div>
                )}

                <p className="mt-auto pt-2 font-display text-2xl font-extrabold">
                    {formatarPrecoComCentavos(produto.preco)}
                </p>
                <button
                    type="button"
                    onClick={aoAdicionar}
                    aria-label={`Adicionar ${produto.nome} ao carrinho`}
                    className="rounded-lg bg-musgo-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600"
                >
                    Adicionar ao carrinho
                </button>
            </div>
        </article>
    )
}