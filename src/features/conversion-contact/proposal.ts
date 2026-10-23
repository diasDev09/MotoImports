import type { LeadData, ProposalContext } from './types'

export function buildProposalMessage(
  lead: LeadData,
  context: ProposalContext = {},
) {
  const motorcycle = context.motorcycleName
    ? ` para a ${context.motorcycleName}`
    : ''
  const price = context.price ? ` (${context.price})` : ''

  return [
    `Olá! Meu nome é ${lead.name} e gostaria de receber uma proposta${motorcycle}${price}.`,
    `Cidade: ${lead.city}.`,
    `WhatsApp: ${lead.whatsapp}.`,
    `E-mail: ${lead.email}.`,
    'Gostaria de saber as condições de pagamento e a disponibilidade.',
  ].join('\n')
}

export function buildWhatsappUrl(message: string, whatsappNumber?: string) {
  const number = whatsappNumber?.replace(/\D/g, '') ?? ''
  const target = number ? `https://wa.me/${number}` : 'https://wa.me/'
  return `${target}?text=${encodeURIComponent(message)}`
}

export function buildEmailUrl(
  message: string,
  motorcycleName?: string,
  salesEmail?: string,
) {
  const subject = motorcycleName
    ? `Solicitação de proposta - ${motorcycleName}`
    : 'Solicitação de proposta - MotoImports'
  const recipient = salesEmail?.trim() ?? ''

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
}
