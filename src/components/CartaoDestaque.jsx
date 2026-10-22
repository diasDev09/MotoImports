import { Link } from 'react-router-dom'
import { ESTOQUE } from '../data/motos.js'
import { formatarCilindrada, formatarPreco } from '../utils/formatters.js'

// cartão da vitrine da Home. Se a moto tiver "imagem" no motos.js, mostra a foto.
// Sem foto, mostra a cilindrada grande, que já deixa o cartão com cara de ficha técnica.
export default function CartaoDestaque({ moto }) {
  const estoque = ESTOQUE[moto.estoque]

  return (
    <article className="cartao-moto">
      <div className="cartao-foto">
        {moto.imagem ? (
          <img src={moto.imagem} alt={`${moto.marca} ${moto.nome}`} />
        ) : (
          <span className="cartao-cc" aria-hidden="true">
            {moto.cilindrada}
          </span>
        )}
        <span className={`badge-estoque ${estoque.cor}`}>{estoque.rotulo}</span>
      </div>

      <div className="cartao-corpo">
        <p className="cartao-marca">
          {moto.marca} · {moto.categoria}
        </p>
        <h3>{moto.nome}</h3>
        <p className="cartao-specs">
          {formatarCilindrada(moto.cilindrada)} · {moto.potenciaCv} cv
        </p>
        <p className="cartao-preco">
          {formatarPreco(moto.preco)}
          <span>com frete e impostos</span>
        </p>
        <Link to={`/moto/${moto.id}`} className="btn btn-contorno">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}