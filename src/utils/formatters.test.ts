import { describe, it, expect } from 'vitest'
import { formatarPreco, formatarPrecoComCentavos, formatarCilindrada, linkWhatsApp } from './formatters.ts'

// o Intl usa espaço "não separável" entre R$ e o número; trocamos por espaço comum para comparar
const normalizar = (texto: string) => texto.replace(/\s/g, ' ')

describe('formatarPreco', () => {
    it('formata em reais, sem centavos', () => {
        expect(normalizar(formatarPreco(54900))).toBe('R$ 54.900')
        expect(normalizar(formatarPreco(1234567))).toBe('R$ 1.234.567')
    })

    it('formata zero', () => {
        expect(normalizar(formatarPreco(0))).toBe('R$ 0')
    })
})

describe('formatarPrecoComCentavos', () => {
    it('mostra os centavos (a boutique tem preços como R$ 599,90)', () => {
        expect(normalizar(formatarPrecoComCentavos(599.9))).toBe('R$ 599,90')
        expect(normalizar(formatarPrecoComCentavos(120))).toBe('R$ 120,00')
        expect(normalizar(formatarPrecoComCentavos(1299.9))).toBe('R$ 1.299,90')
    })
})

describe('formatarCilindrada', () => {
    it('usa ponto de milhar e a unidade cc', () => {
        expect(formatarCilindrada(1250)).toBe('1.250 cc')
        expect(formatarCilindrada(471)).toBe('471 cc')
    })
})

describe('linkWhatsApp', () => {
    it('monta o link com a mensagem codificada', () => {
        expect(linkWhatsApp('5581999999999', 'Olá, tudo bem?')).toBe(
            'https://wa.me/5581999999999?text=Ol%C3%A1%2C%20tudo%20bem%3F',
        )
    })
})