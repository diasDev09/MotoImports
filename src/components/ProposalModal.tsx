import Modal from './Modal.tsx'
import { montarMensagemProposta, montarUrlEmail, montarUrlWhatsApp } from '../domain/proposal.ts'
import type { ContextoProposta } from '../domain/proposal.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import { CONTATO_COMERCIAL } from '../data/contato.ts'

// RF-06: mostra a proposta montada e deixa a pessoa enviar por WhatsApp ou e-mail
// (ProposalModal da v1, da Mylena).
interface ProposalModalProps {
    aberto: boolean
    lead: LeadRegistrado
    contexto?: ContextoProposta
    aoFechar: () => void
}

const estiloLink =
    'rounded-lg px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide'

export default function ProposalModal({ aberto, lead, contexto, aoFechar }: ProposalModalProps) {
    const mensagem = montarMensagemProposta(lead, contexto)
    const urlWhatsApp = montarUrlWhatsApp(mensagem, CONTATO_COMERCIAL.whatsapp)
    const urlEmail = montarUrlEmail(mensagem, contexto?.nomeMoto, CONTATO_COMERCIAL.email)

    return (
        <Modal aberto={aberto} titulo="Sua proposta" aoFechar={aoFechar}>
            <p className="text-sm text-musgo-600">
                Confira a mensagem e escolha como enviar para a nossa equipe.
            </p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-musgo-400 bg-white p-4 font-sans text-sm">
                {mensagem}
            </pre>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                    href={urlWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${estiloLink} bg-musgo-900 text-white hover:bg-musgo-600`}
                >
                    Enviar pelo WhatsApp
                </a>
                <a
                    href={urlEmail}
                    className={`${estiloLink} border border-musgo-900 text-musgo-900 hover:bg-musgo-200`}
                >
                    Enviar por e-mail
                </a>
            </div>
        </Modal>
    )
}