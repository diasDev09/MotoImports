import { useState } from 'react'
import { RideVideoModal } from './RideVideoModal'

interface RideVideoButtonProps {
  videoUrl: string
  motorcycleName?: string
  label?: string
  className?: string
}

export function RideVideoButton({
  videoUrl,
  motorcycleName,
  label = 'Ver vídeo de pilotagem',
  className = '',
}: RideVideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={`mi-contact-button mi-contact-button--secondary ${className}`.trim()}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>

      <RideVideoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        videoUrl={videoUrl}
        motorcycleName={motorcycleName}
      />
    </>
  )
}
