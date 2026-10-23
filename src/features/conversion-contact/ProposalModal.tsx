import { useEffect, useMemo } from 'react'
import {
  buildEmailUrl,
  buildProposalMessage,
  buildWhatsappUrl,
} from './proposal'
import type { LeadData, ProposalContext } from './types'

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  lead: LeadData
  context?: ProposalContext
  whatsappNumber?: string
  salesEmail?: string
}

export function ProposalModal({
  isOpen,
  onClose,
  lead,
  context = {},
  whatsappNumber,
  salesEmail,
}: ProposalModalProps) {
  const message = useMemo(
    () => buildProposalMessage(lead, context),
    [lead, context],
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="mi-contact-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <div
        className="mi-contact-modal mi-contact-proposal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="proposal-title"
      >
        <div className="mi-contact-modal__header">
          <div>
            <h2 id="proposal-title">Receber proposta</h2>
            <p>Escolha como deseja enviar sua solicitação.</p>
          </div>
          <button
            type="button"
            className="mi-contact-close"
            aria-label="Fechar proposta"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mi-contact-proposal-preview">
          <strong>Mensagem pronta</strong>
          <p>{message}</p>
        </div>

        <div className="mi-contact-proposal-actions">
          <a
            className="mi-contact-action mi-contact-action--whatsapp"
            href={buildWhatsappUrl(message, whatsappNumber)}
            target="_blank"
            rel="noreferrer"
          >
            Enviar por WhatsApp
          </a>
          <a
            className="mi-contact-action mi-contact-action--email"
            href={buildEmailUrl(message, context.motorcycleName, salesEmail)}
          >
            Enviar por e-mail
          </a>
        </div>
      </div>
    </div>
  )
}
