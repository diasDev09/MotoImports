import { Link, useNavigate, useParams } from 'react-router-dom'
import StockBadge from '../components/StockBadge.tsx'
import VideoTestRide from '../components/VideoTestRide.tsx'
import { useApp } from '../context/AppContext.ts'
import { motos } from '../data/motos.ts'
import type { Moto } from '../data/motos.ts'
import { PARAMETROS_PRECIFICACAO } from '../data/parametros-precificacao.ts'
import { decomporPrecoFinal } from '../domain/pricing.ts'
import type { ComposicaoPreco } from '../domain/pricing.ts'
import { formatarCilindrada, formatarPreco } from '../utils/formatters.ts'

// Página de detalhe da moto (/moto/:id). RF-02 (preço final e composição), RF-05 (vídeo),
// RF-09 (selo de estoque) e os atalhos para simular, reservar e pedir proposta.

const botaoPrimario =
    'rounded-lg bg-musgo-600 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-900'
const botaoSecundario =
    'rounded-lg border border-musgo-900 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-musgo-900 hover:bg-musgo-200'

// Se o preço for menor que os custos fixos, a decomposição lança RangeError: a ficha continua
// funcionando e só esconde o detalhamento, em vez de derrubar a página.
function comporPreco(preco: number): ComposicaoPreco | null {
    try {
        return decomporPrecoFinal(preco, PARAMETROS_PRECIFICACAO)
    } catch {
        return null
    }
}

function NaoEncontrada() {
    return (
        <section className="py-16">
            <title>Moto não encontrada | MotoImports</title>
            <div className="mx-auto max-w-site px-6">
                <h1 className="text-4xl">Moto não encontrada</h1>
                <p className="mt-3 text-musgo-600">Esse modelo não está no nosso catálogo.</p>
                <Link to="/catalogo" className={`${botaoSecundario} mt-6 inline-block`}>
                    Ver o catálogo
                </Link>
            </div>
        </section>
    )
}

function Ficha({ moto }: { moto: Moto }) {
    const navigate = useNavigate()
    const { selecionarMoto } = useApp()
    const composicao = comporPreco(moto.preco)

    // Reservar e pedir proposta usam a moto escolhida do app: guardamos e seguimos para a página.
    const irPara = (rota: string) => {
        selecionarMoto(moto)
        navigate(rota)
    }

    const linhas: [string, string][] = composicao
        ? [
            ['Preço base da moto', composicao.base],
            ['Frete internacional', composicao.frete],
            ['Despacho aduaneiro', composicao.despacho],
            ['Imposto de importação', composicao.impostoImportacao],
            ['Impostos fiscais', composicao.impostosFiscais],
        ].map(([rotulo, valor]) => [rotulo as string, formatarPreco(valor as number)])
        : []

    return (
        <article className="py-12">
            <title>{`${moto.marca} ${moto.nome} | MotoImports`}</title>
            <div className="mx-auto grid max-w-site gap-10 px-6 lg:grid-cols-2">
                <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-card bg-musgo-200">
                    {moto.imagem ? (
                        <img src={moto.imagem} alt={`${moto.marca} ${moto.nome}`} className="size-full object-cover" />
                    ) : (
                        <span aria-hidden="true" className="font-display text-9xl font-extrabold text-musgo-600">
                            {moto.cilindrada}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-musgo-600">
                            {moto.marca} · {moto.categoria}
                        </p>
                        <h1 className="mt-1 text-4xl">{moto.nome}</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <StockBadge status={moto.estoque} />
                        {moto.prazoDias && <span className="text-sm">Prazo: {moto.prazoDias}</span>}
                    </div>

                    <div>
                        <p className="font-display text-4xl font-extrabold">{formatarPreco(moto.preco)}</p>
                        <p className="text-sm text-musgo-600">Preço final, com frete e impostos incluídos.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link to={`/simulador?moto=${moto.id}`} className={botaoPrimario}>
                            Simular financiamento
                        </Link>
                        <button type="button" onClick={() => irPara('/checkout')} className={botaoSecundario}>
                            Reservar esta moto
                        </button>
                        <button type="button" onClick={() => irPara('/contato')} className={botaoSecundario}>
                            Pedir proposta
                        </button>
                        {moto.videoUrl && <VideoTestRide urlVideo={moto.videoUrl} titulo={`Test-ride da ${moto.nome}`} />}
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-12 grid max-w-site gap-10 px-6 lg:grid-cols-2">
                <section aria-labelledby="ficha-titulo">
                    <h2 id="ficha-titulo" className="text-2xl">Ficha técnica</h2>
                    <dl className="mt-4 divide-y divide-musgo-200 rounded-card border border-musgo-200 bg-white">
                        {[
                            ['Cilindrada', formatarCilindrada(moto.cilindrada)],
                            ['Potência', `${moto.potenciaCv} cv`],
                            ['Categoria', moto.categoria],
                            ['Modos de pilotagem', moto.modos.join(', ')],
                        ].map(([rotulo, valor]) => (
                            <div key={rotulo} className="flex justify-between gap-4 px-5 py-3 text-sm">
                                <dt className="text-musgo-600">{rotulo}</dt>
                                <dd className="text-right font-semibold">{valor}</dd>
                            </div>
                        ))}
                    </dl>

                    {moto.destaques.length > 0 && (
                        <>
                            <h3 className="mt-8 text-xl">Destaques</h3>
                            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                                {moto.destaques.map((d) => (
                                    <li key={d}>{d}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>

                {composicao && (
                    <section aria-labelledby="preco-titulo">
                        <h2 id="preco-titulo" className="text-2xl">Como chegamos ao preço</h2>
                        <p className="mt-2 text-sm">
                            Sem taxas adicionais na entrega: o valor acima já inclui tudo o que aparece abaixo.
                        </p>
                        <details className="mt-4 rounded-card border border-musgo-200 bg-white p-5">
                            <summary className="cursor-pointer text-sm font-semibold">Ver composição do preço</summary>
                            <dl className="mt-4 divide-y divide-musgo-200">
                                {linhas.map(([rotulo, valor]) => (
                                    <div key={rotulo} className="flex justify-between gap-4 py-2 text-sm">
                                        <dt>{rotulo}</dt>
                                        <dd className="font-semibold">{valor}</dd>
                                    </div>
                                ))}
                                <div className="flex justify-between gap-4 py-2 text-sm font-bold">
                                    <dt>Total</dt>
                                    <dd>{formatarPreco(composicao.total)}</dd>
                                </div>
                            </dl>
                            <p className="mt-3 text-xs text-musgo-600">
                                Divisão estimada com as alíquotas de referência da loja; o total é o preço final.
                            </p>
                        </details>
                    </section>
                )}
            </div>
        </article>
    )
}

export default function MotoDetalhe() {
    const { id } = useParams()
    const moto = motos.find((m) => m.id === id)
    return moto ? <Ficha moto={moto} /> : <NaoEncontrada />
}