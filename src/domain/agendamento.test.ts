import { describe, it, expect } from 'vitest'
import { criarAgendamentoSchema, dataIsoLocal, formatarDataIso } from './agendamento.ts'

const HOJE = '2026-10-23'
const schema = criarAgendamentoSchema(HOJE)

const valido = {
    servico: 'oleo',
    nome: 'Maria Silva',
    telefone: '(81) 99999-9999',
    moto: 'Honda CG 160, ano 2024',
    data: '2026-10-24',
    horario: '09:00',
    observacoes: '',
    consentimento: true,
}

function camposComErro(dados: unknown): string[] {
    const r = schema.safeParse(dados)
    return r.success ? [] : r.error.issues.map((i) => String(i.path[0]))
}

describe('dataIsoLocal / formatarDataIso', () => {
    it('usa o dia local, com zero à esquerda', () => {
        expect(dataIsoLocal(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    })

    it('formata a data para o padrão brasileiro', () => {
        expect(formatarDataIso('2026-10-23')).toBe('23/10/2026')
    })
})

describe('Pós-venda · criarAgendamentoSchema', () => {
    it('aceita um agendamento válido e deixa o telefone só com dígitos', () => {
        const r = schema.safeParse(valido)
        expect(r.success).toBe(true)
        if (r.success) expect(r.data.telefone).toBe('81999999999')
    })

    it('aceita agendar para hoje', () => {
        expect(schema.safeParse({ ...valido, data: HOJE }).success).toBe(true)
    })

    it.each([
        ['sem serviço', { servico: '' }, 'servico'],
        ['serviço inexistente', { servico: 'pintura' }, 'servico'],
        ['nome curto', { nome: 'Jo' }, 'nome'],
        ['telefone curto', { telefone: '999' }, 'telefone'],
        ['sem modelo da moto', { moto: ' ' }, 'moto'],
        ['sem data', { data: '' }, 'data'],
        ['data no passado', { data: '2026-10-22' }, 'data'],
        ['horário fora da lista', { horario: '12:00' }, 'horario'],
        ['sem horário', { horario: '' }, 'horario'],
        ['observação longa demais', { observacoes: 'x'.repeat(501) }, 'observacoes'],
        ['sem consentimento', { consentimento: false }, 'consentimento'],
    ])('rejeita: %s', (_nome, troca, campo) => {
        expect(camposComErro({ ...valido, ...troca })).toContain(campo)
    })

    it('mostra a mensagem certa para data passada', () => {
        const r = schema.safeParse({ ...valido, data: '2026-10-01' })
        expect(r.success).toBe(false)
        if (!r.success) expect(r.error.issues[0].message).toBe('Escolha uma data de hoje em diante.')
    })

    it('RF-10: rejeita horário que a oficina já tem ocupado', () => {
        const comOcupacao = criarAgendamentoSchema(HOJE, () => ['09:00'])
        const r = comOcupacao.safeParse(valido)
        expect(r.success).toBe(false)
        if (!r.success) {
            expect(r.error.issues[0].path[0]).toBe('horario')
            expect(r.error.issues[0].message).toBe('Esse horário já está ocupado. Escolha outro.')
        }
        expect(comOcupacao.safeParse({ ...valido, horario: '10:00' }).success).toBe(true)
    })

    it('RF-10: rejeita horário já agendado na sessão, só na mesma data', () => {
        const reservas = [{ data: '2026-10-24', horario: '09:00' }]
        const comReservas = criarAgendamentoSchema(HOJE, () => [], reservas)
        expect(comReservas.safeParse(valido).success).toBe(false)
        expect(comReservas.safeParse({ ...valido, data: '2026-10-25' }).success).toBe(true)
    })

    it('observações é opcional', () => {
        const { observacoes: _omitida, ...semObservacoes } = valido
        expect(schema.safeParse(semObservacoes).success).toBe(true)
    })
})