/**
 * MOTOIMPORTS — Domínio de Financiamento & Consórcio
 * 
 * RASTREABILIDADE:
 * - [RF-07]: Simulador de financiamento e consórcio (12x a 72x, entrada, parcelas).
 * - [RF-11]: Acessórios técnicos com opção de inclusão no financiamento.
 * - [RN-03]: Cálculo de parcelas parametrizado por produto financeiro e prazo.
 * - [RN-04]: Entrada mínima (20%) e máxima (80%) parametrizadas.
 * - [RN-07]: Acessórios inclusos aumentam o saldo financiado e recalculam parcelas.
 * 
 * PADRÃO DE MATURIDADE: Funções puras, determinísticas e totalmente testáveis sem UI.
 */

export type Modalidade = 'financiamento' | 'consorcio'

// qualquer item que tenha preço (acessório do catálogo, do carrinho, etc.)
export interface ItemComPreco {
    preco: number
}

// o mínimo que a simulação precisa saber da moto; o resto dos campos é preservado
export interface MotoSimulavel {
    preco: number
    id?: string
    nome?: string
}

export interface ResultadoValidacaoEntrada {
    valida: boolean
    mensagem?: string
    entradaMinima: number
    entradaMaxima: number
}

// "1,49%" / "12%": percentual em pt-BR para os rótulos, sempre derivado dos parâmetros
const percentual = (fracao: number) =>
    `${(fracao * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`

export const PARAMETROS_FINANCEIROS = {
    // Financiamento Bancário (CDC - Crédito Direto ao Consumidor com taxa pré-fixada)
    financiamento: {
        nome: 'Financiamento Bancário Imediato',
        descricao: 'Aprovação expressa, liberação imediata e amortização pela Tabela Price.',
        taxaMensalPadrao: 0.0149, // 1,49% ao mês
        taxaAnualEquivalente: 0.1942, // ~19,42% ao ano
        iofAliquotaBasica: 0.0038, // 0,38% IOF adicional
        iofDiario: 0.000082, // IOF diário médio
        entradaMinimaPercentual: 0.20, // 20%
        entradaMaximaPercentual: 0.80, // 80%
        prazosDisponiveis: [12, 24, 36, 48, 60, 72],
        prazoLiberacao: 'Imediata após análise cadastral',
    },

    // Consórcio Internacional
    consorcio: {
        nome: 'Consórcio Internacional',
        descricao: 'Planejamento com taxa administrativa reduzida, sem cobrança de juros compostos.',
        taxaAdminTotalPadrao: 0.12, // 12% diluídos em todo o plano
        fundoReservaPadrao: 0.02, // 2% fundo de reserva
        entradaMinimaPercentual: 0.10, // 10% (lance livre ou embutido sugerido)
        entradaMaximaPercentual: 0.70, // 70%
        prazosDisponiveis: [12, 24, 36, 48, 60, 72],
        prazoLiberacao: 'Por sorteio mensal ou oferta de lance',
    },
}

/**
 * Valida se a entrada informada está dentro dos limites da regra de negócio [RN-04].
 * @param {number} valorTotal - Valor base do bem + acessórios inclusos
 * @param {number} valorEntrada - Valor monetário proposto para entrada
 * @param {string} modalidade - 'financiamento' ou 'consorcio'
 * @returns {{ valida: boolean, mensagem?: string, entradaMinima: number, entradaMaxima: number }}
 */
