import { useEffect, useRef, useState } from 'react'
import { formatarMensagemWhatsAppVoucher } from '../domain/reservation.ts'
import type { VoucherReserva as Voucher } from '../domain/reservation.ts'
import { formatarPreco, linkWhatsApp } from '../utils/formatters.ts'

// RF-08: comprovante da reserva (porte da v1, do Santos).
// RN-06: a todo momento fica claro que é uma simulação, sem cobrança real.

const NOME_FORMA = {
    financiamento: 'Financiamento bancário',
    consorcio: 'Consórcio',
    a_vista: 'À vista / sinal',
} as const

const botao =
    'rounded-lg border border-musgo-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-musgo-200'

const data = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
const hora = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-musgo-600">{titulo}</h3>
            <div className="mt-2 flex flex-col gap-1 text-sm">{children}</div>
        </section>
    )
}

interface VoucherReservaProps {
    voucher: Voucher
    aoNovaReserva: () => void
}

export default function VoucherReserva({ voucher, aoNovaReserva }: VoucherReservaProps) {
    const titulo = useRef<HTMLHeadingElement>(null)
    const [copiado, setCopiado] = useState(false)
    const { cliente, moto, retirada, financeiro } = voucher
    const plano = financeiro.simulacaoDetalhada

    // ao gerar o voucher, o foco vai para o título: quem usa leitor de tela ouve o resultado
    useEffect(() => titulo.current?.focus(), [])

    // a mensagem "Código copiado" some sozinha depois de alguns segundos
    useEffect(() => {
        if (!copiado) return
        const id = setTimeout(() => setCopiado(false), 2500)
        return () => clearTimeout(id)
    }, [copiado])

    async function copiarCodigo() {
        try {
            await navigator.clipboard.writeText(voucher.codigo)
            setCopiado(true)
        } catch {
            // sem permissão de área de transferência: a pessoa ainda vê o código na tela e pode copiar à mão
        }
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-3xl px-6">
                <p role="alert" className="rounded-lg border border-aviso bg-aviso/40 p-4 text-sm">
                    <strong>{voucher.identificacaoSimulacao}</strong>
                    <br />
                    Nenhuma cobrança foi feita. Este comprovante é só uma demonstração do fluxo de reserva.
                </p>

                <article className="mt-6 overflow-hidden rounded-card border border-musgo-200 bg-white" id="comprovante-voucher">
                    <header className="flex flex-wrap items-center justify-between gap-4 bg-musgo-900 p-6 text-white">
                        <div>
                            <p className="font-display text-xl font-extrabold uppercase">Moto Imports</p>
                            <h1 ref={titulo} tabIndex={-1} className="text-sm outline-none">
                                Voucher de reserva presencial
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase">Código da reserva</p>
                            <p className="font-display text-2xl font-extrabold" data-testid="codigo">{voucher.codigo}</p>
                            <p className="text-xs font-semibold uppercase">Reserva de demonstração</p>
                        </div>
                    </header>

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <Secao titulo="Motocicleta">
                            <p><strong>Modelo:</strong> {moto.marca} {moto.nome}</p>
                            <p><strong>Categoria:</strong> {moto.categoria} · {moto.cilindrada} cc</p>
                            <p><strong>Previsão de liberação:</strong> {retirada.prazoRetiradaTexto}</p>
                        </Secao>

                        <Secao titulo="Titular">
                            <p><strong>Nome:</strong> {cliente.nome}</p>
                            <p><strong>WhatsApp:</strong> {cliente.telefone}</p>
                            <p><strong>E-mail:</strong> {cliente.email}</p>
                            <p><strong>Cidade:</strong> {cliente.cidade}</p>
                        </Secao>

                        <Secao titulo="Loja de retirada">
                            <p className="font-semibold">{retirada.nomeLoja}</p>
                            <p>{retirada.endereco}</p>
                            <p><strong>Horário:</strong> {retirada.horarioFuncionamento}</p>
                            <p><strong>Telefone:</strong> {retirada.telefone}</p>
                        </Secao>

                        <Secao titulo="Condições">
                            <p><strong>Modalidade:</strong> {NOME_FORMA[financeiro.formaPagamento]}</p>
                            {plano && (
                                <p>
                                    <strong>Plano:</strong> {plano.meses}x de {formatarPreco(plano.resultadoAtivo.parcelaMensal)} com
                                    entrada de {formatarPreco(plano.entrada)}
                                </p>
                            )}
                            <p><strong>Valor total:</strong></p>
                            <p className="font-display text-2xl font-extrabold">{formatarPreco(financeiro.valorTotalGeral)}</p>
                        </Secao>

                        {voucher.acessorios.length > 0 && (
                            <div className="sm:col-span-2">
                                <Secao titulo={`Acessórios (${voucher.acessorios.length})`}>
                                    <ul className="list-disc pl-5">
                                        {voucher.acessorios.map((a) => (
                                            <li key={a.id}>{a.nome} · {formatarPreco(a.preco)}</li>
                                        ))}
                                    </ul>
                                </Secao>
                            </div>
                        )}
                    </div>

                    <footer className="border-t border-musgo-200 bg-musgo-50 p-4 text-xs">
                        Emitido em {data(voucher.dataCriacao)} às {hora(voucher.dataCriacao)}. Válido até{' '}
                        {data(voucher.dataExpiracao)} ({voucher.prazoValidadeDias} dias corridos).
                    </footer>
                </article>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={() => window.print()} className={`${botao} bg-musgo-900 text-white hover:bg-musgo-600`}>
                        Imprimir ou salvar PDF
                    </button>
                    <button type="button" onClick={copiarCodigo} className={botao}>
                        {copiado ? '✓ Código copiado' : 'Copiar código'}
                    </button>
                    <a
                        href={linkWhatsApp(retirada.whatsapp, formatarMensagemWhatsAppVoucher(voucher))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={botao}
                    >
                        Enviar para a loja no WhatsApp
                    </a>
                    <button type="button" onClick={aoNovaReserva} className={botao}>
                        Nova reserva
                    </button>
                </div>
                <p role="status" className="sr-only">{copiado ? 'Código copiado.' : ''}</p>
            </div>
        </section>
    )
}