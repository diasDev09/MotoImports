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

const estiloLink = 'flex min-h-11 items-center justify-center px-6 py-3 text-center text-sm'

export default function ProposalModal({ aberto, lead, contexto, aoFechar }: ProposalModalProps) {
    const mensagem = montarMensagemProposta(lead, contexto)
    const urlWhatsApp = montarUrlWhatsApp(mensagem, CONTATO_COMERCIAL.whatsapp)
    const urlEmail = montarUrlEmail(mensagem, contexto?.nomeMoto, CONTATO_COMERCIAL.email)

    return (
        <Modal aberto={aberto} titulo="Sua proposta" aoFechar={aoFechar}>
            <p className="text-sm text-suave">
                Confira a mensagem e escolha como enviar para a nossa equipe.
            </p>
            <pre className="mt-3 whitespace-pre-wrap border-2 border-linha p-4 font-sans text-sm">
                {mensagem}
            </pre>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                    href={urlWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${estiloLink} botao`}
                >
                    Enviar pelo WhatsApp
                </a>
                <a
                    href={urlEmail}
                    className={`${estiloLink} botao-vazado`}
                >
                    Enviar por e-mail
                </a>
            </div>
        </Modal>
    )
}