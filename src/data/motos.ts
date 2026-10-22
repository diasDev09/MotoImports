// Vocabulário único do projeto: se um valor não está aqui, o TypeScript reclama.
export const CATEGORIAS = ['Sport', 'Naked', 'Trail/Adventure', 'Custom'] as const
export type Categoria = (typeof CATEGORIAS)[number]

export const MODOS_PILOTAGEM = ['Rain', 'Road', 'Sport', 'Track', 'Off-Road'] as const
export type ModoPilotagem = (typeof MODOS_PILOTAGEM)[number]

export const ESTOQUE = {
    'pronta-entrega': { rotulo: 'Pronta entrega', cor: 'verde' },
    'em-transito': { rotulo: 'Em trânsito aduaneiro (15 a 30 dias)', cor: 'amarelo' },
    'sob-pedido': { rotulo: 'Importação sob pedido', cor: 'azul' },
} as const
export type StatusEstoque = keyof typeof ESTOQUE

// limites do slider de cilindrada (1900 cobre a Fat Boy, de 1868 cc)
export const CILINDRADA_MIN = 300
export const CILINDRADA_MAX = 1900

export interface Moto {
    id: string
    nome: string
    marca: string
    categoria: Categoria
    cilindrada: number
    precoBase: number // preço de origem; o preço final vem de domain/pricing.ts
    estoque: StatusEstoque
    modos: readonly ModoPilotagem[]
}

// EXEMPLO com 3 motos (valores ilustrativos). Copie as 8 do projeto antigo,
// trocando `preco` por `precoBase` (veja a nota abaixo).
export const motos: Moto[] = [
    {
        id: 'rebel-500',
        nome: 'Rebel 500',
        marca: 'Honda',
        categoria: 'Custom',
        cilindrada: 471,
        precoBase: 32000,
        estoque: 'pronta-entrega',
        modos: ['Road'],
    },
    {
        id: 'r-1250-gs',
        nome: 'R 1250 GS',
        marca: 'BMW',
        categoria: 'Trail/Adventure',
        cilindrada: 1254,
        precoBase: 78000,
        estoque: 'em-transito',
        modos: ['Rain', 'Road', 'Off-Road'],
    },
    {
        id: 'fat-boy-114',
        nome: 'Fat Boy 114',
        marca: 'Harley-Davidson',
        categoria: 'Custom',
        cilindrada: 1868,
        precoBase: 95000,
        estoque: 'sob-pedido',
        modos: ['Road'],
    },
]