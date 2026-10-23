import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import VoucherReserva from '../components/VoucherReserva.tsx'
import { useApp } from '../context/AppContext.ts'
import { formatarTelefone, somenteDigitos } from '../domain/lead.ts'
import {
    LOJAS_RETIRADA,
    criarVoucherReserva,
    estimarPrazoRetirada,
    validarDadosCheckout,
} from '../domain/reservation.ts'
import type { ClienteCheckout, FormaPagamento } from '../domain/reservation.ts'
import { formatarPreco } from '../utils/formatters.ts'

// RF-08: checkout fictício com voucher e escolha da loja de retirada (porte da v1, do Santos).
// As regras (validação, voucher, prazos) ficam em domain/reservation.ts.

const cartao = 'rounded-card border border-musgo-200 bg-white p-5'
const titulo = 'mb-3 text-lg font-bold'
const campo = 'rounded-lg border border-musgo-400 bg-white px-3 py-2 text-musgo-900'

const FORMAS: { id: FormaPagamento; nome: string }[] = [
    { id: 'financiamento', nome: 'Financiamento bancário' },
    { id: 'consorcio', nome: 'Consórcio' },
    { id: 'a_vista', nome: 'À vista / sinal' },
]

type Erros = Record<string, string | undefined>

function Erro({ id, mensagem }: { id: string; mensagem?: string }) {
    if (!mensagem) return null
    return (
        <p id={id} role="alert" className="text-sm font-medium text-erro">
            {mensagem}
        </p>
    )
}

