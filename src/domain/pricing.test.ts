import { describe, it, expect } from 'vitest'
import { calcularComposicaoPreco, calcularPrecoFinal } from './pricing.ts'
import type { ParametrosPrecificacao } from './pricing.ts'

// números redondos para conferir as contas à mão
const params: ParametrosPrecificacao = {
    freteInternacional: 1000,
    despachoAduaneiro: 500,
    aliquotaImpostoImportacao: 0.2,
    aliquotaImpostosFiscais: 0.1,
}

describe('RN-01 · calcularComposicaoPreco', () => {
    it('soma base + frete + despacho + impostos', () => {
        const c = calcularComposicaoPreco(10000, params)
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
        // 1000 + 500 + (1000 * 20% = 200) + (1200 * 10% = 120)
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
        ['frete negativo', () => calcularPrecoFinal(1000, { ...params, freteInternacional: -5 })],
    ])('rejeita %s', (_nome, chamada) => {
        expect(chamada).toThrow(RangeError)
    })
})