import { describe, it, expect } from 'vitest'
import {
  validarLimitesEntrada,
  calcularFinanciamento,
  calcularConsorcio,
  simularOperacao,
  PARAMETROS_FINANCEIROS,
} from './financing.js'

describe('Módulo de Financiamento [RF-07, RN-03, RN-04, RN-07]', () => {
  const motoTeste = {
    id: 'ducati-panigale-v2',
    nome: 'Panigale V2',
    marca: 'Ducati',
    preco: 100000,
  }

  describe('validarLimitesEntrada [RN-04]', () => {
    it('deve validar com sucesso quando a entrada estiver na faixa permitida (20% a 80%)', () => {
      const resultado = validarLimitesEntrada(100000, 30000, 'financiamento')
      expect(resultado.valida).toBe(true)
      expect(resultado.entradaMinima).toBe(20000)
      expect(resultado.entradaMaxima).toBe(80000)
    })

    it('deve rejeitar entrada menor que o piso de 20%', () => {
      const resultado = validarLimitesEntrada(100000, 15000, 'financiamento')
      expect(resultado.valida).toBe(false)
      expect(resultado.mensagem).toContain('entrada mínima')
    })

    it('deve rejeitar entrada maior que o teto de 80%', () => {
      const resultado = validarLimitesEntrada(100000, 85000, 'financiamento')
      expect(resultado.valida).toBe(false)
      expect(resultado.mensagem).toContain('entrada máxima')
    })

    it('deve tratar entradas não numéricas ou nulas', () => {
      const resultado = validarLimitesEntrada(100000, NaN, 'financiamento')
      expect(resultado.valida).toBe(false)
    })
  })

  describe('calcularFinanciamento [RN-03]', () => {
    it('deve calcular corretamente a parcela usando Tabela Price para 48 meses', () => {
      const saldoDevedor = 80000 // 100k - 20k
      const resultado = calcularFinanciamento({
        saldoDevedor,
        meses: 48,
        taxaMensal: 0.0149,
      })

      expect(resultado.parcelaMensal).toBeGreaterThan(0)
      // Para 80.000 a 1,49% em 48x via Tabela Price, a parcela exata é R$ 2.344,99
      expect(resultado.parcelaMensal).toBeCloseTo(2344.99, 1)
    })

    it('deve suportar todos os prazos obrigatórios de 12x a 72x', () => {
      const prazos = [12, 24, 36, 48, 60, 72]
      prazos.forEach((meses) => {
        const res = calcularFinanciamento({ saldoDevedor: 50000, meses })
        expect(res.parcelaMensal).toBeGreaterThan(0)
        expect(res.totalFinanciadoComJuros).toBeGreaterThan(50000)
      })
    })

    it('deve retornar zeros para saldo devedor zerado ou negativo', () => {
      const res = calcularFinanciamento({ saldoDevedor: 0, meses: 48 })
      expect(res.parcelaMensal).toBe(0)
      expect(res.totalJuros).toBe(0)
    })
  })

  describe('calcularConsorcio [RN-03]', () => {
    it('deve calcular o consórcio sem juros bancários, cobrando taxa administrativa diluída', () => {
      const resultado = calcularConsorcio({
        valorBem: 100000,
        lanceEntrada: 20000,
        meses: 48,
        taxaAdminTotal: 0.12,
        fundoReserva: 0.02,
      })

      // Custo Total = 100.000 + 12.000 + 2.000 = 114.000
      // Saldo restante após lance de 20.000 = 94.000
      // Parcela em 48x = 94.000 / 48 = ~1.958,33
      expect(resultado.custoTaxaAdmin).toBe(12000)
      expect(resultado.parcelaMensal).toBeCloseTo(1958.33, 0)
      expect(resultado.totalPagoConsorcio).toBeCloseTo(114000, 0)
    })
  })

  describe('simularOperacao [RF-07, RN-07]', () => {
    const acessorios = [
      { id: '1', nome: 'Escapamento Akrapovic', preco: 8000 },
      { id: '2', nome: 'Protetor de Motor', preco: 2000 },
    ]

    it('deve incluir acessórios no financiamento recalculando o saldo e as parcelas [RN-07]', () => {
      const simComAcessorios = simularOperacao({
        moto: motoTeste,
        acessorios,
        incluirAcessoriosNoFinanciamento: true,
        meses: 48,
        percentualEntrada: 20,
      })

      const simSemAcessorios = simularOperacao({
        moto: motoTeste,
        acessorios,
        incluirAcessoriosNoFinanciamento: false,
        meses: 48,
        percentualEntrada: 20,
      })

      // Com acessórios inclusos, valor total é 110.000
      expect(simComAcessorios.valorTotalOperacao).toBe(110000)
      expect(simSemAcessorios.valorTotalOperacao).toBe(100000)

      // Parcela com acessórios inclusos deve ser maior
      expect(simComAcessorios.resultadoAtivo.parcelaMensal).toBeGreaterThan(
        simSemAcessorios.resultadoAtivo.parcelaMensal
      )
    })

    it('deve calcular a economia do consórcio em relação ao financiamento bancário', () => {
      const sim = simularOperacao({
        moto: motoTeste,
        modalidade: 'consorcio',
        meses: 48,
        percentualEntrada: 20,
      })

      expect(sim.economiaConsorcio).toBeGreaterThan(0)
      expect(sim.financiamento.totalGeral).toBeGreaterThan(sim.consorcio.totalGeral)
    })
  })
})
