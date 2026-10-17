
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'


const links = [
  { para: '/catalogo', texto: 'Catálogo' },
  { para: '/boutique', texto: 'Produtos' },
  { para: '/simulador', texto: 'Simulador' },
  { para: '/pos-venda', texto: 'Pós-venda' },
  { para: '/contato', texto: 'Contato' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)

  // Temporariamente, o contador começa em zero.
  // Depois vamos conectá-lo ao carrinho da Boutique.
  const quantidadeCarrinho = 0

  return (
    <header className="navbar">
      <a href="#conteudo" className="sr-only">
        Ir para o conteúdo
      </a>

      <nav
        className="container navbar-interna"
        aria-label="Principal"
      >
        <Link
          to="/"
          className="marca"
          onClick={() => setAberto(false)}
        >
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

        <ul
          id="menu-principal"
          className={aberto ? 'menu aberto' : 'menu'}
        >
          {links.map((link) => (
            <li key={link.para}>
              <NavLink
                to={link.para}
                onClick={() => setAberto(false)}
                className={({ isActive }) =>
                  isActive ? 'ativo' : ''
                }
              >
                {link.texto}
              </NavLink>
            </li>
          ))}

          <li>
            <Link
              to="/#sobre"
              onClick={() => setAberto(false)}
            >
              Sobre nós
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
