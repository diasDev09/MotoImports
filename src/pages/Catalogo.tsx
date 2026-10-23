import CartaoDestaque from '../components/CartaoDestaque.tsx'
import { useCatalogFilters } from '../features/catalogo/useCatalogFilters.ts'
import { CATEGORIAS, MODOS_PILOTAGEM, CILINDRADA_MIN, CILINDRADA_MAX } from '../data/motos.ts'
import { formatarCilindrada } from '../utils/formatters.ts'

const estiloCampo = 'flex min-w-48 flex-col gap-1 text-sm'
const estiloSelect = 'rounded-lg border border-musgo-400 bg-white px-3 py-2 text-musgo-900'
const estiloBotao =
    'rounded-lg px-5 py-2 text-sm font-semibold uppercase tracking-wide'

export default function Catalogo() {
    const f = useCatalogFilters()
    const total = f.resultado.length

    return (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">
                <h1 className="text-4xl">Catálogo</h1>

                <div
                    role="search"
                    aria-label="Filtros do catálogo"
                    className="mt-6 flex flex-wrap items-end gap-4 rounded-card border border-musgo-200 bg-white p-5"
                >
                    <div className={estiloCampo}>
                        <label htmlFor="filtro-categoria">Categoria</label>
                        <select
                            id="filtro-categoria"
                            className={estiloSelect}
                            value={f.categoria ?? ''}
                            onChange={(e) => f.definirCategoria(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {CATEGORIAS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={estiloCampo}>
                        <label htmlFor="filtro-modo">Modo de pilotagem</label>
                        <select
                            id="filtro-modo"
                            className={estiloSelect}
                            value={f.modo ?? ''}
                            onChange={(e) => f.definirModo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {MODOS_PILOTAGEM.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={estiloCampo}>
                        <label htmlFor="filtro-cc">
                            Cilindrada até <strong>{formatarCilindrada(f.cilindradaMax)}</strong>
                        </label>
                        <input
                            id="filtro-cc"
                            type="range"
                            className="accent-musgo-600"
                            min={CILINDRADA_MIN}
                            max={CILINDRADA_MAX}
                            step={50}
                            value={f.cilindradaMax}
                            onChange={(e) => f.definirCilindradaMax(e.target.value)}
                        />
                    </div>

                    {f.filtrosAtivos > 0 && (
                        <button
                            type="button"
                            className={`${estiloBotao} border border-musgo-900 hover:bg-musgo-200`}
                            onClick={f.limpar}
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {/* aria-live: leitores de tela anunciam quando a quantidade muda */}
                <p className="mt-6 text-musgo-600" aria-live="polite">
                    {total === 1 ? '1 moto encontrada' : `${total} motos encontradas`}
                </p>

                {total > 0 ? (
                    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {f.resultado.map((moto) => (
                            <CartaoDestaque key={moto.id} moto={moto} />
                        ))}
                    </div>
                ) : (
                    <div
                        role="status"
                        className="mt-4 rounded-card border border-dashed border-musgo-400 px-4 py-12 text-center"
                    >
                        <p>Nenhuma moto encontrada com esses filtros.</p>
                        <button
                            type="button"
                            className={`${estiloBotao} mt-4 bg-musgo-900 text-white hover:bg-musgo-600`}
                            onClick={f.limpar}
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}