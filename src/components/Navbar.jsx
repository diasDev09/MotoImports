
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const links = [
  { para: '/catalogo', texto: 'Catálogo' },
  { para: '/boutique', texto: 'Produtos' },
  { para: '/simulador', texto: 'Simulador' },
  { para: '/pos-venda', texto: 'Pós-venda' },
  { para: '/contato', texto: 'Contato' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const { acessorios, motoSelecionada } = useApp()

  // Quantidade total de itens em andamento para reserva/carrinho
  const quantidadeCarrinho = (acessorios?.length || 0) + (motoSelecionada ? 1 : 0)

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

          <li>
            <NavLink
              to="/checkout"
              onClick={() => setAberto(false)}
              className="navbar-carrinho"
              aria-label={`Reserva com ${quantidadeCarrinho} itens`}
            >
              🛒 Reserva
              {quantidadeCarrinho > 0 && (
                <span className="navbar-carrinho-contador">{quantidadeCarrinho}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
