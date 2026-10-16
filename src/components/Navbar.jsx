import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { para: '/catalogo', texto: 'Catálogo' },
  { para: '/simulador', texto: 'Simulador' },
  { para: '/pos-venda', texto: 'Pós-venda' },
  { para: '/contato', texto: 'Contato' },
]

export default function Navbar() {
  // controla o menu no celular: aberto ou fechado
  const [aberto, setAberto] = useState(false)

  return (
    <header className="navbar">
      {/* link para quem navega pelo teclado pular o menu, só aparece ao focar */}
      <a href="#conteudo" className="sr-only">
        Ir para o conteúdo
      </a>
      <nav className="container navbar-interna" aria-label="Principal">
        <Link to="/" className="marca" onClick={() => setAberto(false)}>
          Moto<span> Imports</span>
        </Link>

        <button
          type="button"
          className="menu-botao"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? 'Fechar' : 'Menu'}
        </button>

        <ul id="menu-principal" className={aberto ? 'menu aberto' : 'menu'}>
          {links.map((l) => (
            <li key={l.para}>
              <NavLink
                to={l.para}
                onClick={() => setAberto(false)}
                className={({ isActive }) => (isActive ? 'ativo' : '')}
              >
                {l.texto}
              </NavLink>
            </li>
          ))}
          {/* "Sobre nós" é uma seção da Home, por isso usa âncora e não uma rota */}
          <li>
            <Link to="/#sobre" onClick={() => setAberto(false)}>
              Sobre nós
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}