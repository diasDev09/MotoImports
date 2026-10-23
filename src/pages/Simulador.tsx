import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.ts'
import { motos } from '../data/motos.ts'
import { ACESSORIOS_TECNICOS } from '../data/acessorios.ts'
import { CONTATO_COMERCIAL } from '../data/contato.ts'
import { PARAMETROS_FINANCEIROS, simularOperacao } from '../domain/financing.ts'
import type { Modalidade } from '../domain/financing.ts'
import { montarUrlWhatsApp } from '../domain/proposal.ts'
import { formatarPreco } from '../utils/formatters.ts'

// RF-07: simulador de financiamento e consórcio (porte da v1, do Santos).
// Regras de cálculo ficam em domain/financing.ts; aqui só tem tela.

const cartao = 'rounded-card border border-musgo-200 bg-white p-5'
const titulo = 'mb-3 text-lg font-bold'
const botaoMini =
    'rounded-lg border border-musgo-600 px-3 py-1 text-sm font-semibold hover:bg-musgo-200'

const MODALIDADES: { id: Modalidade; nome: string; selo: string }[] = [
    { id: 'financiamento', nome: 'Financiamento bancário', selo: 'Liberação após análise cadastral' },
    { id: 'consorcio', nome: 'Consórcio', selo: 'Sem juros, com taxa administrativa' },
]

