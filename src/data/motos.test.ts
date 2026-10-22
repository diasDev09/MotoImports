import { describe, it, expect } from 'vitest'
import {
    motos,
    CATEGORIAS,
    MODOS_PILOTAGEM,
    ESTOQUE,
    CILINDRADA_MIN,
    CILINDRADA_MAX,
} from './motos.ts'

describe('integridade dos dados das motos', () => {
    it('todos os ids são únicos', () => {
        const ids = motos.map((m) => m.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it.each(motos.map((m) => [m.id, m] as const))('%s tem dados válidos', (_id, m) => {
        expect(CATEGORIAS).toContain(m.categoria)
        expect(Object.keys(ESTOQUE)).toContain(m.estoque)
        expect(m.modos.length).toBeGreaterThan(0)
        m.modos.forEach((modo) => expect(MODOS_PILOTAGEM).toContain(modo))
        expect(m.precoBase).toBeGreaterThan(0)
    })

    it('o slider de cilindrada cobre todas as motos', () => {
        motos.forEach((m) => {
            expect(m.cilindrada).toBeGreaterThanOrEqual(CILINDRADA_MIN)
            expect(m.cilindrada).toBeLessThanOrEqual(CILINDRADA_MAX)
        })
    })
})