export function validarLimitesEntrada(
    valorTotal: number,
    valorEntrada: number,
    modalidade: Modalidade = 'financiamento',
): ResultadoValidacaoEntrada {
    if (typeof valorTotal !== 'number' || valorTotal <= 0) {
        return { valida: false, mensagem: 'Valor total inválido.', entradaMinima: 0, entradaMaxima: 0 }
    }

    const config = PARAMETROS_FINANCEIROS[modalidade] || PARAMETROS_FINANCEIROS.financiamento
    const entradaMinima = Math.round(valorTotal * config.entradaMinimaPercentual)
    const entradaMaxima = Math.round(valorTotal * config.entradaMaximaPercentual)

    if (typeof valorEntrada !== 'number' || isNaN(valorEntrada)) {
        return {
            valida: false,
            mensagem: `Entrada deve ser um número entre R$ ${entradaMinima.toLocaleString('pt-BR')} e R$ ${entradaMaxima.toLocaleString('pt-BR')}.`,
            entradaMinima,
            entradaMaxima,
        }
    }

    if (valorEntrada < entradaMinima) {
        return {
            valida: false,
            mensagem: `A entrada mínima para ${config.nome} é de ${config.entradaMinimaPercentual * 100}% (R$ ${entradaMinima.toLocaleString('pt-BR')}).`,
            entradaMinima,
            entradaMaxima,
        }
    }

    if (valorEntrada > entradaMaxima) {
        return {
            valida: false,
            mensagem: `A entrada máxima permitida é de ${config.entradaMaximaPercentual * 100}% (R$ ${entradaMaxima.toLocaleString('pt-BR')}).`,
            entradaMinima,
            entradaMaxima,
        }
    }

    return { valida: true, entradaMinima, entradaMaxima }
}

/**
 * Calcula as parcelas do Financiamento Bancário via Tabela Price (Sistema Francês de Amortização).
 * Fórmula: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
 * 
 * @param {Object} params
 * @param {number} params.saldoDevedor - Valor a financiar (Valor total - Entrada)
 * @param {number} params.meses - Quantidade de meses (12 a 72)
 * @param {number} [params.taxaMensal] - Taxa mensal nominal (padrão parametrizado)
 * @returns {{ parcelaMensal: number, totalFinanciadoComJuros: number, totalJuros: number, taxaMensal: number }}
 */
export function calcularFinanciamento({
    saldoDevedor,
    meses,
    taxaMensal = PARAMETROS_FINANCEIROS.financiamento.taxaMensalPadrao,
}: {
    saldoDevedor: number
    meses: number
    taxaMensal?: number
}) {
    if (saldoDevedor <= 0 || meses <= 0) {
        return { parcelaMensal: 0, totalFinanciadoComJuros: 0, totalJuros: 0, taxaMensal }
    }

    if (taxaMensal === 0) {
        const parcela = saldoDevedor / meses
        return {
            parcelaMensal: Math.round(parcela * 100) / 100,
            totalFinanciadoComJuros: saldoDevedor,
            totalJuros: 0,
            taxaMensal: 0,
        }
    }

    const fator = Math.pow(1 + taxaMensal, meses)
    const parcela = saldoDevedor * ((taxaMensal * fator) / (fator - 1))
    const parcelaArredondada = Math.round(parcela * 100) / 100
    const totalFinanciadoComJuros = Math.round(parcelaArredondada * meses * 100) / 100
    const totalJuros = Math.max(0, Math.round((totalFinanciadoComJuros - saldoDevedor) * 100) / 100)

    return {
        parcelaMensal: parcelaArredondada,
        totalFinanciadoComJuros,
        totalJuros,
        taxaMensal,
    }
}

/**
 * Calcula as parcelas do Consórcio Internacional sem juros bancários.
 * Custo total = Bem + Taxa de Administração + Fundo de Reserva.
 * Abate lance/entrada e divide pelo prazo.
 * 
 * @param {Object} params
 * @param {number} params.valorBem - Valor total do bem + opcionais
 * @param {number} params.lanceEntrada - Valor adiantado como lance ou entrada
 * @param {number} params.meses - Quantidade de meses (12 a 72)
 * @param {number} [params.taxaAdminTotal] - Taxa administrativa diluída no prazo
 * @param {number} [params.fundoReserva] - Percentual do fundo de reserva
 * @returns {{ parcelaMensal: number, totalPagoConsorcio: number, custoTaxaAdmin: number, taxaAdminTotal: number }}
 */
