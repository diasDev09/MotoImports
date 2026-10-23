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
        <article className="folha folha-sombra fita relative flex flex-col">
            <div className="m-4 mb-0 flex aspect-square items-center justify-center overflow-hidden border-2 border-navy bg-almond">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                    // se a imagem falhar, some o ícone quebrado e o fundo continua
                    onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                    }}
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs font-bold uppercase text-suave">
                    {produto.categoria}
                    {produto.estilo ? ` · ${produto.estilo}` : ''}
                </p>
                <h2 className="text-2xl">{produto.nome}</h2>
                <p className="text-sm">{produto.descricao}</p>

                {produto.certificacoes && (
                    <ul className="flex flex-wrap gap-2" aria-label="Certificações do modelo">
                        {produto.certificacoes.map((c) => (
                            <li key={c} className="border-2 border-linha px-2 py-0.5 text-xs font-bold">
                                {c}
                            </li>
                        ))}
                    </ul>
                )}

                {produto.tamanhos && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor={idTamanho} className="text-sm font-bold">
                            Escolha o tamanho
                        </label>
                        <select
                            id={idTamanho}
                            value={tamanho}
                            onChange={(e) => aoEscolherTamanho(e.target.value)}
                            aria-invalid={erro ? 'true' : 'false'}
                            aria-describedby={erro ? `${idTamanho}-erro` : undefined}
                            className="campo"
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

                <p className="mt-auto pt-2 font-display text-2xl font-bold">
                    {formatarPrecoComCentavos(produto.preco)}
                </p>
                <button
                    type="button"
                    onClick={aoAdicionar}
                    aria-label={`Adicionar ${produto.nome} ao carrinho`}
                    className="botao min-h-11 px-5 py-3 text-sm"
                >
                    Adicionar ao carrinho
                </button>
            </div>
        </article>
    )
}