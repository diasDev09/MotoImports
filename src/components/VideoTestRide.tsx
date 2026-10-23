import { useState } from 'react'
import Modal from './Modal.tsx'

// RF-05: vídeo de test-ride em modal (RideVideoButton + RideVideoModal da v1, da Mylena).
// O iframe só existe com o modal aberto: fechar interrompe o vídeo e evita carregar o player à toa.
interface VideoTestRideProps {
    urlVideo: string // URL de embed, ex.: https://www.youtube-nocookie.com/embed/ID
    titulo?: string
}

export default function VideoTestRide({ urlVideo, titulo = 'Test-ride em vídeo' }: VideoTestRideProps) {
    const [aberto, setAberto] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setAberto(true)}
                className="botao-vazado min-h-11 px-6 py-3 text-sm"
            >
                ▶ Ver test-ride
            </button>

            <Modal aberto={aberto} titulo={titulo} aoFechar={() => setAberto(false)}>
                <div className="aspect-video w-full">
                    <iframe
                        src={urlVideo}
                        title={titulo}
                        className="size-full"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </Modal>
        </>
    )
}