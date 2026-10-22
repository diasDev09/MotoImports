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

export const LOJAS_RETIRADA = [
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
export function estimarPrazoRetirada(statusEstoque) {
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
export function gerarCodigoVoucher(lojaUf = 'BR') {
  const ano = new Date().getFullYear()
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase()
  const ufCode = (lojaUf || 'BR').toUpperCase().slice(0, 3)
  return `MI-${ano}-${ufCode}-${randomChars}`
}

/**
 * Calcula a data de expiração da reserva fictícia (7 dias úteis ou corridos) [RN-05, RN-06].
 */
export function calcularDataExpiracao(diasValidade = 7) {
  const agora = new Date()
  const expiracao = new Date(agora.getTime() + diasValidade * 24 * 60 * 60 * 1000)
  return expiracao
}

/**
 * Validação rigorosa dos dados do formulário de checkout e lead capture [RF-01, RNF-05].
 */
export function validarDadosCheckout({ cliente, lojaId, consentimentoLGPD }) {
  const erros = {}

  if (!cliente?.nome || cliente.nome.trim().length < 3) {
    erros.nome = 'Informe seu nome completo (mínimo de 3 caracteres).'
  }

  const telefoneLimpo = (cliente?.telefone || '').replace(/\D/g, '')
  if (!telefoneLimpo || telefoneLimpo.length < 10) {
    erros.telefone = 'Informe um número de WhatsApp/Telefone válido com DDD (mínimo 10 dígitos).'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cliente?.email || !emailRegex.test(cliente.email.trim())) {
    erros.email = 'Informe um endereço de e-mail corporativo ou pessoal válido.'
  }

  if (!cliente?.cidade || cliente.cidade.trim().length < 2) {
    erros.cidade = 'Informe sua cidade e estado.'
  }

  if (!lojaId) {
    erros.lojaId = 'Selecione uma loja autorizada para retirada presencial do veículo.'
  }

  if (!consentimentoLGPD) {
    erros.consentimentoLGPD = 'É necessário concordar com os termos de privacidade para gerar a reserva.'
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  }
}

/**
 * Cria o objeto consolidado do Voucher Oficial de Reserva Fictícia [RF-08].
 */
export function criarVoucherReserva({
  moto,
  acessorios = [],
  simulacao,
  formaPagamento = 'financiamento', // 'a_vista' | 'financiamento' | 'consorcio'
  cliente,
  lojaId,
}) {
  const loja = LOJAS_RETIRADA.find((l) => l.id === lojaId) || LOJAS_RETIRADA[0]
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
export function formatarMensagemWhatsAppVoucher(voucher) {
  if (!voucher) return ''

  const { codigo, cliente, moto, retirada, financeiro } = voucher

  const formatoMoeda = (val) =>
    (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  let resumoFinanceiro = ''
  if (financeiro.formaPagamento === 'financiamento' && financeiro.simulacaoDetalhada?.resultadoAtivo) {
    const sim = financeiro.simulacaoDetalhada
    resumoFinanceiro = `\n💳 *Financiamento:* Entrada de ${formatoMoeda(sim.entrada)} + ${sim.meses}x de ${formatoMoeda(sim.resultadoAtivo.parcelaMensal)}`
  } else if (financeiro.formaPagamento === 'consorcio' && financeiro.simulacaoDetalhada?.resultadoAtivo) {
    const sim = financeiro.simulacaoDetalhada
    resumoFinanceiro = `\n🤝 *Consórcio:* Lance de ${formatoMoeda(sim.entrada)} + ${sim.meses}x de ${formatoMoeda(sim.resultadoAtivo.parcelaMensal)} (taxa zero de juros)`
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
    `⚠️ *Nota:* Reserva gerada via simulador web oficial MotoImports.`,
  ].join('\n\n')

  return msg
}
