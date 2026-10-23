import { Link } from 'react-router-dom'
import StockBadge from './StockBadge.tsx'
import type { Moto } from '../data/motos.ts'
import { formatarCilindrada, formatarPreco } from '../utils/formatters.ts'

// Cartão da vitrine (porte da v1, da Emilly). Se a moto tiver "imagem", mostra a foto.
// Sem foto, mostra a cilindrada grande, que já deixa o cartão com cara de ficha técnica.
export default function CartaoDestaque({ moto }: { moto: Moto }) {
    return (
        <article className="folha folha-sombra fita relative flex flex-col">
            <div className="meio-tom relative m-4 mb-0 flex h-44 items-center justify-center border-2 border-tinta bg-papel">
                {moto.imagem ? (
                    <img
                        src={moto.imagem}
                        alt={`${moto.marca} ${moto.nome}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span aria-hidden="true" className="bg-papel px-2 font-display text-7xl font-bold text-tinta">
                        {moto.cilindrada}
                    </span>
                )}
                <div className="absolute left-2 top-2">
                    <StockBadge status={moto.estoque} />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-5">
                <p className="text-xs uppercase text-suave">
                    {moto.marca} · {moto.categoria}
                </p>
                <h3 className="text-2xl">{moto.nome}</h3>
                <p className="text-sm">
                    {formatarCilindrada(moto.cilindrada)} · {moto.potenciaCv} cv
                </p>
                <p className="mt-2 font-display text-2xl font-bold">
                    {formatarPreco(moto.preco)}
                    <span className="block text-xs font-normal text-suave">com frete e impostos</span>
                </p>
                <Link
                    to={`/moto/${moto.id}`}
                    className="botao mt-4 flex min-h-11 items-center justify-between px-4 py-3 text-sm"
                >
                    Ver detalhes <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    )
}
