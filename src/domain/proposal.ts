// RF-06: proposta enviada por WhatsApp ou e-mail (porte da v1, da Mylena).
// Funções puras: montam o texto e os links. Quem abre o link é o navegador.
import { formatarTelefone } from './lead.ts'
import type { LeadRegistrado } from './lead.ts'
import { linkWhatsApp } from '../utils/formatters.ts'

export interface ContextoProposta {
    nomeMoto?: string
    preco?: string // já formatado, ex.: "R$ 54.900"
}

type DadosProposta = Pick<LeadRegistrado, 'nome' | 'telefone' | 'email' | 'cidade'>

export function montarMensagemProposta(lead: DadosProposta, contexto: ContextoProposta = {}): string {
    const moto = contexto.nomeMoto ? ` para a ${contexto.nomeMoto}` : ''
    const preco = contexto.preco ? ` (${contexto.preco})` : ''

    return [
        `Olá! Meu nome é ${lead.nome} e gostaria de receber uma proposta${moto}${preco}.`,
        `Cidade: ${lead.cidade}.`,
        `WhatsApp: ${formatarTelefone(lead.telefone)}.`,
        `E-mail: ${lead.email}.`,
        'Gostaria de saber as condições de pagamento e a disponibilidade.',
    ].join('\n')
}

// numero: com DDI e DDD (pode ter máscara). Sem número, o WhatsApp deixa a pessoa escolher o contato.
export function montarUrlWhatsApp(mensagem: string, numero?: string): string {
    const digitos = numero?.replace(/\D/g, '') ?? ''
    if (digitos) return linkWhatsApp(digitos, mensagem)
    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`
}

export function montarUrlEmail(mensagem: string, nomeMoto?: string, emailComercial?: string): string {
    const assunto = nomeMoto
        ? `Solicitação de proposta - ${nomeMoto}`
        : 'Solicitação de proposta - MotoImports'
    const destinatario = emailComercial?.trim() ?? ''

    return `mailto:${destinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`
}