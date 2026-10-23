import { describe, it, expect } from 'vitest'
import { calcularComposicaoPreco, calcularPrecoFinal, decomporPrecoFinal } from './pricing.ts'
import type { ParametrosPrecificacao, ComposicaoPreco } from './pricing.ts'
import { PARAMETROS_PRECIFICACAO } from '../data/parametros-precificacao.ts'
import { motos } from '../data/motos.ts'

// parâmetros de teste simples, para as contas darem números redondos
const params: ParametrosPrecificacao = {
    freteInternacional: 1000,
    despachoAduaneiro: 500,
    aliquotaImpostoImportacao: 0.2,
    aliquotaImpostosFiscais: 0.1,
}

const somaDasPartes = (c: ComposicaoPreco) =>
    c.base + c.frete + c.despacho + c.impostoImportacao + c.impostosFiscais

describe('RN-01 · calcularComposicaoPreco (da base para o final)', () => {
    it('soma base + frete + despacho + impostos', () => {
        const c = calcularComposicaoPreco(10000, params)
        expect(c.base).toBe(10000)
        expect(c.frete).toBe(1000)
        expect(c.despacho).toBe(500)
        expect(c.impostoImportacao).toBe(2200) // (10000 + 1000) * 20%
        expect(c.impostosFiscais).toBe(1320) // (10000 + 1000 + 2200) * 10%
        expect(c.total).toBe(10000 + 1000 + 500 + 2200 + 1320)
    })

    it('com tudo zerado, o preço final é o preço base', () => {
        const zero: ParametrosPrecificacao = {
            freteInternacional: 0,
            despachoAduaneiro: 0,
            aliquotaImpostoImportacao: 0,
            aliquotaImpostosFiscais: 0,
        }
        expect(calcularPrecoFinal(42900, zero)).toBe(42900)
    })

    it('base zero: os impostos ainda incidem sobre o frete', () => {
        // frete 1000 + despacho 500 + II (1000 * 20% = 200) + fiscais (1200 * 10% = 120)
        expect(calcularComposicaoPreco(0, params).total).toBe(1820)
    })

    it('mudar a alíquota muda o resultado (nada fixo no código)', () => {
        const a = calcularPrecoFinal(10000, params)
        const b = calcularPrecoFinal(10000, { ...params, aliquotaImpostoImportacao: 0.5 })
        expect(b).toBeGreaterThan(a)
    })

    it.each([
        ['preço base negativo', () => calcularPrecoFinal(-1, params)],
        ['preço base NaN', () => calcularPrecoFinal(Number.NaN, params)],
        ['preço base infinito', () => calcularPrecoFinal(Infinity, params)],
        ['frete negativo', () => calcularPrecoFinal(1000, { ...params, freteInternacional: -5 })],
        ['alíquota negativa', () => calcularPrecoFinal(1000, { ...params, aliquotaImpostosFiscais: -0.1 })],
    ])('rejeita %s', (_nome, chamada) => {
        expect(chamada).toThrow(RangeError)
    })
})

describe('RF-02 · decomporPrecoFinal (do final para as parcelas)', () => {
    it('desfaz o cálculo: recupera a base e as parcelas', () => {
        const c = decomporPrecoFinal(15020, params) // = calcularPrecoFinal(10000, params)
        expect(c).toEqual({
            base: 10000,
            frete: 1000,
            despacho: 500,
            impostoImportacao: 2200,
            impostosFiscais: 1320,
            total: 15020,
        })
    })

    it('o total devolvido é sempre o preço final recebido', () => {
        ;[15020, 54900, 98900.55, 169900].forEach((precoFinal) => {
            expect(decomporPrecoFinal(precoFinal, PARAMETROS_PRECIFICACAO).total).toBe(precoFinal)
        })
    })

    it('a soma das parcelas fecha com o total (até o centavo)', () => {
        const c = decomporPrecoFinal(98900, PARAMETROS_PRECIFICACAO)
        expect(somaDasPartes(c)).toBeCloseTo(c.total, 2)
    })

    it('ida e volta: base -> final -> base devolve a base', () => {
        const final = calcularPrecoFinal(31000, PARAMETROS_PRECIFICACAO)
        expect(decomporPrecoFinal(final, PARAMETROS_PRECIFICACAO).base).toBeCloseTo(31000, 1)
    })

    it('funciona para todas as motos do catálogo (base positiva e soma fechando)', () => {
        motos.forEach((m) => {
            const c = decomporPrecoFinal(m.preco, PARAMETROS_PRECIFICACAO)
            expect(c.base).toBeGreaterThan(0)
            expect(somaDasPartes(c)).toBeCloseTo(m.preco, 2)
        })
    })

    it('rejeita preço final menor que os custos fixos', () => {
        expect(() => decomporPrecoFinal(100, params)).toThrow(RangeError)
    })

    it('rejeita valores inválidos', () => {
        expect(() => decomporPrecoFinal(-1, params)).toThrow(RangeError)
        expect(() => decomporPrecoFinal(Number.NaN, params)).toThrow(RangeError)
    })
})