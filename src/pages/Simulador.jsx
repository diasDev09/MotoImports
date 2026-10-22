/**
 * MOTOIMPORTS — Página do Simulador de Financiamento & Consórcio
 * Responsável: Santos
 * 
 * RASTREABILIDADE:
 * - [RF-07]: Simulador de financiamento e consórcio (12x a 72x, entrada, parcelas).
 * - [RF-11]: Acessórios técnicos com opção de incluir no financiamento.
 * - [RN-03]: Cálculo de parcelas parametrizado (Tabela Price vs Consórcio).
 * - [RN-04]: Entrada mínima e máxima (20% a 80%).
 * - [RN-07]: Acessórios incluídos somam ao valor financiado e recalculam parcelas.
 * - [DoD]: Alternância sem perder valores, validação declarativa, responsividade.
 */

import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { motos } from '../data/motos.js'
import { ACESSORIOS_TECNICOS } from '../data/acessorios.js'
import {
  simularOperacao,
  PARAMETROS_FINANCEIROS,
} from '../domain/financing.js'
import { formatarPreco, linkWhatsApp } from '../utils/formatters.js'
import '../styles/simulator.css'

export default function Simulador() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    motoSelecionada,
    selecionarMoto,
    acessorios,
    adicionarAcessorio,
    removerAcessorio,
    salvarSimulacao,
  } = useApp()

  // 1. Identificar a moto ativa (do contexto, de query param ?moto= ou fallback para a 1ª moto)
  const motoAtiva = useMemo(() => {
    const motoIdParam = searchParams.get('moto')
    if (motoIdParam) {
      const encontrada = motos.find((m) => m.id === motoIdParam)
      if (encontrada) return encontrada
    }
    if (motoSelecionada) return motoSelecionada
    return motos[0] // Fallback amigável para navegação direta
  }, [motoSelecionada, searchParams])

  // Manter o contexto sincronizado caso a moto tenha vindo do seletor ou query param
  useEffect(() => {
    if (motoAtiva && (!motoSelecionada || motoSelecionada.id !== motoAtiva.id)) {
      selecionarMoto(motoAtiva)
    }
  }, [motoAtiva, motoSelecionada, selecionarMoto])

  // 2. Estados de controle da simulação
  const [modalidade, setModalidade] = useState('financiamento') // 'financiamento' | 'consorcio'
  const [meses, setMeses] = useState(48)
  const [incluirAcessorios, setIncluirAcessorios] = useState(true)
  const [percentualEntrada, setPercentualEntrada] = useState(30) // Padrão de 30%

  // 3. Cálculo reativo da simulação pura de domínio [RF-07, RN-03, RN-04, RN-07]
  const simulacao = useMemo(() => {
    return simularOperacao({
      moto: motoAtiva,
      acessorios,
      incluirAcessoriosNoFinanciamento: incluirAcessorios,
      modalidade,
      meses,
      percentualEntrada,
    })
  }, [motoAtiva, acessorios, incluirAcessorios, modalidade, meses, percentualEntrada])

  // 4. Salvar simulação no AppContext para consumo do Checkout
  useEffect(() => {
    if (salvarSimulacao) {
      salvarSimulacao(simulacao)
    }
  }, [simulacao, salvarSimulacao])

  // Prazos disponíveis conforme regra
  const prazos = PARAMETROS_FINANCEIROS.financiamento.prazosDisponiveis

  // Troca de moto via select
  function handleTrocarMoto(evento) {
    const id = evento.target.value
    const encontrada = motos.find((m) => m.id === id)
    if (encontrada) {
      selecionarMoto(encontrada)
    }
  }

  // Navegar para o Checkout oficial de Santos [RF-08]
  function irParaCheckout() {
    if (salvarSimulacao) {
      salvarSimulacao(simulacao)
    }
    navigate('/checkout')
  }

  // Gerar link do WhatsApp com cotação completa [RF-06]
  const mensagemWhatsApp = useMemo(() => {
    if (!motoAtiva) return ''
    const parcelasText = `${simulacao.meses}x de ${formatarPreco(simulacao.resultadoAtivo.parcelaMensal)}`
    const entradaText = `${formatarPreco(simulacao.entrada)} (${simulacao.percentualEntrada}%)`
    const acessoriosText = acessorios.length > 0
      ? ` com ${acessorios.length} acessório(s) incluso(s)`
      : ''

    return (
      `Olá MotoImports! Gostaria de uma cotação para a *${motoAtiva.marca} ${motoAtiva.nome}*.\n` +
      `• Modalidade: *${simulacao.resultadoAtivo.nomeModalidade}*\n` +
      `• Entrada proposta: ${entradaText}\n` +
      `• Plano: *${parcelasText}*${acessoriosText}\n` +
      `• Valor total base: ${formatarPreco(simulacao.valorTotalOperacao)}\n` +
      `Poderiam validar as condições e disponibilidade para mim?`
    )
  }, [motoAtiva, simulacao, acessorios])

  const linkCotacaoWhatsApp = linkWhatsApp('5511999887766', mensagemWhatsApp)

  return (
    <div className="simulador-page">
      <div className="container">
        <header className="simulador-cabecalho">
          <span className="simulador-tag">RF-07 · Módulo Santos</span>
          <h1>Simulador de Financiamento & Consórcio</h1>
          <p>
            Alterne entre o crédito bancário com liberação rápida ou o consórcio com taxas
            reduzidas de 12x a 72x, customizando sua entrada e adicionando acessórios à cotação.
          </p>
        </header>

        <div className="simulador-grade">
          {/* PAINEL ESQUERDO: CONTROLES INTERATIVOS */}
          <div className="simulador-painel-controles">
            {/* Seletor de Motocicleta */}
            <section className="simulador-card">
              <h2 className="simulador-card-titulo">1. Motocicleta Selecionada</h2>
              <div className="simulador-seletor-moto">
                <label htmlFor="select-moto" className="sr-only">Escolha o modelo</label>
                <select
                  id="select-moto"
                  className="simulador-select"
                  value={motoAtiva?.id || ''}
                  onChange={handleTrocarMoto}
                >
                  {motos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.marca} {m.nome} — {formatarPreco(m.preco)} ({m.categoria})
                    </option>
                  ))}
                </select>

                {motoAtiva && (
                  <div className="simulador-moto-preview">
                    {motoAtiva.imagem ? (
                      <img
                        src={motoAtiva.imagem}
                        alt={motoAtiva.nome}
                        style={{ width: '80px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '80px',
                          height: '55px',
                          background: 'var(--navy)',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '4px',
                          fontWeight: 700,
                          color: 'var(--ice-muted)',
                        }}
                      >
                        {motoAtiva.cilindrada}cc
                      </div>
                    )}
                    <div className="simulador-moto-preview-info">
                      <div className="simulador-moto-preview-nome">
                        {motoAtiva.marca} {motoAtiva.nome}
                      </div>
                      <div className="simulador-moto-preview-preco">
                        {formatarPreco(motoAtiva.preco)}
                      </div>
                    </div>
                    <Link to={`/moto/${motoAtiva.id}`} className="simulador-btn-mini">
                      Ver Ficha
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Alternância de Modalidade [RF-07: sem perder valores] */}
            <section className="simulador-card">
              <h2 className="simulador-card-titulo">2. Modalidade de Pagamento</h2>
              <div className="simulador-abas-modalidade" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalidade === 'financiamento'}
                  className={`simulador-aba-btn ${modalidade === 'financiamento' ? 'ativa' : ''}`}
                  onClick={() => setModalidade('financiamento')}
                >
                  <span>Financiamento Bancário</span>
                  <span className="simulador-aba-badge">Liberação imediata (CDC)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={modalidade === 'consorcio'}
                  className={`simulador-aba-btn ${modalidade === 'consorcio' ? 'ativa' : ''}`}
                  onClick={() => setModalidade('consorcio')}
                >
                  <span>Consórcio Internacional</span>
                  <span className="simulador-aba-badge">Taxas zero de juros</span>
                </button>
              </div>
            </section>

            {/* Configuração da Entrada [RN-04: mín. 20% e máx. 80%] */}
            <section className="simulador-card">
              <div className="simulador-entrada-header">
                <h2 className="simulador-card-titulo" style={{ margin: 0 }}>
                  3. {modalidade === 'consorcio' ? 'Lance ou Entrada' : 'Valor da Entrada'}
                </h2>
                <div className="simulador-entrada-display">
                  <span className="simulador-entrada-valor">
                    {formatarPreco(simulacao.entrada)}
                  </span>
                  <span className="simulador-entrada-percentual">
                    {simulacao.percentualEntrada}%
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={percentualEntrada}
                onChange={(e) => setPercentualEntrada(Number(e.target.value))}
                className="simulador-slider"
                aria-label="Ajustar percentual de entrada"
              />

              <div className="simulador-limites-texto">
                <span>Mínimo 20% ({formatarPreco(simulacao.entradaMinima)})</span>
                <span>Máximo 80% ({formatarPreco(simulacao.entradaMaxima)})</span>
              </div>
            </section>

            {/* Seleção do Prazo [12x a 72x] */}
            <section className="simulador-card">
              <h2 className="simulador-card-titulo">4. Prazo de Pagamento (Meses)</h2>
              <div className="simulador-prazos-grade">
                {prazos.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`simulador-prazo-btn ${meses === p ? 'ativo' : ''}`}
                    onClick={() => setMeses(p)}
                  >
                    {p}x
                  </button>
                ))}
              </div>
            </section>

            {/* Acessórios Técnicos & Integração com o Carrinho [RF-11, RN-07] */}
            <section className="simulador-card">
              <h2 className="simulador-card-titulo">
                <span>5. Acessórios Técnicos do Carrinho</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--azul-claro)' }}>
                  {acessorios.length} item(ns)
                </span>
              </h2>

              <label className="simulador-acessorios-toggle">
                <input
                  type="checkbox"
                  checked={incluirAcessorios}
                  onChange={(e) => setIncluirAcessorios(e.target.checked)}
                />
                <div className="simulador-acessorios-toggle-texto">
                  <strong>Incluir acessórios no parcelamento [RN-07]</strong>
                  <small>
                    Dilui o valor dos acessórios selecionados nas parcelas mensais da moto.
                  </small>
                </div>
              </label>

              {/* Itens Atuais no Carrinho */}
              {acessorios.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ice-muted)', margin: '0 0 0.5rem' }}>
                    Itens adicionados para a {motoAtiva.nome}:
                  </p>
                  <div className="simulador-acessorios-lista">
                    {acessorios.map((item) => (
                      <div key={item.id} className="simulador-acessorio-item">
                        <div className="simulador-acessorio-info">
                          <span className="simulador-acessorio-nome">{item.nome}</span>
                          <span className="simulador-acessorio-categoria">
                            {item.categoria || 'Acessório'}
                          </span>
                        </div>
                        <div className="simulador-acessorio-acao">
                          <span className="simulador-acessorio-preco">
                            {formatarPreco(item.preco)}
                          </span>
                          <button
                            type="button"
                            className="simulador-btn-mini remover"
                            onClick={() => removerAcessorio(item.id)}
                            title="Remover acessório"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catálogo Rápido de Acessórios para Adicionar */}
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ice-muted)', margin: '0 0 0.5rem' }}>
                  Acessórios compatíveis disponíveis:
                </p>
                <div className="simulador-acessorios-lista">
                  {ACESSORIOS_TECNICOS.map((ac) => {
                    const jaNoCarrinho = acessorios.some((a) => a.id === ac.id)
                    return (
                      <div key={ac.id} className="simulador-acessorio-item">
                        <div className="simulador-acessorio-info">
                          <span className="simulador-acessorio-nome">{ac.nome}</span>
                          <span className="simulador-acessorio-categoria">
                            {ac.categoria} · {formatarPreco(ac.preco)}
                          </span>
                        </div>
                        <div className="simulador-acessorio-acao">
                          {jaNoCarrinho ? (
                            <span style={{ fontSize: '0.78rem', color: 'var(--estoque-verde)' }}>
                              ✓ No carrinho
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="simulador-btn-mini"
                              onClick={() => adicionarAcessorio(ac)}
                            >
                              + Adicionar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* PAINEL DIREITO: RESULTADO E CTA DE FECHAMENTO */}
          <div className="simulador-painel-resultado">
            <div className="simulador-resultado-card">
              <div className="simulador-resultado-topo">
                <span className="simulador-resultado-label">
                  Parcela Mensal Estimada ({simulacao.meses}x)
                </span>
                <div className="simulador-resultado-parcela">
                  {formatarPreco(simulacao.resultadoAtivo.parcelaMensal)}
                </div>
                <div className="simulador-resultado-condicao">
                  {simulacao.resultadoAtivo.nomeModalidade}
                </div>
              </div>

              {/* Detalhamento Financeiro */}
              <div className="simulador-resultado-tabela">
                <div className="simulador-resultado-linha">
                  <span>Preço da Motocicleta:</span>
                  <strong>{formatarPreco(simulacao.precoMoto)}</strong>
                </div>

                {simulacao.totalAcessorios > 0 && (
                  <div className="simulador-resultado-linha">
                    <span>Acessórios ({acessorios.length}):</span>
                    <strong>{formatarPreco(simulacao.totalAcessorios)}</strong>
                  </div>
                )}

                <div className="simulador-resultado-linha">
                  <span>Valor Total da Operação:</span>
                  <strong>{formatarPreco(simulacao.valorTotalOperacao)}</strong>
                </div>

                <div className="simulador-resultado-linha">
                  <span>Entrada ({simulacao.percentualEntrada}%):</span>
                  <strong>{formatarPreco(simulacao.entrada)}</strong>
                </div>

                <div className="simulador-resultado-linha">
                  <span>Saldo a Financiar / Amortizar:</span>
                  <strong>{formatarPreco(simulacao.saldoDevedor)}</strong>
                </div>

                <div className="simulador-resultado-linha">
                  <span>Taxa Aplicada:</span>
                  <span>{simulacao.resultadoAtivo.tipoCusto}</span>
                </div>

                <div className="simulador-resultado-linha">
                  <span>Previsão de Liberação:</span>
                  <span>{simulacao.resultadoAtivo.prazoEntrega}</span>
                </div>
              </div>

              {/* Banner de Vantagem / Economia Comparativa */}
              {modalidade === 'consorcio' && simulacao.economiaConsorcio > 0 && (
                <div className="simulador-banner-economia">
                  💡 <strong>Economia inteligente:</strong> Optando pelo consórcio, você economiza
                  aproximadamente <strong>{formatarPreco(simulacao.economiaConsorcio)}</strong> em
                  juros bancários em comparação ao financiamento tradicional!
                </div>
              )}

              {modalidade === 'financiamento' && (
                <div className="simulador-banner-economia" style={{ borderColor: 'rgba(0,132,209,0.4)', color: 'var(--ice)' }}>
                  ⚡ <strong>Aprovação Imediata:</strong> No financiamento bancário sua moto é faturada
                  assim que seu cadastro for aprovado, sem depender de sorteio mensal.
                </div>
              )}

              {/* Ações de Conversão */}
              <div className="simulador-acoes">
                <button
                  type="button"
                  className="simulador-btn-principal"
                  onClick={irParaCheckout}
                >
                  Reservar Veículo & Emitir Voucher →
                </button>

                <a
                  href={linkCotacaoWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="simulador-btn-whats"
                >
                  Receber Esta Cotação no WhatsApp
                </a>
              </div>

              <p className="simulador-aviso-simulacao">
                Simulação indicativa sujeita à análise de crédito ou formação de grupo de consórcio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