export function calcularConsorcio({
    valorBem,
    lanceEntrada = 0,
    meses,
    taxaAdminTotal = PARAMETROS_FINANCEIROS.consorcio.taxaAdminTotalPadrao,
    fundoReserva = PARAMETROS_FINANCEIROS.consorcio.fundoReservaPadrao,
}: {
    valorBem: number
    lanceEntrada?: number
    meses: number
    taxaAdminTotal?: number
    fundoReserva?: number
}) {
    if (valorBem <= 0 || meses <= 0) {
        return { parcelaMensal: 0, totalPagoConsorcio: 0, custoTaxaAdmin: 0, taxaAdminTotal }
    }

    const custoTaxaAdmin = Math.round(valorBem * taxaAdminTotal * 100) / 100
    const custoFundoReserva = Math.round(valorBem * fundoReserva * 100) / 100
    const custoTotalPlano = Math.round((valorBem + custoTaxaAdmin + custoFundoReserva) * 100) / 100

    // O saldo restante é rateado nas parcelas
    const saldoAPagar = Math.max(0, custoTotalPlano - lanceEntrada)
    const parcela = saldoAPagar / meses
    const parcelaArredondada = Math.round(parcela * 100) / 100
    const totalPagoConsorcio = Math.round((lanceEntrada + (parcelaArredondada * meses)) * 100) / 100

    return {
        parcelaMensal: parcelaArredondada,
        totalPagoConsorcio,
        custoTaxaAdmin,
        taxaAdminTotal,
    }
}

/**
 * Realiza a simulação completa integrando moto, acessórios, entrada e prazos.
 * Cumpre [RF-07], [RN-03], [RN-04], [RN-07].
 * 
 * @param {Object} options
 * @param {Object} options.moto - Objeto da moto ({ id, nome, preco, ... })
 * @param {Array} [options.acessorios] - Lista de acessórios selecionados
 * @param {boolean} [options.incluirAcessoriosNoFinanciamento] - Se true, soma acessórios ao saldo [RN-07]
 * @param {string} [options.modalidade] - 'financiamento' | 'consorcio'
 * @param {number} [options.meses] - Prazo em meses (12 a 72)
 * @param {number} [options.valorEntrada] - Valor monetário da entrada informada
 * @param {number} [options.percentualEntrada] - Percentual da entrada (usado caso valorEntrada não venha)
 * @returns {Object} Detalhes completos da simulação e comparativo entre opções
 */
