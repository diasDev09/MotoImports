/**
 * MOTOIMPORTS — Domínio de Checkout Fictício & Voucher de Reserva
 * 
 * RASTREABILIDADE:
 * - [RF-08]: Checkout fictício com voucher de reserva e escolha da loja de retirada.
 * - [RN-02]: Status de estoque determina o prazo exibido e de retirada presencial.
 * - [RN-05]: Cotação e reserva possuem validade pré-definida (7 dias).
 * - [RN-06]: Reserva fictícia com aviso explícito de simulação.
 * - [RNF-05]: Privacidade e consentimento LGPD.
 * 
 * PADRÃO DE MATURIDADE: Funções puras, modelos de dados previsíveis e regras auditáveis.
 */

import { z } from 'zod'
import type { Moto, StatusEstoque } from '../data/motos.ts'
import type { ItemComPreco, simularOperacao } from './financing.ts'

export interface Loja {
    id: string
    cidade: string
    uf: string
    nome: string
    endereco: string
    cep: string
    telefone: string
    whatsapp: string
    horario: string
    capacidadeEntregaTecnica: boolean
}

export type FormaPagamento = 'a_vista' | 'financiamento' | 'consorcio'

export interface ClienteCheckout {
    nome: string
    telefone: string
    email: string
    cidade: string
    documento?: string
}

export interface ItemReserva extends ItemComPreco {
    id: string
    nome: string
    categoria?: string
}

export const LOJAS_RETIRADA: readonly Loja[] = [
    {
        id: 'sp-jardins',
        cidade: 'São Paulo',
        uf: 'SP',
        nome: 'Hub Jardins — Flagship Concept',
        endereco: 'Av. Europa, 840 — Jardins, São Paulo - SP',
        cep: '01449-000',
        telefone: '(11) 3088-9900',
        whatsapp: '5511999887766',
        horario: 'Segunda a Sexta: 09h às 19h | Sábado: 09h às 15h',
        capacidadeEntregaTecnica: true,
    },
    {
        id: 'rj-barra',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        nome: 'Hub Barra — Barra da Tijuca',
        endereco: 'Av. das Américas, 3500 — Barra da Tijuca, Rio de Janeiro - RJ',
        cep: '22640-102',
        telefone: '(21) 2430-8800',
        whatsapp: '5521999776655',
        horario: 'Segunda a Sexta: 09h às 19h | Sábado: 09h às 14h',
        capacidadeEntregaTecnica: true,
    },
    {
        id: 'pr-curitiba',
        cidade: 'Curitiba',
        uf: 'PR',
        nome: 'Hub Curitiba — Batel',
        endereco: 'Av. do Batel, 1850 — Batel, Curitiba - PR',
        cep: '80420-090',
        telefone: '(41) 3244-7700',
        whatsapp: '5541999665544',
        horario: 'Segunda a Sexta: 09h às 18h30 | Sábado: 09h às 13h',
        capacidadeEntregaTecnica: true,
    },
    {
        id: 'mg-savassi',
        cidade: 'Belo Horizonte',
        uf: 'MG',
        nome: 'Hub Savassi — Belo Horizonte',
        endereco: 'Rua Pernambuco, 1100 — Savassi, Belo Horizonte - MG',
        cep: '30130-151',
        telefone: '(31) 3280-6600',
        whatsapp: '5531999554433',
        horario: 'Segunda a Sexta: 09h às 18h30 | Sábado: 09h às 13h',
        capacidadeEntregaTecnica: true,
    },
    {
        id: 'df-brasilia',
        cidade: 'Brasília',
        uf: 'DF',
        nome: 'Hub Brasília — Setor de Concessionárias',
        endereco: 'SIA Trecho 3, Lote 120 — Brasília - DF',
        cep: '71200-030',
        telefone: '(61) 3362-5500',
        whatsapp: '5561999443322',
        horario: 'Segunda a Sexta: 09h às 18h | Sábado: 09h às 13h',
        capacidadeEntregaTecnica: true,
    },
]

/**
 * Retorna o prazo estimado de entrega com base no status do estoque [RN-02].
 * @param {string} statusEstoque - 'pronta-entrega' | 'em-transito' | 'sob-pedido'
 * @returns {{ prazoTexto: string, diasUteisMin: number, diasUteisMax: number }}
 */
