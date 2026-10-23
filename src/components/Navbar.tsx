import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

interface ItemMenu {
    para: string
    texto: string
    botao?: boolean // o último item aparece como botão escuro, como o "SIGN UP" do design
}

const links: ItemMenu[] = [
    { para: '/catalogo', texto: 'Catálogo' },
    { para: '/simulador', texto: 'Simulador' },
    { para: '/pos-venda', texto: 'Pós-venda' },
    { para: '/contato', texto: 'Contato', botao: true },
]

const estiloLink = 'block rounded-lg px-3 py-2 text-sm font-medium hover:bg-musgo-200'
const estiloBotao =
    'block rounded-lg bg-musgo-900 px-5 py-2 text-sm font-semibold text-white hover:bg-musgo-600'

export default function Navbar() {
    // controla o menu no celular: aberto ou fechado
    const [aberto, setAberto] = useState(false)
    const fechar = () => setAberto(false)

    return (
        <header className="sticky top-0 z-50 border-b border-musgo-200 bg-musgo-50/95 backdrop-blur">
            {/* link para quem navega pelo teclado pular o menu: só aparece ao receber foco */}
            <a
                href="#conteudo"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-lg focus:bg-musgo-900 focus:px-4 focus:py-2 focus:text-white"
            >
                Ir para o conteúdo
            </a>

            <nav
                className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-2 px-6 py-3"
                aria-label="Principal"
            >
                <Link to="/" onClick={fechar} className="font-display text-xl font-extrabold uppercase tracking-tight">
                    Moto<span className="text-musgo-600"> Imports</span>
                </Link>

                <button
                    type="button"
                    className="rounded-lg border border-musgo-600 px-4 py-2 text-sm font-semibold md:hidden"
                    aria-expanded={aberto}
                    aria-controls="menu-principal"
                    onClick={() => setAberto(!aberto)}
                >
                    {aberto ? 'Fechar' : 'Menu'}
                </button>

                <ul
                    id="menu-principal"
                    className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center md:gap-2`}
                >
                    {links.map((l) => (
                        <li key={l.para}>
                            <NavLink
                                to={l.para}
                                onClick={fechar}
                                className={({ isActive }) =>
                                    l.botao ? estiloBotao : `${estiloLink} ${isActive ? 'bg-musgo-200 font-semibold' : ''}`
                                }
                            >
                                {l.texto}
                            </NavLink>
                        </li>
                    ))}
                    {/* "Sobre nós" é uma seção da Home, por isso usa âncora e não uma rota */}
                    <li>
                        <Link to="/#sobre" onClick={fechar} className={estiloLink}>
                            Sobre nós
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}