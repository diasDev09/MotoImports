import CartaoDestaque from '../components/CartaoDestaque.tsx'
import { useCatalogFilters } from '../features/catalogo/useCatalogFilters.ts'
import { CATEGORIAS, MODOS_PILOTAGEM, CILINDRADA_MIN, CILINDRADA_MAX } from '../data/motos.ts'
import { formatarCilindrada } from '../utils/formatters.ts'

const estiloCampo = 'flex min-w-48 flex-col gap-1 text-sm'
const estiloSelect = 'campo'
const estiloBotao = 'min-h-11 px-5 py-2 text-sm'

export default function Catalogo() {
    const f = useCatalogFilters()
    const total = f.resultado.length

    return (
        <section className="py-12">
            <div className="mx-auto max-w-site px-6">
                <h1 className="text-5xl md:text-7xl">Catálogo</h1>

                <div
                    role="search"
                    aria-label="Filtros do catálogo"
                    className="mt-6 flex flex-wrap items-end gap-4 folha folha-sombra p-5"
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
                            className="h-11 accent-fg"
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
                            className={`${estiloBotao} botao-vazado`}
                            onClick={f.limpar}
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {/* aria-live: leitores de tela anunciam quando a quantidade muda */}
                <p className="mt-6 text-suave" aria-live="polite">
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
                        className="mt-4 border-2 border-dashed border-linha px-4 py-12 text-center"
                    >
                        <p>Nenhuma moto encontrada com esses filtros.</p>
                        <button
                            type="button"
                            className={`${estiloBotao} mt-4 botao`}
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