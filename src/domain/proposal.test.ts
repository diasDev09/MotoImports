import { describe, it, expect } from 'vitest'
import { montarMensagemProposta, montarUrlWhatsApp, montarUrlEmail } from './proposal.ts'

const lead = {
    nome: 'Maria Silva',
    telefone: '81999999999',
    email: 'maria@exemplo.com',
    cidade: 'Recife',
}

describe('RF-06 · montarMensagemProposta', () => {
    it('inclui os dados do cliente, com o telefone formatado', () => {
        const msg = montarMensagemProposta(lead)
        expect(msg).toContain('Meu nome é Maria Silva')
        expect(msg).toContain('Cidade: Recife.')
        expect(msg).toContain('WhatsApp: (81) 99999-9999.')
        expect(msg).toContain('E-mail: maria@exemplo.com.')
    })

    it('cita a moto e o preço quando existem', () => {
        const msg = montarMensagemProposta(lead, { nomeMoto: 'MT-07', preco: 'R$ 54.900' })
        expect(msg).toContain('uma proposta para a MT-07 (R$ 54.900).')
    })

    it('sem moto, não deixa buracos no texto', () => {
        expect(montarMensagemProposta(lead)).toContain('gostaria de receber uma proposta.')
    })
})

describe('RF-06 · montarUrlWhatsApp', () => {
    it('usa o número só com dígitos e codifica a mensagem', () => {
        expect(montarUrlWhatsApp('Olá, tudo bem?', '+55 (81) 99999-9999')).toBe(
            'https://wa.me/5581999999999?text=Ol%C3%A1%2C%20tudo%20bem%3F',
        )
    })

    it('sem número, abre o WhatsApp sem contato definido', () => {
        expect(montarUrlWhatsApp('oi')).toBe('https://wa.me/?text=oi')
        expect(montarUrlWhatsApp('oi', '   ')).toBe('https://wa.me/?text=oi')
    })
})

describe('RF-06 · montarUrlEmail', () => {
    it('monta mailto com assunto da moto e corpo codificado', () => {
        const url = montarUrlEmail('linha 1\nlinha 2', 'MT-07', 'vendas@exemplo.com')
        expect(url.startsWith('mailto:vendas@exemplo.com?subject=')).toBe(true)
        expect(url).toContain(encodeURIComponent('Solicitação de proposta - MT-07'))
        expect(url).toContain(`body=${encodeURIComponent('linha 1\nlinha 2')}`)
    })

    it('sem moto usa o assunto genérico; sem destinatário deixa o campo vazio', () => {
        const url = montarUrlEmail('x')
        expect(url.startsWith('mailto:?subject=')).toBe(true)
        expect(url).toContain(encodeURIComponent('Solicitação de proposta - MotoImports'))
    })
})