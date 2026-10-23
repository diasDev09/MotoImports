import { Link } from 'react-router-dom'

interface PlaceholderProps {
    titulo: string
    mensagem?: string
}

export default function Placeholder({
    titulo,
    mensagem = 'Esta página está em construção.',
}: PlaceholderProps) {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-site px-6">
                <h1 className="text-5xl">{titulo}</h1>
                <p className="mt-3 text-suave">{mensagem}</p>
                <Link
                    to="/"
                    className="mt-6 inline-block botao-vazado px-5 py-2 text-sm font-bold "
                >
                    Voltar ao início
                </Link>
            </div>
        </section>
    )
}