import { describe, it, expect } from 'vitest'
import { HORARIOS } from '../data/posVenda.ts'
import { agendaSimulada, horarioOcupado, horariosLivres } from './agenda.ts'

const nenhum = () => [] as string[]

describe('RF-10 · agendaSimulada', () => {
    it('é a mesma para a mesma data', () => {
        expect(agendaSimulada('2026-10-24')).toEqual(agendaSimulada('2026-10-24'))
    })

    it('ocupa 2 dos 8 horários, todos da lista oficial', () => {
        const ocupados = agendaSimulada('2026-10-24')
        expect(ocupados).toHaveLength(2)
        ocupados.forEach((h) => expect(HORARIOS).toContain(h))
    })

    it('varia de um dia para outro', () => {
        const dias = ['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27']
        const resultados = new Set(dias.map((d) => agendaSimulada(d).join(',')))
        expect(resultados.size).toBeGreaterThan(1)
    })
})

describe('RF-10 · horarioOcupado e horariosLivres', () => {
    it('sem nada ocupado, todos os horários estão livres', () => {
        expect(horariosLivres('2026-10-24', nenhum)).toEqual([...HORARIOS])
    })

    it('o que a oficina já tem fica ocupado', () => {
        const ocupacao = () => ['09:00']
        expect(horarioOcupado('2026-10-24', '09:00', ocupacao)).toBe(true)
        expect(horariosLivres('2026-10-24', ocupacao)).not.toContain('09:00')
    })

    it('o que foi agendado na sessão também fica ocupado, só naquela data', () => {
        const reservas = [{ data: '2026-10-24', horario: '10:00' }]
        expect(horarioOcupado('2026-10-24', '10:00', nenhum, reservas)).toBe(true)
        expect(horarioOcupado('2026-10-25', '10:00', nenhum, reservas)).toBe(false)
    })

    it('dia lotado não tem horário livre', () => {
        const lotado = () => [...HORARIOS]
        expect(horariosLivres('2026-10-24', lotado)).toEqual([])
    })
})