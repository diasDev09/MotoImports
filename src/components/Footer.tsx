import { Link } from 'react-router-dom'

const linkRodape = 'hover:underline focus-visible:outline-musgo-50'

export default function Footer() {
    return (
        <footer className="mt-16 bg-musgo-900 text-musgo-50">
            <div className="mx-auto max-w-site px-6 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-3 text-lg">Moto Imports</h3>
                        <p className="text-sm text-musgo-200">
                            Motos importadas de alta cilindrada, com preço fechado e acompanhamento até a retirada.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-3 text-lg">Navegue</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link className={linkRodape} to="/catalogo">Catálogo</Link></li>
                            <li><Link className={linkRodape} to="/simulador">Simulador</Link></li>
                            <li><Link className={linkRodape} to="/pos-venda">Oficina e boutique</Link></li>
                            <li><Link className={linkRodape} to="/#sobre">Sobre nós</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-3 text-lg">Fale com a gente</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link className={linkRodape} to="/contato">Receber proposta</Link></li>
                            <li><Link className={linkRodape} to="/checkout">Reservar uma moto</Link></li>
                        </ul>
                    </div>
                </div>

                <p className="mt-10 border-t border-musgo-600 pt-6 text-xs text-musgo-200">
                    © 2026 Moto Imports. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    )
}