export function estimarPrazoRetirada(statusEstoque?: StatusEstoque | string) {
    switch (statusEstoque) {
        case 'pronta-entrega':
            return {
                prazoTexto: '48 horas úteis (Pronta Entrega no Showroom)',
                diasUteisMin: 1,
                diasUteisMax: 2,
            }
        case 'em-transito':
            return {
                prazoTexto: '15 a 30 dias (Trânsito Aduaneiro & Desembaraço)',
                diasUteisMin: 15,
                diasUteisMax: 30,
            }
        case 'sob-pedido':
            return {
                prazoTexto: '45 a 60 dias (Importação Direta & Homologação)',
                diasUteisMin: 45,
                diasUteisMax: 60,
            }
        default:
            return {
                prazoTexto: 'Sob consulta com a equipe técnica',
                diasUteisMin: 2,
                diasUteisMax: 15,
            }
    }
}

/**
 * Gera um código humanamente legível e único para o voucher de reserva.
 * Padrão: MI-AAAA-CIDADE-XXXX
 * Exemplo: MI-2026-SP-8K92F
 */
export function gerarCodigoVoucher(lojaUf = 'BR'): string {
    const ano = new Date().getFullYear()
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase()
    const ufCode = (lojaUf || 'BR').toUpperCase().slice(0, 3)
    return `MI-${ano}-${ufCode}-${randomChars}`
}

/**
 * Calcula a data de expiração da reserva fictícia (7 dias úteis ou corridos) [RN-05, RN-06].
 */
export function calcularDataExpiracao(diasValidade = 7): Date {
    const agora = new Date()
    const expiracao = new Date(agora.getTime() + diasValidade * 24 * 60 * 60 * 1000)
    return expiracao
}

const apenasDigitos = (texto: string) => texto.replace(/\D/g, '')

// Mesmas regras de antes, agora em um schema Zod. O formato do retorno não muda; só o telefone passa a aceitar no máximo 11 dígitos.
const schemaCheckout = z.object({
    nome: z.string().trim().min(3, 'Informe seu nome completo (mínimo de 3 caracteres).'),
    telefone: z
        .string()
        .refine((valor) => [10, 11].includes(apenasDigitos(valor).length), {
            message: 'Informe um telefone válido com DDD (10 ou 11 dígitos).',
        }),
    email: z.string().trim().pipe(z.email('Informe um endereço de e-mail válido.')),
    cidade: z.string().trim().min(2, 'Informe sua cidade e estado.'),
    lojaId: z.string().min(1, 'Selecione uma loja autorizada para retirada presencial do veículo.'),
    consentimentoLGPD: z.literal(true, {
        error: 'É necessário concordar com os termos de privacidade para gerar a reserva.',
    }),
})

/**
 * Validação dos dados do formulário de checkout e lead capture [RF-01, RNF-05].
 * Devolve { valido, erros }, com no máximo uma mensagem por campo.
 */
export function validarDadosCheckout({
    cliente,
    lojaId,
    consentimentoLGPD,
}: {
    cliente?: Partial<ClienteCheckout>
    lojaId?: string
    consentimentoLGPD?: boolean
}) {
    const resultado = schemaCheckout.safeParse({
        nome: cliente?.nome ?? '',
        telefone: cliente?.telefone ?? '',
        email: cliente?.email ?? '',
        cidade: cliente?.cidade ?? '',
        lojaId: lojaId ?? '',
        consentimentoLGPD,
    })

    const erros: Record<string, string> = {}
    if (!resultado.success) {
        for (const problema of resultado.error.issues) {
            const campo = String(problema.path[0])
            erros[campo] ??= problema.message // fica a primeira mensagem de cada campo
        }
    }

    return { valido: resultado.success, erros }
}

/**
 * Cria o objeto consolidado do Voucher Oficial de Reserva Fictícia [RF-08].
 */
