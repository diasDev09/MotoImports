import { describe, it, expect } from 'vitest'
import { leadSchema, somenteDigitos, formatarTelefone } from './lead.ts'

const valido = {
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    telefone: '(81) 99999-9999',
    cidade: 'Recife',
    consentimento: true,
}

// devolve a mensagem de erro de um campo (ou undefined se o campo está ok)
function erroDe(entrada: unknown, campo: string): string | undefined {
    const r = leadSchema.safeParse(entrada)
    if (r.success) return undefined
    return r.error.issues.find((i) => i.path[0] === campo)?.message
}

describe('somenteDigitos', () => {
    it('remove máscara e símbolos', () => {
        expect(somenteDigitos('(81) 99999-9999')).toBe('81999999999')
        expect(somenteDigitos('+55 81 3333-4444')).toBe('558133334444')
    })
})

describe('formatarTelefone (máscara)', () => {
    it.each([
        ['', ''],
        ['8', '8'],
        ['81', '81'],
        ['819', '(81) 9'],
        ['8133334444', '(81) 3333-4444'],
        ['81999999999', '(81) 99999-9999'],
    ])('"%s" vira "%s"', (entrada, saida) => {
        expect(formatarTelefone(entrada)).toBe(saida)
    })

    it('ignora letras e corta o que passa de 11 dígitos', () => {
        expect(formatarTelefone('(81) 9a9999-99999999')).toBe('(81) 99999-9999')
    })

    it('é idempotente: aplicar duas vezes dá o mesmo resultado', () => {
        const uma = formatarTelefone('81999999999')
        expect(formatarTelefone(uma)).toBe(uma)
    })
})

describe('RF-01 · leadSchema', () => {
    it('aceita um lead válido e normaliza o telefone para só dígitos', () => {
        const r = leadSchema.safeParse(valido)
        expect(r.success).toBe(true)
        if (r.success) expect(r.data.telefone).toBe('81999999999')
    })

    it('aceita telefone fixo (10 dígitos) e celular (11 dígitos)', () => {
        expect(leadSchema.safeParse({ ...valido, telefone: '8133334444' }).success).toBe(true)
        expect(leadSchema.safeParse({ ...valido, telefone: '81999999999' }).success).toBe(true)
    })

    it('aceita cidade com acento, espaço, hífen e apóstrofo curvo', () => {
        ;['São Paulo', 'Santa Bárbara d’Oeste', 'São Paulo - SP', 'Ji-Paraná'].forEach((cidade) => {
            expect(leadSchema.safeParse({ ...valido, cidade }).success).toBe(true)
        })
    })

    it('mensagem é opcional', () => {
        expect(leadSchema.safeParse({ ...valido, mensagem: 'Quero test ride' }).success).toBe(true)
    })

    it.each([
        ['nome vazio', { ...valido, nome: '' }, 'nome'],
        ['nome só com espaços', { ...valido, nome: '   ' }, 'nome'],
        ['nome de 1 letra', { ...valido, nome: 'A' }, 'nome'],
        ['e-mail sem @', { ...valido, email: 'maria.exemplo.com' }, 'email'],
        ['e-mail vazio', { ...valido, email: '' }, 'email'],
        ['cidade vazia', { ...valido, cidade: '' }, 'cidade'],
        ['cidade de 1 letra', { ...valido, cidade: 'A' }, 'cidade'],
        ['cidade com números', { ...valido, cidade: 'Recife 123' }, 'cidade'],
        ['telefone curto', { ...valido, telefone: '99999' }, 'telefone'],
        ['telefone com letras', { ...valido, telefone: 'abcdefghijk' }, 'telefone'],
        ['telefone longo demais', { ...valido, telefone: '819999999999' }, 'telefone'],
        ['mensagem acima de 500', { ...valido, mensagem: 'x'.repeat(501) }, 'mensagem'],
    ])('rejeita %s', (_nome, entrada, campo) => {
        expect(erroDe(entrada, campo)).toBeDefined()
    })

    it('RNF-05: rejeita quando o consentimento LGPD não foi dado', () => {
        expect(erroDe({ ...valido, consentimento: false }, 'consentimento')).toMatch(/aceite/i)
    })

    it('aponta todos os campos com problema de uma vez', () => {
        const r = leadSchema.safeParse({ nome: '', email: '', telefone: '', cidade: '', consentimento: false })
        expect(r.success).toBe(false)
        if (!r.success) {
            const campos = r.error.issues.map((i) => i.path[0])
            expect(campos).toEqual(expect.arrayContaining(['nome', 'email', 'telefone', 'cidade', 'consentimento']))
        }
    })
})