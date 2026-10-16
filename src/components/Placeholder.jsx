import { Link } from 'react-router-dom'

export default function Placeholder({ titulo, mensagem = 'Esta página está em construção.' }) {
  return (
    <section className="placeholder">
      <div className="container">
        <h1>{titulo}</h1>
        <p>{mensagem}</p>
        <Link to="/" className="btn btn-contorno">
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}