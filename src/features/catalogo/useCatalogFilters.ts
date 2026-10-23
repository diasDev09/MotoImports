import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    motos,
    CATEGORIAS,
    MODOS_PILOTAGEM,
    CILINDRADA_MIN,
    CILINDRADA_MAX,
} from '../../data/motos.ts'
import type { Categoria, ModoPilotagem } from '../../data/motos.ts'
import { filtrarMotos, contarFiltrosAtivos } from '../../domain/catalogFilters.ts'

// A URL é a "fonte da verdade": /catalogo?categoria=Sport&modo=Track&cc=900
// Assim o link da Home (?categoria=...) já funciona e dá para compartilhar a busca.

// valores vindos da URL são validados: valor desconhecido vira "sem filtro"
function ehCategoria(valor: string | null): valor is Categoria {
    return valor !== null && (CATEGORIAS as readonly string[]).includes(valor)
}

function ehModo(valor: string | null): valor is ModoPilotagem {
    return valor !== null && (MODOS_PILOTAGEM as readonly string[]).includes(valor)
}

function lerCilindrada(texto: string | null): number {
    const numero = Number.parseInt(texto ?? '', 10)
    if (Number.isNaN(numero)) return CILINDRADA_MAX
    return Math.min(Math.max(numero, CILINDRADA_MIN), CILINDRADA_MAX)
}

export function useCatalogFilters() {
    const [params, setParams] = useSearchParams()

    const categoriaUrl = params.get('categoria')
    const modoUrl = params.get('modo')
    const categoria = ehCategoria(categoriaUrl) ? categoriaUrl : null
    const modo = ehModo(modoUrl) ? modoUrl : null
    const cilindradaMax = lerCilindrada(params.get('cc'))

    // useMemo: só refiltra quando algum filtro muda
    const resultado = useMemo(
        () => filtrarMotos(motos, { categoria, modo, cilindradaMin: CILINDRADA_MIN, cilindradaMax }),
        [categoria, modo, cilindradaMax],
    )

    const filtrosAtivos = contarFiltrosAtivos(
        { categoria, modo, cilindradaMax },
        { min: CILINDRADA_MIN, max: CILINDRADA_MAX },
    )

    const alterar = useCallback(
        (chave: string, valor: string | number, valorPadrao?: string | number) => {
            const proximo = new URLSearchParams(params)
            if (valor === valorPadrao || valor === '') proximo.delete(chave)
            else proximo.set(chave, String(valor))
            setParams(proximo, { replace: true })
        },
        [params, setParams],
    )

    return {
        categoria,
        modo,
        cilindradaMax,
        resultado,
        filtrosAtivos,
        definirCategoria: (v: string) => alterar('categoria', v),
        definirModo: (v: string) => alterar('modo', v),
        definirCilindradaMax: (v: string | number) => alterar('cc', v, CILINDRADA_MAX),
        limpar: () => setParams({}, { replace: true }),
    }
}