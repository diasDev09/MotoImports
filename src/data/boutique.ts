// Catálogo da boutique (porte da v1, da Ariely): capacetes e equipamentos para o piloto.
// ATENÇÃO: as imagens são links externos (Unsplash) da v1. Antes de publicar, trocar por fotos
// próprias dos produtos, hospedadas no projeto.

export const CATEGORIAS_BOUTIQUE = ['Capacetes', 'Vestuário', 'Acessórios', 'Manutenção'] as const
export type CategoriaBoutique = (typeof CATEGORIAS_BOUTIQUE)[number]

export const ESTILOS_CAPACETE = ['Esportivo', 'Street', 'Touring'] as const
export type EstiloCapacete = (typeof ESTILOS_CAPACETE)[number]

export const CERTIFICACOES = ['ECE', 'DOT', 'Snell'] as const
export type Certificacao = (typeof CERTIFICACOES)[number]

export type TamanhoCapacete = 'PP' | 'P' | 'M' | 'G' | 'GG'

export interface ProdutoBoutique {
    id: number
    nome: string
    categoria: CategoriaBoutique
    preco: number // em reais, pode ter centavos (ex.: 599.9)
    imagem: string
    descricao: string
    // só capacetes:
    estilo?: EstiloCapacete
    certificacoes?: readonly Certificacao[]
    tamanhos?: readonly TamanhoCapacete[]
}

export const PRODUTOS_BOUTIQUE: readonly ProdutoBoutique[] = [
    {
        id: 101,
        nome: 'Racing Pro Black',
        categoria: 'Capacetes',
        estilo: 'Esportivo',
        certificacoes: ['ECE', 'DOT'],
        tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
        preco: 599.9,
        imagem: 'https://images.unsplash.com/photo-1513089722837-f10c05960a52?auto=format&fit=crop&w=800&q=80',
        descricao: 'Design esportivo, viseira ampla e acabamento premium.',
    },
    {
        id: 102,
        nome: 'Sport Blue',
        categoria: 'Capacetes',
        estilo: 'Esportivo',
        certificacoes: ['ECE'],
        tamanhos: ['P', 'M', 'G', 'GG'],
        preco: 749.9,
        imagem: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        descricao: 'Visual moderno para quem procura estilo e conforto.',
    },
    {
        id: 103,
        nome: 'Street Graphite',
        categoria: 'Capacetes',
        estilo: 'Street',
        certificacoes: ['DOT'],
        tamanhos: ['PP', 'P', 'M', 'G'],
        preco: 429.9,
        imagem: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        descricao: 'Modelo versátil para o uso urbano e cotidiano.',
    },
    {
        id: 104,
        nome: 'Touring Premium',
        categoria: 'Capacetes',
        estilo: 'Touring',
        certificacoes: ['ECE', 'Snell'],
        tamanhos: ['P', 'M', 'G', 'GG'],
        preco: 899.9,
        imagem: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        descricao: 'Conforto para viagens e percursos mais longos.',
    },
    {
        id: 105,
        nome: 'Racing Carbon',
        categoria: 'Capacetes',
        estilo: 'Esportivo',
        certificacoes: ['ECE', 'Snell'],
        tamanhos: ['P', 'M', 'G'],
        preco: 1299.9,
        imagem: 'https://images.unsplash.com/photo-1513089722837-f10c05960a52?auto=format&fit=crop&w=800&q=80',
        descricao: 'Visual inspirado nas pistas e acabamento sofisticado.',
    },
    {
        id: 106,
        nome: 'Urban White',
        categoria: 'Capacetes',
        estilo: 'Street',
        certificacoes: ['ECE', 'DOT'],
        tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
        preco: 479.9,
        imagem: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        descricao: 'Estilo clean e versátil para a rotina sobre duas rodas.',
    },
    {
        id: 2,
        nome: 'Luvas para Motociclista',
        categoria: 'Vestuário',
        preco: 120,
        imagem: 'https://images.unsplash.com/photo-1683183191020-cf86f3d45db3?auto=format&fit=crop&w=800&q=80',
        descricao: 'Mais aderência e segurança ao pilotar.',
    },
    {
        id: 3,
        nome: 'Jaqueta de Motociclismo',
        categoria: 'Vestuário',
        preco: 380,
        imagem: 'https://images.unsplash.com/photo-1770130697254-d965c05d2ee0?auto=format&fit=crop&w=800&q=80',
        descricao: 'Resistência e conforto para o dia a dia.',
    },
    {
        id: 4,
        nome: 'Óculos para Motociclista',
        categoria: 'Acessórios',
        preco: 85,
        imagem: 'https://images.unsplash.com/photo-1677030041879-24c9e2cc55e5?auto=format&fit=crop&w=800&q=80',
        descricao: 'Proteção contra vento e poeira.',
    },
    {
        id: 5,
        nome: 'Capa de Chuva',
        categoria: 'Acessórios',
        preco: 150,
        imagem: 'https://images.unsplash.com/photo-1781277495387-ec90b4ba7e3c?auto=format&fit=crop&w=800&q=80',
        descricao: 'Proteção para pilotar em dias chuvosos.',
    },
    {
        id: 6,
        nome: 'Kit de Ferramentas',
        categoria: 'Manutenção',
        preco: 95,
        imagem: 'https://images.unsplash.com/photo-1563090728-6f7cdbfb4d72?auto=format&fit=crop&w=800&q=80',
        descricao: 'Ferramentas essenciais para sua moto.',
    },
]

export const FORMAS_PAGAMENTO_BOUTIQUE = [
    { valor: 'pix', nome: 'Pix', descricao: 'Pagamento instantâneo.' },
    { valor: 'credito', nome: 'Cartão de crédito', descricao: 'À vista ou parcelado, conforme as condições da loja.' },
    { valor: 'debito', nome: 'Cartão de débito', descricao: 'Pagamento à vista.' },
    { valor: 'boleto', nome: 'Boleto bancário', descricao: 'Pagamento sujeito à compensação.' },
] as const

export type FormaPagamentoBoutique = (typeof FORMAS_PAGAMENTO_BOUTIQUE)[number]['valor']

// guia de tamanhos do capacete: só uma referência, cada fabricante tem a sua tabela
export const GUIA_TAMANHOS: readonly { tamanho: TamanhoCapacete; circunferencia: string }[] = [
    { tamanho: 'PP', circunferencia: '53–54 cm' },
    { tamanho: 'P', circunferencia: '55–56 cm' },
    { tamanho: 'M', circunferencia: '57–58 cm' },
    { tamanho: 'G', circunferencia: '59–60 cm' },
    { tamanho: 'GG', circunferencia: '61–62 cm' },
]