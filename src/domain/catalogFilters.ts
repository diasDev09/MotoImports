// RF-03: filtros técnicos do catálogo. Função pura: recebe a lista e devolve a lista filtrada.
// Os filtros são cumulativos (AND). Um filtro vazio (undefined ou null) não restringe nada.

export interface MotoFiltravel {
    categoria: string
    cilindrada: number
    modos: readonly string[]
}

export interface FiltrosCatalogo {
    categoria?: string | null
    modo?: string | null
    cilindradaMin?: number | null
    cilindradaMax?: number | null
}

export function filtrarMotos<T extends MotoFiltravel>(
    motos: readonly T[],
    filtros: FiltrosCatalogo,
): T[] {
    const { categoria, modo, cilindradaMin, cilindradaMax } = filtros

    return motos.filter((moto) => {
        if (categoria && moto.categoria !== categoria) return false
        if (modo && !moto.modos.includes(modo)) return false
        if (cilindradaMin != null && moto.cilindrada < cilindradaMin) return false
        if (cilindradaMax != null && moto.cilindrada > cilindradaMax) return false
        return true
    })
}

// quantos filtros estão ligados (usado para mostrar o botão "Limpar filtros")
export function contarFiltrosAtivos(
    filtros: FiltrosCatalogo,
    limites: { min: number; max: number },
): number {
    let total = 0
    if (filtros.categoria) total++
    if (filtros.modo) total++
    if (filtros.cilindradaMin != null && filtros.cilindradaMin > limites.min) total++
    if (filtros.cilindradaMax != null && filtros.cilindradaMax < limites.max) total++
    return total
}