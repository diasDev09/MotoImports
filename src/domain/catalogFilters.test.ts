import { describe, it, expect } from 'vitest'
import { filtrarMotos, contarFiltrosAtivos } from './catalogFilters.ts'
import type { MotoFiltravel } from './catalogFilters.ts'

// massa de teste pequena e previsível (não depende do motos.js real)
const motos: (MotoFiltravel & { id: string })[] = [
    { id: 'sport-600', categoria: 'Sport', cilindrada: 600, modos: ['Rain', 'Road', 'Track'] },
    { id: 'sport-950', categoria: 'Sport', cilindrada: 950, modos: ['Road', 'Sport', 'Track'] },
    { id: 'naked-700', categoria: 'Naked', cilindrada: 700, modos: ['Rain', 'Road'] },
    { id: 'trail-1250', categoria: 'Trail/Adventure', cilindrada: 1250, modos: ['Road', 'Off-Road'] },
    { id: 'custom-1800', categoria: 'Custom', cilindrada: 1800, modos: ['Road'] },
]

const ids = (lista: { id: string }[]) => lista.map((m) => m.id)

describe('RF-03 · filtrarMotos', () => {
    it('sem filtros devolve todas as motos', () => {
        expect(filtrarMotos(motos, {})).toHaveLength(5)
    })

    it('filtra por categoria', () => {
        expect(ids(filtrarMotos(motos, { categoria: 'Sport' }))).toEqual(['sport-600', 'sport-950'])
    })

    it('filtra por modo de pilotagem', () => {
        expect(ids(filtrarMotos(motos, { modo: 'Track' }))).toEqual(['sport-600', 'sport-950'])
        expect(ids(filtrarMotos(motos, { modo: 'Off-Road' }))).toEqual(['trail-1250'])
    })

    it('filtra por faixa de cilindrada, com limites inclusivos', () => {
        expect(ids(filtrarMotos(motos, { cilindradaMin: 700, cilindradaMax: 1250 }))).toEqual([
            'sport-950',
            'naked-700',
            'trail-1250',
        ])
    })

    it('combina os filtros de forma cumulativa (AND)', () => {
        const r = filtrarMotos(motos, { categoria: 'Sport', modo: 'Rain', cilindradaMax: 800 })
        expect(ids(r)).toEqual(['sport-600'])
    })

    it('devolve lista vazia quando nada atende (a tela mostra "nenhum resultado")', () => {
        expect(filtrarMotos(motos, { categoria: 'Custom', modo: 'Track' })).toEqual([])
    })

    it('trata null como "sem filtro"', () => {
        expect(filtrarMotos(motos, { categoria: null, modo: null })).toHaveLength(5)
    })

    it('não altera a lista original', () => {
        const copia = [...motos]
        filtrarMotos(motos, { categoria: 'Sport' })
        expect(motos).toEqual(copia)
    })
})

describe('contarFiltrosAtivos', () => {
    const limites = { min: 300, max: 1900 }

    it('é zero quando está tudo no padrão', () => {
        expect(contarFiltrosAtivos({}, limites)).toBe(0)
        expect(contarFiltrosAtivos({ cilindradaMin: 300, cilindradaMax: 1900 }, limites)).toBe(0)
    })

    it('conta cada filtro que restringe de verdade', () => {
        expect(
            contarFiltrosAtivos({ categoria: 'Sport', modo: 'Road', cilindradaMax: 1000 }, limites),
        ).toBe(3)
    })
})