export function criarVoucherReserva({
    moto,
    acessorios = [],
    simulacao,
    formaPagamento = 'financiamento',
    cliente,
    lojaId,
}: {
    moto?: Partial<Moto>
    acessorios?: readonly ItemReserva[]
    simulacao?: ReturnType<typeof simularOperacao> | null
    formaPagamento?: FormaPagamento
    cliente: Partial<ClienteCheckout>
    lojaId?: string
}) {
    const loja = LOJAS_RETIRADA.find((l) => l.id === lojaId) ?? LOJAS_RETIRADA[0]
    const codigo = gerarCodigoVoucher(loja.uf)
    const dataCriacao = new Date()
    const dataExpiracao = calcularDataExpiracao(7)
    const prazoRetirada = estimarPrazoRetirada(moto?.estoque)

    const precoMoto = Number(moto?.preco) || 0
    const totalAcessorios = (acessorios || []).reduce((soma, item) => soma + (Number(item?.preco) || 0), 0)
    const valorTotalGeral = precoMoto + totalAcessorios

    return {
        codigo,
        status: 'CONFIRMADA_SIMULACAO',
        identificacaoSimulacao: 'SIMULAÇÃO OFICIAL — VOUCHER DE RESERVA FICTÍCIO (SEM COBRANÇA FINANCEIRA REAL)',
        dataCriacao: dataCriacao.toISOString(),
        dataExpiracao: dataExpiracao.toISOString(),
        prazoValidadeDias: 7,

        cliente: {
            nome: cliente.nome?.trim(),
            telefone: cliente.telefone?.trim(),
            email: cliente.email?.trim(),
            cidade: cliente.cidade?.trim(),
            documentoFicticio: cliente.documento?.trim() || 'Dispensa prévia de documento',
        },

        moto: {
            id: moto?.id,
            nome: moto?.nome,
            marca: moto?.marca,
            categoria: moto?.categoria,
            cilindrada: moto?.cilindrada,
            potenciaCv: moto?.potenciaCv,
            estoque: moto?.estoque,
            imagem: moto?.imagem,
            preco: precoMoto,
        },

        acessorios: (acessorios || []).map((item) => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            categoria: item.categoria || 'Acessório',
        })),

        financeiro: {
            formaPagamento,
            precoMoto,
            totalAcessorios,
            valorTotalGeral,
            simulacaoDetalhada: simulacao || null,
            valorSinalFicticio: Math.round(valorTotalGeral * 0.05), // Sinal simbólico fictício de 5%
        },

        retirada: {
            lojaId: loja.id,
            nomeLoja: loja.nome,
            endereco: loja.endereco,
            cidade: loja.cidade,
            uf: loja.uf,
            telefone: loja.telefone,
            whatsapp: loja.whatsapp,
            horarioFuncionamento: loja.horario,
            prazoRetiradaTexto: prazoRetirada.prazoTexto,
        },
    }
}

/**
 * Monta o texto padronizado do voucher para envio no WhatsApp oficial [RF-06, RF-08].
 */
export type VoucherReserva = ReturnType<typeof criarVoucherReserva>

export function formatarMensagemWhatsAppVoucher(voucher?: VoucherReserva | null): string {
    if (!voucher) return ''

    const { codigo, cliente, moto, retirada, financeiro } = voucher

    const formatoMoeda = (val?: number) =>
        (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

    let resumoFinanceiro = ''
    if (financeiro.formaPagamento === 'financiamento' && financeiro.simulacaoDetalhada?.resultadoAtivo) {
        const sim = financeiro.simulacaoDetalhada
        resumoFinanceiro = `\n💳 *Financiamento:* Entrada de ${formatoMoeda(sim.entrada)} + ${sim.meses}x de ${formatoMoeda(sim.resultadoAtivo.parcelaMensal)}`
    } else if (financeiro.formaPagamento === 'consorcio' && financeiro.simulacaoDetalhada?.resultadoAtivo) {
        const sim = financeiro.simulacaoDetalhada
        resumoFinanceiro = `\n🤝 *Consórcio:* Lance de ${formatoMoeda(sim.entrada)} + ${sim.meses}x de ${formatoMoeda(sim.resultadoAtivo.parcelaMensal)} (sem juros bancários; com taxa administrativa)`
    } else {
        resumoFinanceiro = `\n💵 *À Vista / Sinal:* Valor All-Inclusive ${formatoMoeda(financeiro.valorTotalGeral)}`
    }

    const textoAcessorios = (voucher.acessorios && voucher.acessorios.length > 0)
        ? `\n🔧 *Acessórios (${voucher.acessorios.length}):* ${voucher.acessorios.map(a => a.nome).join(', ')}`
        : ''

    const msg = [
        `🏍️ *MOTOIMPORTS — VOUCHER DE RESERVA OFICIAL*`,
        `📋 *Código da Reserva:* ${codigo}`,
        `👤 *Titular:* ${cliente.nome} (${cliente.cidade})`,
        `🏁 *Motocicleta:* ${moto.marca} ${moto.nome} (${moto.cilindrada}cc)`,
        `💰 *Valor Total:* ${formatoMoeda(financeiro.valorTotalGeral)}${resumoFinanceiro}${textoAcessorios}`,
        `🏬 *Loja de Retirada:* ${retirada.nomeLoja}`,
        `📍 *Endereço:* ${retirada.endereco}`,
        `⏱️ *Previsão de Retirada:* ${retirada.prazoRetiradaTexto}`,
        `📅 *Validade da Reserva:* 7 dias corridos`,
        `⚠️ *Aviso:* reserva de demonstração (simulação). Nenhuma cobrança foi feita e a moto não está reservada de fato.`,
    ].join('\n\n')

    return msg
}