/**
 * MOTOIMPORTS — Página de Checkout Fictício & Emissão de Voucher [RF-08]
 * Responsável: Santos
 * 
 * RASTREABILIDADE:
 * - [RF-08]: Checkout fictício com voucher de reserva e escolha da loja de retirada.
 * - [RN-02]: Prazo de entrega baseado no status do estoque da moto.
 * - [RN-05]: Validade da reserva (7 dias).
 * - [RN-06]: Aviso explícito de reserva fictícia/simulação sem cobrança real.
 * - [RNF-05]: Proteção de dados e consentimento LGPD.
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { motos } from '../data/motos.js'
import {
  LOJAS_RETIRADA,
  estimarPrazoRetirada,
  validarDadosCheckout,
  criarVoucherReserva,
  formatarMensagemWhatsAppVoucher,
} from '../domain/reservation.js'
import { formatarPreco, linkWhatsApp } from '../utils/formatters.js'
import '../styles/checkout.css'

export default function Checkout() {
  const {
    motoSelecionada,
    acessorios,
    removerAcessorio,
    simulacao,
    lead,
    registrarLead,
    voucherReserva,
    salvarVoucherReserva,
  } = useApp()

  // Se nenhuma moto foi selecionada, pega a primeira moto como padrão para não quebrar a tela
  const moto = motoSelecionada || motos[0]

  // Estado do formulário do comprador
  const [cliente, setCliente] = useState({
    nome: lead?.nome || '',
    telefone: lead?.telefone || '',
    email: lead?.email || '',
    cidade: lead?.cidade || '',
    documento: '',
  })

  // Loja de retirada selecionada (padrão: 1ª loja)
  const [lojaId, setLojaId] = useState(LOJAS_RETIRADA[0].id)

  // Forma de pagamento no checkout ('financiamento', 'consorcio', 'a_vista')
  const [formaPagamento, setFormaPagamento] = useState(
    simulacao?.modalidade || 'financiamento'
  )

  // Consentimento LGPD obrigatório [RNF-05]
  const [consentimentoLGPD, setConsentimentoLGPD] = useState(false)

  // Erros de validação
  const [erros, setErros] = useState({})

  // Feedback de cópia do código
  const [copiado, setCopiado] = useState(false)

  // Prazo estimado da loja conforme estoque da moto [RN-02]
  const prazoEstoque = useMemo(() => {
    return estimarPrazoRetirada(moto?.estoque)
  }, [moto])

  // Total do carrinho (moto + acessórios)
  const precoMoto = Number(moto?.preco) || 0
  const totalAcessorios = (acessorios || []).reduce((soma, item) => soma + (Number(item?.preco) || 0), 0)
  const valorTotalGeral = precoMoto + totalAcessorios

  function handleChangeCliente(campo, valor) {
    setCliente((ant) => ({ ...ant, [campo]: valor }))
    if (erros[campo]) {
      setErros((ant) => ({ ...ant, [campo]: null }))
    }
  }

  // Submissão do Checkout Fictício [RF-08]
  function handleSubmitReserva(e) {
    e.preventDefault()

    const validacao = validarDadosCheckout({
      cliente,
      lojaId,
      consentimentoLGPD,
    })

    if (!validacao.valido) {
      setErros(validacao.erros)
      return
    }

    // Salvar o lead capturado no contexto compartilhado do grupo [RF-01]
    if (registrarLead) {
      registrarLead({
        ...cliente,
        interesse: `${moto.marca} ${moto.nome}`,
        consentimentoLGPD: true,
        data: new Date().toISOString(),
      })
    }

    // Gerar o Voucher Oficial de Reserva Fictícia [RF-08]
    const novoVoucher = criarVoucherReserva({
      moto,
      acessorios,
      simulacao,
      formaPagamento,
      cliente,
      lojaId,
    })

    if (salvarVoucherReserva) {
      salvarVoucherReserva(novoVoucher)
    }

    // Rola suavemente até o voucher gerado
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Copiar código do voucher
  function handleCopiarCodigo(codigo) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    }
  }

  // Enviar voucher por WhatsApp [RF-06]
  const linkWhatsAppVoucher = useMemo(() => {
    if (!voucherReserva) return ''
    const msg = formatarMensagemWhatsAppVoucher(voucherReserva)
    return linkWhatsApp(voucherReserva.retirada.whatsapp || '5511999887766', msg)
  }, [voucherReserva])

  // =========================================================================
  // SE O VOUCHER JÁ FOI GERADO: RENDERIZA O VOUCHER OFICIAL DE RESERVA [RF-08]
  // =========================================================================
  if (voucherReserva) {
    return (
      <div className="checkout-page">
        <div className="container voucher-container">
          {/* Alerta explícito de simulação fictícia [RN-06] */}
          <div className="voucher-alerta-ficticio" role="alert">
            🛡️ <strong>{voucherReserva.identificacaoSimulacao}</strong>
            <br />
            Nenhuma cobrança bancária real foi efetuada. Este comprovante é para demonstração
            acadêmica e apresentação do fluxo de fechamento.
          </div>

          {/* Cartão do Voucher Oficial */}
          <article className="voucher-card" id="comprovante-voucher">
            <header className="voucher-header">
              <div>
                <div className="voucher-marca">
                  MOTO<span>IMPORTS</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#A9BDE6' }}>
                  Voucher Oficial de Reserva Presencial
                </div>
              </div>

              <div className="voucher-codigo-box">
                <div className="voucher-codigo-label">Código da Reserva</div>
                <div className="voucher-codigo">{voucherReserva.codigo}</div>
                <span className="voucher-status-badge">RESERVA CONFIRMADA</span>
              </div>
            </header>

            <div className="voucher-corpo">
              <div className="voucher-grid-info">
                {/* Dados da Motocicleta */}
                <div className="voucher-secao">
                  <h4>Motocicleta Reservada</h4>
                  <p>
                    <strong>Modelo:</strong> {voucherReserva.moto.marca} {voucherReserva.moto.nome}
                  </p>
                  <p>
                    <strong>Categoria:</strong> {voucherReserva.moto.categoria} · {voucherReserva.moto.cilindrada} cc
                  </p>
                  <p>
                    <strong>Status de Estoque:</strong> {voucherReserva.moto.estoque}
                  </p>
                  <p>
                    <strong>Previsão de Liberação:</strong> {voucherReserva.retirada.prazoRetiradaTexto}
                  </p>
                </div>

                {/* Dados do Titular */}
                <div className="voucher-secao">
                  <h4>Titular da Reserva</h4>
                  <p>
                    <strong>Nome:</strong> {voucherReserva.cliente.nome}
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> {voucherReserva.cliente.telefone}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {voucherReserva.cliente.email}
                  </p>
                  <p>
                    <strong>Localidade:</strong> {voucherReserva.cliente.cidade}
                  </p>
                </div>

                {/* Loja de Retirada [RF-08] */}
                <div className="voucher-secao">
                  <h4>Loja Selecionada para Retirada</h4>
                  <p>
                    <strong>{voucherReserva.retirada.nomeLoja}</strong>
                  </p>
                  <p>{voucherReserva.retirada.endereco}</p>
                  <p>
                    <strong>Horário de Funcionamento:</strong> {voucherReserva.retirada.horarioFuncionamento}
                  </p>
                  <p>
                    <strong>Telefone do Hub:</strong> {voucherReserva.retirada.telefone}
                  </p>
                </div>

                {/* Resumo Financeiro */}
                <div className="voucher-secao">
                  <h4>Condições de Fechamento</h4>
                  <div className="voucher-resumo-financeiro">
                    <p>
                      <strong>Modalidade:</strong>{' '}
                      {voucherReserva.financeiro.formaPagamento === 'financiamento' && 'Financiamento Bancário Imediato'}
                      {voucherReserva.financeiro.formaPagamento === 'consorcio' && 'Consórcio Internacional'}
                      {voucherReserva.financeiro.formaPagamento === 'a_vista' && 'Pagamento All-Inclusive à Vista'}
                    </p>

                    {voucherReserva.financeiro.simulacaoDetalhada && (
                      <p>
                        <strong>Plano Escolhido:</strong> {voucherReserva.financeiro.simulacaoDetalhada.meses}x de{' '}
                        {formatarPreco(voucherReserva.financeiro.simulacaoDetalhada.resultadoAtivo.parcelaMensal)}
                      </p>
                    )}

                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Valor Total Consolidado:</strong>
                    </p>
                    <div className="voucher-valor-destaque">
                      {formatarPreco(voucherReserva.financeiro.valorTotalGeral)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acessórios Inclusos */}
              {voucherReserva.acessorios && voucherReserva.acessorios.length > 0 && (
                <div className="voucher-secao">
                  <h4>Acessórios Técnicos Inclusos ({voucherReserva.acessorios.length})</h4>
                  <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                    {voucherReserva.acessorios.map((ac) => (
                      <li key={ac.id}>
                        {ac.nome} — {formatarPreco(ac.preco)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rodapé de Autenticação */}
              <div className="voucher-rodape-autenticacao">
                <div>
                  Emitido em: {new Date(voucherReserva.dataCriacao).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(voucherReserva.dataCriacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  <br />
                  Válido até: {new Date(voucherReserva.dataExpiracao).toLocaleDateString('pt-BR')} (7 dias corridos [RN-05])
                </div>
                <div className="voucher-codigo-barras">
                  ||| |||| | ||||| | |||
                </div>
              </div>
            </div>
          </article>

          {/* Botões de Ação do Voucher */}
          <div className="voucher-acoes">
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => window.print()}
            >
              🖨️ Imprimir / Salvar PDF
            </button>

            <button
              type="button"
              className="btn btn-contorno"
              onClick={() => handleCopiarCodigo(voucherReserva.codigo)}
            >
              {copiado ? '✓ Código Copiado!' : '📋 Copiar Código'}
            </button>

            <a
              href={linkWhatsAppVoucher}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-contorno"
              style={{ color: '#25d366', borderColor: 'rgba(37,211,102,0.5)' }}
            >
              💬 Enviar no WhatsApp
            </a>

            <button
              type="button"
              className="btn btn-contorno"
              onClick={() => salvarVoucherReserva(null)}
            >
              Nova Reserva
            </button>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FLUXO DO CHECKOUT (FORMULÁRIO, LOJAS E CARRINHO)
  // =========================================================================
  return (
    <div className="checkout-page">
      <div className="container">
        <header className="checkout-header">
          <span className="checkout-tag">RF-08 · Módulo Santos</span>
          <h1>Checkout de Reserva com Retirada em Loja</h1>
          <p>
            Finalize sua simulação de compra com transparência all-inclusive. Escolha a concessionária
            autorizada mais conveniente e emita seu Voucher Oficial de Reserva.
          </p>
        </header>

        <form onSubmit={handleSubmitReserva} className="checkout-grade" noValidate>
          {/* LADO ESQUERDO: ETAPAS DO CHECKOUT */}
          <div>
            {/* ETAPA 1: ESCOLHA DA LOJA DE RETIRADA [RF-08] */}
            <section className="checkout-card">
              <h2 className="checkout-card-titulo">
                <span>📍 1. Escolha a Loja de Retirada Presencial</span>
              </h2>
              <div className="checkout-lojas-lista">
                {LOJAS_RETIRADA.map((loja) => {
                  const selecionada = lojaId === loja.id
                  return (
                    <label
                      key={loja.id}
                      className={`checkout-loja-opcao ${selecionada ? 'selecionada' : ''}`}
                    >
                      <input
                        type="radio"
                        name="lojaRetirada"
                        value={loja.id}
                        checked={selecionada}
                        onChange={() => setLojaId(loja.id)}
                      />
                      <div className="checkout-loja-detalhes">
                        <div className="checkout-loja-nome">{loja.nome}</div>
                        <div className="checkout-loja-endereco">{loja.endereco}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ice-muted)', marginTop: '0.2rem' }}>
                          Horário: {loja.horario} · Tel: {loja.telefone}
                        </div>
                        <span className="checkout-loja-prazo">
                          ⏱️ {prazoEstoque.prazoTexto}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
              {erros.lojaId && <div className="checkout-erro-msg">{erros.lojaId}</div>}
            </section>

            {/* ETAPA 2: FORMA DE PAGAMENTO DA RESERVA */}
            <section className="checkout-card">
              <h2 className="checkout-card-titulo">
                <span>💳 2. Condição de Pagamento Selecionada</span>
              </h2>

              <div className="checkout-formas-pagamento">
                <button
                  type="button"
                  className={`checkout-forma-btn ${formaPagamento === 'financiamento' ? 'ativo' : ''}`}
                  onClick={() => setFormaPagamento('financiamento')}
                >
                  Financiamento Bancário
                </button>

                <button
                  type="button"
                  className={`checkout-forma-btn ${formaPagamento === 'consorcio' ? 'ativo' : ''}`}
                  onClick={() => setFormaPagamento('consorcio')}
                >
                  Consórcio Internacional
                </button>

                <button
                  type="button"
                  className={`checkout-forma-btn ${formaPagamento === 'a_vista' ? 'ativo' : ''}`}
                  onClick={() => setFormaPagamento('a_vista')}
                >
                  À Vista / Sinal
                </button>
              </div>

              {simulacao && formaPagamento !== 'a_vista' && (
                <div style={{ fontSize: '0.9rem', color: 'var(--azul-claro)' }}>
                  ✓ Plano vinculado da simulação: <strong>{simulacao.meses}x</strong> de{' '}
                  <strong>{formatarPreco(simulacao.resultadoAtivo.parcelaMensal)}</strong> com entrada de{' '}
                  <strong>{formatarPreco(simulacao.entrada)}</strong>.
                </div>
              )}
            </section>

            {/* ETAPA 3: DADOS DO COMPRADOR & LEAD CAPTURE [RF-01, RNF-05] */}
            <section className="checkout-card">
              <h2 className="checkout-card-titulo">
                <span>👤 3. Dados para Emissão do Voucher</span>
              </h2>

              <div className="checkout-form-grid">
                <div className="campo">
                  <label htmlFor="cli-nome">Nome Completo *</label>
                  <input
                    id="cli-nome"
                    type="text"
                    placeholder="Ex: Carlos Eduardo Santos"
                    value={cliente.nome}
                    onChange={(e) => handleChangeCliente('nome', e.target.value)}
                  />
                  {erros.nome && <span className="checkout-erro-msg">{erros.nome}</span>}
                </div>

                <div className="campo">
                  <label htmlFor="cli-tel">WhatsApp / Telefone com DDD *</label>
                  <input
                    id="cli-tel"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={cliente.telefone}
                    onChange={(e) => handleChangeCliente('telefone', e.target.value)}
                  />
                  {erros.telefone && <span className="checkout-erro-msg">{erros.telefone}</span>}
                </div>

                <div className="campo">
                  <label htmlFor="cli-email">E-mail para Envio do Comprovante *</label>
                  <input
                    id="cli-email"
                    type="email"
                    placeholder="carlos@exemplo.com.br"
                    value={cliente.email}
                    onChange={(e) => handleChangeCliente('email', e.target.value)}
                  />
                  {erros.email && <span className="checkout-erro-msg">{erros.email}</span>}
                </div>

                <div className="campo">
                  <label htmlFor="cli-cidade">Cidade / Estado *</label>
                  <input
                    id="cli-cidade"
                    type="text"
                    placeholder="São Paulo - SP"
                    value={cliente.cidade}
                    onChange={(e) => handleChangeCliente('cidade', e.target.value)}
                  />
                  {erros.cidade && <span className="checkout-erro-msg">{erros.cidade}</span>}
                </div>

                {/* Consentimento LGPD [RNF-05] */}
                <div className="checkout-lgpd-box">
                  <input
                    id="termos-lgpd"
                    type="checkbox"
                    checked={consentimentoLGPD}
                    onChange={(e) => {
                      setConsentimentoLGPD(e.target.checked)
                      if (erros.consentimentoLGPD) {
                        setErros((ant) => ({ ...ant, consentimentoLGPD: null }))
                      }
                    }}
                  />
                  <label htmlFor="termos-lgpd">
                    Autorizo a MotoImports a processar meus dados exclusivamente para contato e
                    emissão deste voucher de reserva presencial, em conformidade com a LGPD (Lei
                    13.709/2018).
                  </label>
                </div>
                {erros.consentimentoLGPD && (
                  <span className="checkout-erro-msg" style={{ gridColumn: '1 / -1' }}>
                    {erros.consentimentoLGPD}
                  </span>
                )}
              </div>
            </section>
          </div>

          {/* LADO DIREITO: RESUMO DO PEDIDO E FINALIZAÇÃO */}
          <div className="checkout-resumo-sticky">
            <div className="checkout-card">
              <h2 className="checkout-card-titulo">Resumo do Pedido</h2>

              {/* Moto selecionada */}
              <div className="checkout-moto-resumo">
                {moto.imagem ? (
                  <img
                    src={moto.imagem}
                    alt={moto.nome}
                    className="checkout-moto-foto"
                  />
                ) : (
                  <div
                    className="checkout-moto-foto"
                    style={{ display: 'grid', placeItems: 'center', fontWeight: 700 }}
                  >
                    {moto.cilindrada}cc
                  </div>
                )}
                <div className="checkout-moto-info">
                  <h4>{moto.marca} {moto.nome}</h4>
                  <p>{moto.categoria} · {formatarPreco(moto.preco)}</p>
                </div>
              </div>

              {/* Lista de Acessórios do Carrinho */}
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ice-muted)', margin: '0 0 0.4rem' }}>
                  Acessórios no Carrinho ({acessorios.length}):
                </p>
                {acessorios.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--ice-muted)', fontStyle: 'italic', margin: '0 0 1rem' }}>
                    Nenhum acessório adicionado.
                  </p>
                ) : (
                  <div className="checkout-itens-carrinho">
                    {acessorios.map((item) => (
                      <div key={item.id} className="checkout-item-carrinho">
                        <span>{item.nome}</span>
                        <div>
                          <strong>{formatarPreco(item.preco)}</strong>
                          <button
                            type="button"
                            className="checkout-btn-remover-item"
                            onClick={() => removerAcessorio(item.id)}
                            title="Remover acessório"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totalizador Geral */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--ice-muted)', fontSize: '0.9rem' }}>
                  <span>Motocicleta:</span>
                  <strong>{formatarPreco(precoMoto)}</strong>
                </div>

                {totalAcessorios > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--ice-muted)', fontSize: '0.9rem' }}>
                    <span>Acessórios:</span>
                    <strong>{formatarPreco(totalAcessorios)}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '1.2rem', color: '#ffffff' }}>
                  <span>Valor Total:</span>
                  <strong style={{ color: 'var(--azul-claro)' }}>{formatarPreco(valorTotalGeral)}</strong>
                </div>
              </div>

              {/* Botão de Conclusão */}
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="checkout-btn-finalizar"
                >
                  Confirmar Reserva & Gerar Voucher 🎟️
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  to={`/simulador?moto=${moto.id}`}
                  style={{ fontSize: '0.85rem', color: 'var(--ice-muted)' }}
                >
                  ← Ajustar parcelas no Simulador
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
