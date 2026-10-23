import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext.ts'
import { useAuth } from '../auth/AuthContext.ts'

interface ItemMenu {
    para: string
    texto: string
    botao?: boolean // o último item aparece como botão de papel com sombra vermelha
}

const links: ItemMenu[] = [
    { para: '/catalogo', texto: 'Catálogo' },
    { para: '/simulador', texto: 'Simulador' },
    { para: '/pos-venda', texto: 'Pós-venda' },
    { para: '/boutique', texto: 'Boutique' },
    { para: '/contato', texto: 'Contato', botao: true },
]

// link comum: alvo de toque de 44px; o ativo ganha um sublinhado de fita
const estiloLink = 'flex min-h-11 items-center px-3 text-sm font-bold hover:underline hover:decoration-2 hover:underline-offset-4'
const estiloAtivo = 'underline decoration-fita decoration-4 underline-offset-4'
const estiloBotao = 'botao flex min-h-11 items-center px-5 text-sm'

export default function Navbar() {
    // controla o menu no celular: aberto ou fechado
    const [aberto, setAberto] = useState(false)
    const fechar = () => setAberto(false)
    // RF-11: quantos acessórios já estão na reserva
    const { acessorios } = useApp()
    const itens = acessorios.length
    const { estado, usuario, entrar, sair } = useAuth()
    const primeiroNome = usuario?.nome.split(' ')[0]

    return (
        <header className="sticky top-0 z-50 border-b-2 border-dashed border-cimento bg-tinta/95">
            {/* link para quem navega pelo teclado pular o menu: só aparece ao receber foco */}
            <a
                href="#conteudo"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-papel focus:px-4 focus:py-2 focus:font-bold focus:text-tinta"
            >
                Ir para o conteúdo
            </a>

            <nav
                className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-2 px-6 py-3"
                aria-label="Principal"
            >
                {/* etiqueta de papel colada, levemente torta */}
                <Link
                    to="/"
                    onClick={fechar}
                    className="-rotate-2 bg-papel px-3 py-1 font-display text-xl font-bold text-tinta shadow-[3px_3px_0_var(--color-sangue)]"
                >
                    Moto<span> Imports</span>
                </Link>

                <button
                    type="button"
                    className="botao-vazado min-h-11 px-4 py-2 text-sm md:hidden"
                    aria-expanded={aberto}
                    aria-controls="menu-principal"
                    onClick={() => setAberto(!aberto)}
                >
                    {aberto ? 'Fechar' : 'Menu'}
                </button>

                <ul
                    id="menu-principal"
                    className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 pb-3 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:pb-0`}
                >
                    {links.map((l) => (
                        <li key={l.para}>
                            <NavLink
                                to={l.para}
                                onClick={fechar}
                                className={({ isActive }) =>
                                    l.botao ? estiloBotao : `${estiloLink} ${isActive ? estiloAtivo : ''}`
                                }
                            >
                                {l.texto}
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <NavLink
                            to="/checkout"
                            onClick={fechar}
                            aria-label={itens > 0 ? `Reserva, ${itens} ${itens === 1 ? 'acessório' : 'acessórios'}` : 'Reserva'}
                            className={({ isActive }) => `${estiloLink} ${isActive ? estiloAtivo : ''}`}
                        >
                            Reserva
                            {itens > 0 && (
                                <span aria-hidden="true" className="ml-2 bg-sangue px-2 py-0.5 text-xs text-papel">
                                    {itens}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    {/* "Sobre nós" é uma seção da Home, por isso usa âncora e não uma rota */}
                    <li>
                        <Link to="/#sobre" onClick={fechar} className={estiloLink}>
                            Sobre nós
                        </Link>
                    </li>
                    {/* conta: quem não entrou vê "Entrar"; quem entrou vê o nome e "Sair" */}
                    {estado === 'anonimo' && (
                        <li>
                            <button type="button" onClick={() => void entrar()} className="botao-vazado min-h-11 px-4 text-sm">
                                Entrar
                            </button>
                        </li>
                    )}
                    {estado === 'logado' && (
                        <li className="flex items-center gap-3">
                            <span className="text-sm text-suave">Olá, {primeiroNome}</span>
                            <button type="button" onClick={() => void sair()} className="botao-vazado min-h-11 px-4 text-sm">
                                Sair
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}
