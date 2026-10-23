import type { Moto } from '../data/motos.ts'
import { PARAMETROS_PRECIFICACAO } from '../data/parametros-precificacao.ts'
import { decomporPrecoFinal } from '../domain/pricing.ts'
import type { ComposicaoPreco } from '../domain/pricing.ts'
import { formatarPrecoComCentavos } from '../utils/formatters.ts'

// A peça de destaque do site: a nota de preço rasgada, com o carimbo "Sem taxa surpresa".
// Mostra de onde vem o preço final (RF-02). Se o preço for menor que os custos fixos,
// a decomposição lança RangeError e a nota simplesmente não aparece.
function comporPreco(preco: number): ComposicaoPreco | null {
    try {
        return decomporPrecoFinal(preco, PARAMETROS_PRECIFICACAO)
    } catch {
        return null
    }
}

export default function NotaPreco({ moto }: { moto: Moto }) {
    const c = comporPreco(moto.preco)
    if (!c) return null

    const linhas: [string, number][] = [
        ['Preço base', c.base],
        ['Frete internacional', c.frete],
        ['Despacho aduaneiro', c.despacho],
        ['Imposto de importação', c.impostoImportacao],
        ['Impostos fiscais', c.impostosFiscais],
    ]

    // O clip-path do papel rasgado corta sombra e fita, então os dois ficam no invólucro:
    // drop-shadow acompanha o contorno recortado e a fita fica fora do recorte.
    return (
        <div className="fita inclina-b mx-auto w-full max-w-md [filter:drop-shadow(8px_8px_0_var(--color-sangue))]">
        <figure aria-labelledby="nota-titulo" className="folha rasgado relative p-6 pb-10 pt-8">
            <figcaption id="nota-titulo" className="text-xs uppercase text-suave">
                Nota de preço · {moto.marca} {moto.nome}
            </figcaption>

            <dl className="mt-3 text-sm">
                {linhas.map(([rotulo, valor]) => (
                    <div key={rotulo} className="flex justify-between gap-4 border-b border-dashed border-linha py-1.5">
                        <dt>{rotulo}</dt>
                        <dd className="font-bold">{formatarPrecoComCentavos(valor)}</dd>
                    </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-3">
                    <dt className="font-bold">Total</dt>
                    <dd className="font-display text-3xl font-bold">{formatarPrecoComCentavos(c.total)}</dd>
                </div>
                <div className="flex justify-between gap-4 pt-1 text-suave">
                    <dt>Taxa surpresa</dt>
                    <dd>{formatarPrecoComCentavos(0)}</dd>
                </div>
            </dl>

            <div className="mt-4 flex justify-end pr-2">
                <p className="carimbo text-sm">Sem taxa surpresa</p>
            </div>
        </figure>
        </div>
    )
}