export default function Checkout() {
    const {
        motoSelecionada: moto,
        acessorios,
        removerAcessorio,
        totalAcessorios,
        simulacao,
        lead,
        registrarLead,
        voucherReserva,
        salvarVoucherReserva,
    } = useApp()

    // os dados que a pessoa já digitou no contato aparecem preenchidos
    const [cliente, setCliente] = useState<ClienteCheckout>({
        nome: lead?.nome ?? '',
        telefone: lead ? formatarTelefone(lead.telefone) : '',
        email: lead?.email ?? '',
        cidade: lead?.cidade ?? '',
    })
    const [lojaId, setLojaId] = useState<string>(LOJAS_RETIRADA[0].id)
    const [forma, setForma] = useState<FormaPagamento>(simulacao?.modalidade ?? 'financiamento')
    const [consentimento, setConsentimento] = useState(false)
    const [erros, setErros] = useState<Erros>({})

    if (voucherReserva) {
        return <VoucherReserva voucher={voucherReserva} aoNovaReserva={() => salvarVoucherReserva(null)} />
    }

    if (!moto) {
        return (
            <section className="py-12">
                <div className="mx-auto max-w-xl px-6">
                    <h1 className="text-4xl">Reserva e retirada</h1>
                    <p className="mt-3 text-musgo-600">
                        Você ainda não escolheu uma moto. Veja o catálogo ou simule o financiamento de uma moto para
                        reservar.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link to="/catalogo" className="rounded-lg bg-musgo-900 px-6 py-3 text-sm font-semibold text-white hover:bg-musgo-600">
                            Ver catálogo
                        </Link>
                        <Link to="/simulador" className="rounded-lg border border-musgo-900 px-6 py-3 text-sm font-semibold hover:bg-musgo-200">
                            Ir para o simulador
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    // o plano do simulador só vale se for da mesma modalidade escolhida aqui
    const planoVinculado = simulacao && simulacao.modalidade === forma ? simulacao : null
    const prazo = estimarPrazoRetirada(moto.estoque)

    function alterar(nome: keyof ClienteCheckout) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const valor = nome === 'telefone' ? formatarTelefone(e.target.value) : e.target.value
            setCliente((anterior) => ({ ...anterior, [nome]: valor }))
            setErros((anterior) => ({ ...anterior, [nome]: undefined }))
        }
    }

    function confirmar(e: FormEvent) {
        e.preventDefault()
        if (!moto) return

        const validacao = validarDadosCheckout({ cliente, lojaId, consentimentoLGPD: consentimento })
        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        // o contato fica guardado para o resto do app (RF-01)
        registrarLead({
            nome: cliente.nome.trim(),
            email: cliente.email.trim(),
            telefone: somenteDigitos(cliente.telefone),
            cidade: cliente.cidade.trim(),
            consentimento: true,
            motoId: moto.id,
        })

        salvarVoucherReserva(
            criarVoucherReserva({
                moto,
                acessorios,
                simulacao: planoVinculado,
                formaPagamento: forma,
                cliente,
                lojaId,
            }),
        )
    }

    const acessivel = (nome: string) => ({
        'aria-invalid': erros[nome] ? ('true' as const) : ('false' as const),
        'aria-describedby': erros[nome] ? `${nome}-erro` : undefined,
    })

    return (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">
                <header className="max-w-2xl">
                    <h1 className="text-4xl">Reserva e retirada em loja</h1>
                    <p className="mt-3 text-musgo-600">
                        Escolha a loja, confira o resumo e gere o voucher da sua reserva.
                    </p>
                </header>

                <form onSubmit={confirmar} noValidate className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="flex flex-col gap-6">
                        <fieldset className={cartao}>
                            <legend className={titulo}>1. Loja de retirada</legend>
                            <div className="flex flex-col gap-3">
                                {LOJAS_RETIRADA.map((loja) => (
                                    <label
                                        key={loja.id}
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${lojaId === loja.id ? 'border-musgo-900 bg-musgo-50' : 'border-musgo-200 hover:bg-musgo-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="lojaRetirada"
                                            value={loja.id}
                                            checked={lojaId === loja.id}
                                            onChange={() => setLojaId(loja.id)}
                                            className="mt-1 accent-musgo-600"
                                        />
                                        <span>
                                            <strong>{loja.nome}</strong>
                                            <span className="block">{loja.endereco}</span>
                                            <span className="block text-musgo-600">Horário: {loja.horario} · Tel.: {loja.telefone}</span>
                                            <span className="mt-1 inline-block rounded bg-musgo-200 px-2 py-0.5 text-xs">{prazo.prazoTexto}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <Erro id="lojaId-erro" mensagem={erros.lojaId} />
                        </fieldset>

                        <fieldset className={cartao}>
                            <legend className={titulo}>2. Condição de pagamento</legend>
                            <div className="flex flex-wrap gap-2">
                                {FORMAS.map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        aria-pressed={forma === f.id}
                                        onClick={() => setForma(f.id)}
                                        className={`rounded-lg border px-4 py-2 text-sm font-semibold ${forma === f.id ? 'border-musgo-900 bg-musgo-900 text-white' : 'border-musgo-400 hover:bg-musgo-200'
                                            }`}
                                    >
                                        {f.nome}
                                    </button>
                                ))}
                            </div>

                            {planoVinculado && (
                                <p className="mt-3 text-sm">
                                    ✓ Plano da simulação: <strong>{planoVinculado.meses}x</strong> de{' '}
                                    <strong>{formatarPreco(planoVinculado.resultadoAtivo.parcelaMensal)}</strong> com entrada de{' '}
                                    <strong>{formatarPreco(planoVinculado.entrada)}</strong>.
                                </p>
                            )}
                            {forma !== 'a_vista' && !planoVinculado && (
                                <p className="mt-3 text-sm text-musgo-600">
                                    Não há simulação de {forma === 'consorcio' ? 'consórcio' : 'financiamento'} para esta moto.{' '}
                                    <Link to={`/simulador?moto=${moto.id}`} className="font-semibold underline">
                                        Simular agora
                                    </Link>
                                </p>
                            )}
                        </fieldset>

                        <fieldset className={cartao}>
                            <legend className={titulo}>3. Seus dados</legend>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="cli-nome" className="text-sm">Nome completo</label>
                                    <input id="cli-nome" type="text" autoComplete="name" value={cliente.nome} onChange={alterar('nome')} className={campo} {...acessivel('nome')} />
                                    <Erro id="nome-erro" mensagem={erros.nome} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="cli-tel" className="text-sm">WhatsApp com DDD</label>
                                    <input id="cli-tel" type="tel" autoComplete="tel" placeholder="(81) 99999-9999" value={cliente.telefone} onChange={alterar('telefone')} className={campo} {...acessivel('telefone')} />
                                    <Erro id="telefone-erro" mensagem={erros.telefone} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="cli-email" className="text-sm">E-mail</label>
                                    <input id="cli-email" type="email" autoComplete="email" value={cliente.email} onChange={alterar('email')} className={campo} {...acessivel('email')} />
                                    <Erro id="email-erro" mensagem={erros.email} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="cli-cidade" className="text-sm">Cidade</label>
                                    <input id="cli-cidade" type="text" autoComplete="address-level2" value={cliente.cidade} onChange={alterar('cidade')} className={campo} {...acessivel('cidade')} />
                                    <Erro id="cidade-erro" mensagem={erros.cidade} />
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                                <input
                                    id="lgpd"
                                    type="checkbox"
                                    checked={consentimento}
                                    onChange={(e) => {
                                        setConsentimento(e.target.checked)
                                        setErros((anterior) => ({ ...anterior, consentimentoLGPD: undefined }))
                                    }}
                                    className="mt-1 size-4 accent-musgo-600"
                                    {...acessivel('consentimentoLGPD')}
                                />
                                <label htmlFor="lgpd" className="text-sm">
                                    Autorizo a MotoImports a usar meus dados só para contato e emissão deste voucher, conforme a
                                    LGPD (Lei 13.709/2018).
                                </label>
                            </div>
                            <Erro id="consentimentoLGPD-erro" mensagem={erros.consentimentoLGPD} />
                        </fieldset>
                    </div>

                    <aside className="h-fit rounded-card border border-musgo-200 bg-white p-5 lg:sticky lg:top-24" aria-label="Resumo do pedido">
                        <h2 className={titulo}>Resumo</h2>
                        <div className="flex items-center gap-3">
                            {moto.imagem && <img src={moto.imagem} alt="" className="h-14 w-20 rounded-lg object-cover" />}
                            <div>
                                <p className="font-semibold">{moto.marca} {moto.nome}</p>
                                <p className="text-sm text-musgo-600">{moto.categoria} · {formatarPreco(moto.preco)}</p>
                            </div>
                        </div>

                        <h3 className="mt-4 text-sm font-bold">Acessórios ({acessorios.length})</h3>
                        {acessorios.length === 0 ? (
                            <p className="mt-1 text-sm italic text-musgo-600">Nenhum acessório adicionado.</p>
                        ) : (
                            <ul className="mt-2 flex flex-col gap-2">
                                {acessorios.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                                        <span>{a.nome}</span>
                                        <span className="flex items-center gap-2">
                                            <strong>{formatarPreco(a.preco)}</strong>
                                            <button
                                                type="button"
                                                aria-label={`Remover ${a.nome}`}
                                                onClick={() => removerAcessorio(a.id)}
                                                className="rounded-lg border border-musgo-600 px-2 text-sm hover:bg-musgo-200"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <dl className="mt-4 grid grid-cols-[1fr_auto] gap-2 border-t border-musgo-200 pt-4 text-sm">
                            <dt>Motocicleta</dt>
                            <dd className="font-semibold">{formatarPreco(moto.preco)}</dd>
                            {totalAcessorios > 0 && (
                                <>
                                    <dt>Acessórios</dt>
                                    <dd className="font-semibold">{formatarPreco(totalAcessorios)}</dd>
                                </>
                            )}
                            <dt className="text-base font-bold">Valor total</dt>
                            <dd className="text-base font-bold">{formatarPreco(moto.preco + totalAcessorios)}</dd>
                        </dl>

                        <p className="mt-4 rounded-lg bg-aviso/40 p-3 text-xs">
                            Esta é uma reserva de demonstração: nenhuma cobrança é feita.
                        </p>

                        <button
                            type="submit"
                            className="mt-4 w-full rounded-lg bg-musgo-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600"
                        >
                            Confirmar reserva e gerar voucher
                        </button>
                        <p className="mt-3 text-center text-sm">
                            <Link to={`/simulador?moto=${moto.id}`} className="underline">
                                ← Ajustar parcelas no simulador
                            </Link>
                        </p>
                    </aside>
                </form>
            </div>
        </section>
    )
}