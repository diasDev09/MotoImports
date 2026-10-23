import { Link } from 'react-router-dom'
import StockBadge from './StockBadge.tsx'
import type { Moto } from '../data/motos.ts'
import { formatarCilindrada, formatarPreco } from '../utils/formatters.ts'

// Cartão da vitrine (porte da v1, da Emilly). Se a moto tiver "imagem", mostra a foto.
// Sem foto, mostra a cilindrada grande, que já deixa o cartão com cara de ficha técnica.
export default function CartaoDestaque({ moto }: { moto: Moto }) {
    return (
        <article className="flex flex-col overflow-hidden rounded-card border border-musgo-200 bg-white">
            <div className="relative flex h-48 items-center justify-center bg-musgo-200">
                {moto.imagem ? (
                    <img
                        src={moto.imagem}
                        alt={`${moto.marca} ${moto.nome}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span aria-hidden="true" className="font-display text-7xl font-extrabold text-musgo-600">
                        {moto.cilindrada}
                    </span>
                )}
                <div className="absolute left-3 top-3">
                    <StockBadge status={moto.estoque} />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-5">
                <p className="text-xs uppercase tracking-wide text-musgo-600">
                    {moto.marca} · {moto.categoria}
                </p>
                <h3 className="text-xl">{moto.nome}</h3>
                <p className="text-sm">
                    {formatarCilindrada(moto.cilindrada)} · {moto.potenciaCv} cv
                </p>
                <p className="mt-2 font-display text-2xl font-extrabold">
                    {formatarPreco(moto.preco)}
                    <span className="block text-xs font-normal text-musgo-600">com frete e impostos</span>
                </p>
                <Link
                    to={`/moto/${moto.id}`}
                    className="mt-4 flex items-center justify-between rounded-lg bg-musgo-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600"
                >
                    Ver detalhes <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    )
}