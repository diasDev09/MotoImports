import { describe, it, expect } from 'vitest'
import { ACESSORIOS_TECNICOS } from './acessorios.ts'
import { CATEGORIAS } from './motos.ts'

// Protege o catálogo de acessórios (RF-11), usado pelo simulador e pelo checkout.
describe('integridade do catálogo de acessórios', () => {
    it('todos os ids são únicos', () => {
        const ids = ACESSORIOS_TECNICOS.map((a) => a.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it.each(ACESSORIOS_TECNICOS.map((a) => [a.id, a] as const))('%s tem dados válidos', (_id, a) => {
        expect(a.nome).not.toBe('')
        expect(a.preco).toBeGreaterThan(0)
        expect(a.garantiaMeses).toBeGreaterThan(0)
        expect(a.compatibilidade.length).toBeGreaterThan(0)
        a.compatibilidade.forEach((c) => expect(CATEGORIAS).toContain(c))
    })

    it('cada categoria de moto tem ao menos um acessório compatível', () => {
        CATEGORIAS.forEach((cat) => {
            expect(ACESSORIOS_TECNICOS.some((a) => a.compatibilidade.includes(cat))).toBe(true)
        })
    })
})