export default function Simulador() {
    const navigate = useNavigate()
    const [params, setParams] = useSearchParams()
    const { motoSelecionada, selecionarMoto, acessorios, adicionarAcessorio, removerAcessorio, salvarSimulacao } =
        useApp()

    const [modalidade, setModalidade] = useState<Modalidade>('financiamento')
    const [meses, setMeses] = useState(48)
    const [incluirAcessorios, setIncluirAcessorios] = useState(true)
    const [percentualEscolhido, setPercentualEscolhido] = useState(30)

    // a moto vem do ?moto= da URL, depois da moto escolhida no app, depois da primeira da lista
    const motoAtiva = motos.find((m) => m.id === params.get('moto')) ?? motoSelecionada ?? motos[0]

    // RN-04: os limites da entrada mudam conforme a modalidade (financiamento 20–80%, consórcio 10–70%)
    const regras = PARAMETROS_FINANCEIROS[modalidade]
    const minimo = Math.round(regras.entradaMinimaPercentual * 100)
    const maximo = Math.round(regras.entradaMaximaPercentual * 100)
    const percentual = Math.min(Math.max(percentualEscolhido, minimo), maximo)

    const simulacao = simularOperacao({
        moto: motoAtiva,
        acessorios,
        incluirAcessoriosNoFinanciamento: incluirAcessorios,
        modalidade,
        meses,
        percentualEntrada: percentual,
    })
    const { resultadoAtivo } = simulacao

    const acessoriosCompativeis = ACESSORIOS_TECNICOS.filter((a) => a.compatibilidade.includes(motoAtiva.categoria))

    function trocarMoto(id: string) {
        const nova = motos.find((m) => m.id === id)
        if (!nova) return
        selecionarMoto(nova)
        setParams({ moto: id }, { replace: true })
    }

    function irParaCheckout() {
        selecionarMoto(motoAtiva)
        salvarSimulacao(simulacao)
        navigate('/checkout')
    }

    const mensagem =
        `Olá MotoImports! Gostaria de uma cotação para a ${motoAtiva.marca} ${motoAtiva.nome}.\n` +
        `• Modalidade: ${resultadoAtivo.nomeModalidade}\n` +
        `• Entrada: ${formatarPreco(simulacao.entrada)} (${simulacao.percentualEntrada}%)\n` +
        `• Plano: ${simulacao.meses}x de ${formatarPreco(resultadoAtivo.parcelaMensal)}` +
        (acessorios.length > 0 ? ` com ${acessorios.length} acessório(s)` : '') +
        `\n• Valor da operação: ${formatarPreco(simulacao.valorTotalOperacao)}\n` +
        'Simulação indicativa. Podem validar as condições e a disponibilidade?'

    return (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">
                <header className="max-w-2xl">
                    <h1 className="text-4xl">Simulador de financiamento e consórcio</h1>
                    <p className="mt-3 text-musgo-600">
                        Compare o crédito bancário com o consórcio, de 12x a 72x, ajuste a entrada e some acessórios à
                        conta.
                    </p>
                </header>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="flex flex-col gap-6">
                        <section className={cartao} aria-labelledby="sim-moto">
                            <h2 id="sim-moto" className={titulo}>1. Moto</h2>
                            <label htmlFor="moto" className="sr-only">Modelo da moto</label>
                            <select
                                id="moto"
                                value={motoAtiva.id}
                                onChange={(e) => trocarMoto(e.target.value)}
                                className="w-full rounded-lg border border-musgo-400 bg-white px-3 py-2"
                            >
                                {motos.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.marca} {m.nome} · {formatarPreco(m.preco)} ({m.categoria})
                                    </option>
                                ))}
                            </select>
                            <div className="mt-3 flex items-center gap-4">
                                {motoAtiva.imagem && (
                                    <img src={motoAtiva.imagem} alt="" className="h-14 w-20 rounded-lg object-cover" />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold">{motoAtiva.marca} {motoAtiva.nome}</p>
                                    <p className="text-sm text-musgo-600">{formatarPreco(motoAtiva.preco)}</p>
                                </div>
                                <Link to={`/moto/${motoAtiva.id}`} className={botaoMini}>Ver ficha</Link>
                            </div>
                        </section>

                        <section className={cartao} aria-labelledby="sim-modalidade">
                            <h2 id="sim-modalidade" className={titulo}>2. Modalidade</h2>
                            <div role="tablist" aria-label="Modalidade de pagamento" className="grid gap-3 sm:grid-cols-2">
                                {MODALIDADES.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={modalidade === m.id}
                                        onClick={() => setModalidade(m.id)}
                                        className={`flex flex-col rounded-lg border px-4 py-3 text-left ${modalidade === m.id
                                                ? 'border-musgo-900 bg-musgo-900 text-white'
                                                : 'border-musgo-400 hover:bg-musgo-200'
                                            }`}
                                    >
                                        <span className="font-semibold">{m.nome}</span>
                                        <span className="text-xs">{m.selo}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={cartao} aria-labelledby="sim-entrada">
                            <div className="flex items-baseline justify-between gap-4">
                                <h2 id="sim-entrada" className={titulo}>
                                    3. {modalidade === 'consorcio' ? 'Lance ou entrada' : 'Entrada'}
                                </h2>
                                <p className="font-bold">
                                    {formatarPreco(simulacao.entrada)} <span className="text-sm font-normal">({simulacao.percentualEntrada}%)</span>
                                </p>
                            </div>
                            <label htmlFor="entrada" className="sr-only">Percentual de entrada</label>
                            <input
                                id="entrada"
                                type="range"
                                min={minimo}
                                max={maximo}
                                step={5}
                                value={percentual}
                                onChange={(e) => setPercentualEscolhido(Number(e.target.value))}
                                className="w-full accent-musgo-600"
                            />
                            <p className="mt-1 flex justify-between text-sm text-musgo-600">
                                <span>Mínimo {minimo}% ({formatarPreco(simulacao.entradaMinima)})</span>
                                <span>Máximo {maximo}% ({formatarPreco(simulacao.entradaMaxima)})</span>
                            </p>
                        </section>

                        <section className={cartao} aria-labelledby="sim-prazo">
                            <h2 id="sim-prazo" className={titulo}>4. Prazo</h2>
                            <div className="flex flex-wrap gap-2">
                                {regras.prazosDisponiveis.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        aria-pressed={meses === p}
                                        onClick={() => setMeses(p)}
                                        className={`rounded-lg border px-4 py-2 text-sm font-semibold ${meses === p ? 'border-musgo-900 bg-musgo-900 text-white' : 'border-musgo-400 hover:bg-musgo-200'
                                            }`}
                                    >
                                        {p}x
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={cartao} aria-labelledby="sim-acessorios">
                            <h2 id="sim-acessorios" className={titulo}>
                                5. Acessórios <span className="text-sm font-normal text-musgo-600">({acessorios.length} no carrinho)</span>
                            </h2>

                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={incluirAcessorios}
                                    onChange={(e) => setIncluirAcessorios(e.target.checked)}
                                    className="mt-1 size-4 accent-musgo-600"
                                />
                                <span>
                                    <strong>Incluir acessórios no parcelamento</strong>
                                    <br />
                                    Dilui o valor dos acessórios nas parcelas. Desmarcado, eles são pagos no ato.
                                </span>
                            </label>

                            {acessorios.length > 0 && (
                                <ul className="mt-4 flex flex-col gap-2" aria-label="Acessórios no carrinho">
                                    {acessorios.map((item) => (
                                        <li key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-musgo-50 px-3 py-2 text-sm">
                                            <span>{item.nome}</span>
                                            <span className="flex items-center gap-3">
                                                <strong>{formatarPreco(item.preco)}</strong>
                                                <button
                                                    type="button"
                                                    aria-label={`Remover ${item.nome}`}
                                                    onClick={() => removerAcessorio(item.id)}
                                                    className={botaoMini}
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="mt-4 text-sm text-musgo-600">Acessórios compatíveis com {motoAtiva.categoria}:</p>
                            <ul className="mt-2 flex flex-col gap-2">
                                {acessoriosCompativeis.map((ac) => {
                                    const noCarrinho = acessorios.some((a) => a.id === ac.id)
                                    return (
                                        <li key={ac.id} className="flex items-center justify-between gap-3 rounded-lg border border-musgo-200 px-3 py-2 text-sm">
                                            <span>
                                                {ac.nome}
                                                <span className="block text-xs text-musgo-600">{ac.categoria} · {formatarPreco(ac.preco)}</span>
                                            </span>
                                            {noCarrinho ? (
                                                <span className="text-xs font-semibold text-musgo-600">✓ No carrinho</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    aria-label={`Adicionar ${ac.nome}`}
                                                    onClick={() => adicionarAcessorio(ac)}
                                                    className={botaoMini}
                                                >
                                                    + Adicionar
                                                </button>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    </div>

                    <aside className="h-fit rounded-card bg-musgo-900 p-6 text-white lg:sticky lg:top-24" aria-label="Resultado da simulação">
                        <p className="text-sm">Parcela mensal estimada ({simulacao.meses}x)</p>
                        <p className="font-display text-4xl font-extrabold" data-testid="parcela">
                            {formatarPreco(resultadoAtivo.parcelaMensal)}
                        </p>
                        <p className="text-sm">{resultadoAtivo.nomeModalidade}</p>

                        <dl className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-t border-white/30 pt-4 text-sm">
                            <dt>Preço da moto</dt>
                            <dd className="font-semibold">{formatarPreco(simulacao.precoMoto)}</dd>
                            {simulacao.totalAcessorios > 0 && (
                                <>
                                    <dt>Acessórios ({acessorios.length})</dt>
                                    <dd className="font-semibold">{formatarPreco(simulacao.totalAcessorios)}</dd>
                                </>
                            )}
                            <dt>Valor da operação</dt>
                            <dd className="font-semibold">{formatarPreco(simulacao.valorTotalOperacao)}</dd>
                            <dt>Entrada ({simulacao.percentualEntrada}%)</dt>
                            <dd className="font-semibold">{formatarPreco(simulacao.entrada)}</dd>
                            <dt>Saldo a pagar em parcelas</dt>
                            <dd className="font-semibold">{formatarPreco(simulacao.saldoDevedor)}</dd>
                            {simulacao.valorDevidoNoAto > simulacao.entrada && (
                                <>
                                    <dt>Devido no ato (entrada + acessórios)</dt>
                                    <dd className="font-semibold">{formatarPreco(simulacao.valorDevidoNoAto)}</dd>
                                </>
                            )}
                            <dt>Custo</dt>
                            <dd>{resultadoAtivo.tipoCusto}</dd>
                            <dt>Liberação</dt>
                            <dd>{resultadoAtivo.prazoEntrega}</dd>
                        </dl>

                        {modalidade === 'consorcio' && simulacao.economiaConsorcio > 0 && (
                            <p className="mt-4 rounded-lg bg-musgo-600 p-3 text-sm">
                                Pelas premissas desta simulação, o consórcio custa cerca de{' '}
                                <strong>{formatarPreco(simulacao.economiaConsorcio)}</strong> a menos no total que o
                                financiamento. A contemplação depende de sorteio ou lance.
                            </p>
                        )}
                        {modalidade === 'financiamento' && (
                            <p className="mt-4 rounded-lg bg-musgo-600 p-3 text-sm">
                                Aprovado o cadastro, a moto é faturada sem esperar sorteio mensal.
                            </p>
                        )}

                        <div className="mt-5 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={irParaCheckout}
                                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-musgo-900 hover:bg-musgo-200"
                            >
                                Reservar e emitir voucher →
                            </button>
                            <a
                                href={montarUrlWhatsApp(mensagem, CONTATO_COMERCIAL.whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-white px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide hover:bg-musgo-600"
                            >
                                Receber esta cotação no WhatsApp
                            </a>
                        </div>

                        <p className="mt-4 text-xs">
                            Simulação indicativa, sujeita à análise de crédito ou à formação de grupo de consórcio. Taxas
                            e valores são ilustrativos.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}