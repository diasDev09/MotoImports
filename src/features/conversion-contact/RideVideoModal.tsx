import { useEffect } from 'react'

interface RideVideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  motorcycleName?: string
}

export function RideVideoModal({
  isOpen,
  onClose,
  videoUrl,
  motorcycleName,
}: RideVideoModalProps) {
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
        className="mi-contact-modal mi-contact-video-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ride-video-title"
      >
        <div className="mi-contact-modal__header">
          <div>
            <h2 id="ride-video-title">Vídeo de pilotagem</h2>
            {motorcycleName && <p>{motorcycleName}</p>}
          </div>
          <button
            type="button"
            className="mi-contact-close"
            aria-label="Fechar vídeo"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mi-contact-video-frame">
          <iframe
            src={videoUrl}
            title={`Vídeo de pilotagem${motorcycleName ? ` - ${motorcycleName}` : ''}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
