// Dados de exemplo das motos (porte da v1, da Emilly).
// O preço já é o valor FINAL (frete, importação e imposto inclusos).
// Antes de mudar o nome de algum campo, avisa o grupo.

// Vocabulário único: se um valor não está nestas listas, o TypeScript reclama.
export const CATEGORIAS = ['Naked', 'Sport', 'Trail/Adventure', 'Custom'] as const
export type Categoria = (typeof CATEGORIAS)[number]

export const MODOS_PILOTAGEM = ['Rain', 'Road', 'Sport', 'Track', 'Off-Road'] as const
export type ModoPilotagem = (typeof MODOS_PILOTAGEM)[number]

// limites do slider de cilindrada.
// A v1 tinha 1250, o que deixava a BMW GS (1254 cc) e a Fat Boy (1868 cc) de fora do filtro.
export const CILINDRADA_MIN = 300
export const CILINDRADA_MAX = 1900

// textos do selo de estoque (RF-09). As cores ficam no componente StockBadge.
export const ESTOQUE = {
    'pronta-entrega': { rotulo: 'Pronta entrega' },
    'em-transito': { rotulo: 'Em trânsito aduaneiro (15 a 30 dias)' },
    'sob-pedido': { rotulo: 'Importação sob pedido' },
} as const
export type StatusEstoque = keyof typeof ESTOQUE

export interface Moto {
    id: string
    nome: string
    marca: string
    categoria: Categoria
    cilindrada: number
    potenciaCv: number
    modos: readonly ModoPilotagem[]
    preco: number // valor final, tudo incluso
    estoque: StatusEstoque
    prazoDias: string
    videoUrl: string
    imagem: string
    destaques: readonly string[]
}

export const motos: readonly Moto[] = [
    {
        id: 'ducati-panigale-v2',
        nome: 'Panigale V2',
        marca: 'Ducati',
        categoria: 'Sport',
        cilindrada: 955,
        potenciaCv: 155,
        modos: ['Rain', 'Road', 'Sport', 'Track'],
        preco: 169900,
        estoque: 'pronta-entrega',
        prazoDias: '',
        videoUrl: '',
        imagem: '',
        destaques: ['Quickshifter bidirecional', 'Cornering ABS', 'IMU de 6 eixos'],
    },
    {
        id: 'kawasaki-ninja-zx-6r',
        nome: 'Ninja ZX-6R',
        marca: 'Kawasaki',
        categoria: 'Sport',
        cilindrada: 636,
        potenciaCv: 130,
        modos: ['Rain', 'Road', 'Sport', 'Track'],
        preco: 98900,
        estoque: 'em-transito',
        prazoDias: '15 a 30 dias',
        videoUrl: '',
        imagem: '',
        destaques: ['Quickshifter bidirecional', 'ABS em curva', 'Painel TFT'],
    },
    {
        id: 'yamaha-mt-07',
        nome: 'MT-07',
        marca: 'Yamaha',
        categoria: 'Naked',
        cilindrada: 689,
        potenciaCv: 73,
        modos: ['Rain', 'Road', 'Sport'],
        preco: 54900,
        estoque: 'pronta-entrega',
        prazoDias: '',
        videoUrl: '',
        imagem: '',
        destaques: ['Controle de tração', 'Torque forte em baixa rotação', 'Leve e ágil'],
    },
    {
        id: 'triumph-speed-triple-1200',
        nome: 'Speed Triple 1200 RS',
        marca: 'Triumph',
        categoria: 'Naked',
        cilindrada: 1160,
        potenciaCv: 180,
        modos: ['Rain', 'Road', 'Sport', 'Track'],
        preco: 139900,
        estoque: 'sob-pedido',
        prazoDias: '45 a 60 dias',
        videoUrl: '',
        imagem: '',
        destaques: ['Controle de tração multinível', 'Suspensão Öhlins', 'Quickshifter'],
    },
    {
        id: 'bmw-r-1250-gs',
        nome: 'R 1250 GS',
        marca: 'BMW',
        categoria: 'Trail/Adventure',
        cilindrada: 1254,
        potenciaCv: 136,
        modos: ['Rain', 'Road', 'Off-Road'],
        preco: 119900,
        estoque: 'pronta-entrega',
        prazoDias: '',
        videoUrl: '',
        imagem: '',
        destaques: ['Suspensão eletrônica semiativa', 'Tanque de 20 litros', 'Modo Enduro'],
    },
    {
        id: 'triumph-tiger-900',
        nome: 'Tiger 900 Rally Pro',
        marca: 'Triumph',
        categoria: 'Trail/Adventure',
        cilindrada: 888,
        potenciaCv: 108,
        modos: ['Rain', 'Road', 'Sport', 'Off-Road'],
        preco: 89900,
        estoque: 'em-transito',
        prazoDias: '15 a 30 dias',
        videoUrl: '',
        imagem: '',
        destaques: ['Suspensão eletrônica semiativa', 'Modo Enduro Pro', 'Tanque expandido'],
    },
    {
        id: 'harley-davidson-fat-boy',
        nome: 'Fat Boy 114',
        marca: 'Harley-Davidson',
        categoria: 'Custom',
        cilindrada: 1868,
        potenciaCv: 94,
        modos: ['Road', 'Sport'],
        preco: 112900,
        estoque: 'sob-pedido',
        prazoDias: '45 a 60 dias',
        videoUrl: '',
        imagem: '',
        destaques: ['Refrigeração combinada', 'Transmissão final por correia', 'Motor Milwaukee-Eight'],
    },
    {
        id: 'honda-rebel-500',
        nome: 'Rebel 500',
        marca: 'Honda',
        categoria: 'Custom',
        cilindrada: 471,
        potenciaCv: 46,
        modos: ['Road'],
        preco: 42900,
        estoque: 'pronta-entrega',
        prazoDias: '',
        videoUrl: '',
        imagem: '',
        destaques: ['Transmissão final por correia', 'Banco baixo', 'Fácil de pilotar'],
    },
]