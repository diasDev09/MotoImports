import { Link } from 'react-router-dom'

// alvo de toque de 44px e sublinhado no hover
const linkRodape = 'inline-flex min-h-11 items-center hover:underline hover:decoration-2 hover:underline-offset-4'

export default function Footer() {
    return (
        <footer className="escuro mt-20">
            <div className="mx-auto max-w-site px-6 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-3 text-2xl">Moto Imports</h3>
                        <p className="text-sm text-suave">
                            Motos importadas de alta cilindrada, com preço fechado e acompanhamento até a retirada.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-3 text-2xl">Navegue</h3>
                        <ul className="text-sm">
                            <li><Link className={linkRodape} to="/catalogo">Catálogo</Link></li>
                            <li><Link className={linkRodape} to="/simulador">Simulador</Link></li>
                            <li><Link className={linkRodape} to="/pos-venda">Oficina (pós-venda)</Link></li>
                            <li><Link className={linkRodape} to="/boutique">Boutique</Link></li>
                            <li><Link className={linkRodape} to="/#sobre">Sobre nós</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-3 text-2xl">Fale com a gente</h3>
                        <ul className="text-sm">
                            <li><Link className={linkRodape} to="/contato">Receber proposta</Link></li>
                            <li><Link className={linkRodape} to="/checkout">Reservar uma moto</Link></li>
                        </ul>
                    </div>
                </div>

                <p className="mt-10 border-t border-mist/40 pt-6 text-xs text-suave">
                    © 2026 Moto Imports. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    )
}