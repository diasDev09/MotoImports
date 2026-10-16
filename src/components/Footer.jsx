import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape-grade">
          <div>
            <h3>Moto Imports</h3>
            <p>Motos importadas de alta cilindrada, com preço fechado e acompanhamento até a retirada.</p>
          </div>

          <div>
            <h3>Navegue</h3>
            <ul>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/simulador">Simulador</Link></li>
              <li><Link to="/pos-venda">Oficina e boutique</Link></li>
              <li><Link to="/#sobre">Sobre nós</Link></li>
            </ul>
          </div>

          <div>
            <h3>Fale com a gente</h3>
            <ul>
              <li><Link to="/contato">Receber proposta</Link></li>
              <li><Link to="/checkout">Reservar uma moto</Link></li>
            </ul>
          </div>
        </div>

        <p className="rodape-fim">
          © 2026 Moto Imports. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}