import { useState } from 'react'
import { LeadForm } from './LeadForm'
import { ProposalModal } from './ProposalModal'
import { RideVideoButton } from './RideVideoButton'
import type { LeadData, ProposalContext } from './types'
import './conversion-contact.css'

interface ConversionContactProps extends ProposalContext {
  videoUrl?: string
  whatsappNumber?: string
  salesEmail?: string
  showVideoButton?: boolean
  className?: string
}

export function ConversionContact({
  motorcycleName,
  price,
  videoUrl,
  whatsappNumber,
  salesEmail,
  showVideoButton = true,
  className = '',
}: ConversionContactProps) {
  const [lead, setLead] = useState<LeadData | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

  return (
    <div className={`mi-contact-card ${className}`.trim()}>
      {showVideoButton && videoUrl && (
        <div className="mi-contact-card__video-action">
          <RideVideoButton
            videoUrl={videoUrl}
            motorcycleName={motorcycleName}
          />
        </div>
      )}

      <LeadForm onLeadCreated={setLead} submitLabel="Validar dados" />

      <div className="mi-contact-card__proposal">
        <button
          type="button"
          className="mi-contact-button mi-contact-button--primary"
          disabled={!lead}
          onClick={() => setIsProposalOpen(true)}
        >
          Receber Proposta
        </button>
        {!lead && <span>Preencha o formulário para liberar a proposta.</span>}
      </div>

      {lead && (
        <ProposalModal
          isOpen={isProposalOpen}
          onClose={() => setIsProposalOpen(false)}
          lead={lead}
          context={{ motorcycleName, price }}
          whatsappNumber={whatsappNumber}
          salesEmail={salesEmail}
        />
      )}
    </div>
  )
}