export function simularOperacao<M extends MotoSimulavel, A extends ItemComPreco = ItemComPreco>({
    moto,
    acessorios = [],
    incluirAcessoriosNoFinanciamento = true,
    modalidade = 'financiamento',
    meses = 48,
    valorEntrada,
    percentualEntrada = 20,
}: {
    moto: M
    acessorios?: readonly A[]
    incluirAcessoriosNoFinanciamento?: boolean
    modalidade?: Modalidade
    meses?: number
    valorEntrada?: number
    percentualEntrada?: number
}) {
    // o prazo precisa ser um dos oferecidos; antes, qualquer número passava em silêncio
    const prazos: readonly number[] = PARAMETROS_FINANCEIROS[modalidade].prazosDisponiveis
    if (!prazos.includes(meses)) {
        throw new RangeError(`Prazo de ${meses} meses indisponível. Use: ${prazos.join(', ')}.`)
    }

    const precoMoto = moto?.preco || 0
    const totalAcessorios = (acessorios || []).reduce((soma, item) => soma + (Number(item?.preco) || 0), 0)

    // Valor base para cálculo do financiamento ou consórcio
    const valorTotalOperacao = precoMoto + (incluirAcessoriosNoFinanciamento ? totalAcessorios : 0)

    // Determinar valor de entrada efetivo
    const entradaSolicitada = typeof valorEntrada === 'number'
        ? valorEntrada
        : Math.round(valorTotalOperacao * (percentualEntrada / 100))
    let entradaEfetiva = entradaSolicitada

    const validacao = validarLimitesEntrada(valorTotalOperacao, entradaEfetiva, modalidade)

    // Se a entrada informada for inválida (ex: menor que o mínimo), ajustamos para o mínimo seguro
    if (!validacao.valida && valorTotalOperacao > 0) {
        if (entradaEfetiva < validacao.entradaMinima) {
            entradaEfetiva = validacao.entradaMinima
        } else if (entradaEfetiva > validacao.entradaMaxima) {
            entradaEfetiva = validacao.entradaMaxima
        }
    }

    const saldoDevedor = Math.max(0, valorTotalOperacao - entradaEfetiva)
    const percentualEfetivo = valorTotalOperacao > 0
        ? Math.round((entradaEfetiva / valorTotalOperacao) * 100)
        : percentualEntrada

    // 1. Cálculo Financiamento
    const resultadoFinanciamento = calcularFinanciamento({
        saldoDevedor,
        meses,
    })

    // 2. Cálculo Consórcio
    const resultadoConsorcio = calcularConsorcio({
        valorBem: valorTotalOperacao,
        lanceEntrada: entradaEfetiva,
        meses,
    })

    // 3. Comparativo de Economia (Consórcio vs Financiamento)
    const totalGeralFinanciamento = entradaEfetiva + resultadoFinanciamento.totalFinanciadoComJuros
    const totalGeralConsorcio = resultadoConsorcio.totalPagoConsorcio
    const economiaConsorcio = Math.max(0, Math.round((totalGeralFinanciamento - totalGeralConsorcio) * 100) / 100)

    // 4. Se acessórios não foram incluídos no financiamento, eles são devidos no ato
    const valorDevidoNoAto = entradaEfetiva + (!incluirAcessoriosNoFinanciamento ? totalAcessorios : 0)

    return {
        moto,
        precoMoto,
        acessorios,
        totalAcessorios,
        incluirAcessoriosNoFinanciamento,
        valorTotalOperacao,
        modalidade,
        meses,
        entrada: entradaEfetiva,
        entradaSolicitada,
        // true quando a entrada pedida estava fora dos limites e foi corrigida (quem exibe pode avisar)
        entradaAjustada: entradaEfetiva !== entradaSolicitada,
        percentualEntrada: percentualEfetivo,
        entradaMinima: validacao.entradaMinima,
        entradaMaxima: validacao.entradaMaxima,
        saldoDevedor,
        valorDevidoNoAto,

        // Resultado da modalidade ativa
        resultadoAtivo: modalidade === 'consorcio'
            ? {
                parcelaMensal: resultadoConsorcio.parcelaMensal,
                totalPago: totalGeralConsorcio,
                custoAdicional: resultadoConsorcio.custoTaxaAdmin,
                tipoCusto: `Taxa Administrativa (${percentual(PARAMETROS_FINANCEIROS.consorcio.taxaAdminTotalPadrao)} diluída)`,
                nomeModalidade: PARAMETROS_FINANCEIROS.consorcio.nome,
                prazoEntrega: PARAMETROS_FINANCEIROS.consorcio.prazoLiberacao,
            }
            : {
                parcelaMensal: resultadoFinanciamento.parcelaMensal,
                totalPago: totalGeralFinanciamento,
                custoAdicional: resultadoFinanciamento.totalJuros,
                tipoCusto: `Juros de Financiamento (${percentual(PARAMETROS_FINANCEIROS.financiamento.taxaMensalPadrao)} a.m.)`,
                nomeModalidade: PARAMETROS_FINANCEIROS.financiamento.nome,
                prazoEntrega: PARAMETROS_FINANCEIROS.financiamento.prazoLiberacao,
            },

        // Detalhamento de ambas as modalidades para comparativo instantâneo
        financiamento: {
            ...resultadoFinanciamento,
            totalGeral: totalGeralFinanciamento,
        },
        consorcio: {
            ...resultadoConsorcio,
            totalGeral: totalGeralConsorcio,
        },
        economiaConsorcio,
    }
}