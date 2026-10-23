// Boutique: filtros e carrinho (porte da v1, da Ariely).
// Funções puras, sem React: recebem o estado atual e devolvem o novo.
import type {
    CategoriaBoutique,
    Certificacao,
    EstiloCapacete,
    ProdutoBoutique,
} from '../data/boutique.ts'

export interface ItemCarrinho {
    chave: string // produto + tamanho: o mesmo capacete em tamanhos diferentes são itens diferentes
    produto: ProdutoBoutique
    tamanho: string // vazio quando o produto não tem tamanho
    quantidade: number
}

export interface Filtros {
    busca: string
    categoria: 'Todos' | CategoriaBoutique
    estilo: 'Todos' | EstiloCapacete
    certificacao: 'Todas' | Certificacao
}

export const FILTROS_INICIAIS: Filtros = {
    busca: '',
    categoria: 'Todos',
    estilo: 'Todos',
    certificacao: 'Todas',
}

// tira acentos e maiúsculas: "Vestuário" casa com "vestuario"
export function normalizar(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
}

export function filtrarProdutos(
    produtos: readonly ProdutoBoutique[],
    { busca, categoria, estilo, certificacao }: Filtros,
): ProdutoBoutique[] {
    const termo = normalizar(busca)
    // estilo e certificação só valem dentro da categoria Capacetes
    const filtraCapacetes = categoria === 'Capacetes'

    return produtos.filter((p) => {
        if (!normalizar(`${p.nome} ${p.descricao}`).includes(termo)) return false
        if (categoria !== 'Todos' && p.categoria !== categoria) return false
        if (filtraCapacetes && estilo !== 'Todos' && p.estilo !== estilo) return false
        if (filtraCapacetes && certificacao !== 'Todas' && !(p.certificacoes ?? []).includes(certificacao)) return false
        return true
    })
}

export function exigeTamanho(produto: ProdutoBoutique): boolean {
    return Boolean(produto.tamanhos?.length)
}

export function chaveItem(produto: ProdutoBoutique, tamanho: string): string {
    return `${produto.id}-${tamanho || 'unico'}`
}

export function adicionarAoCarrinho(
    carrinho: readonly ItemCarrinho[],
    produto: ProdutoBoutique,
    tamanho = '',
): ItemCarrinho[] {
    const chave = chaveItem(produto, tamanho)
    const existente = carrinho.find((i) => i.chave === chave)

    if (existente) {
        return carrinho.map((i) => (i.chave === chave ? { ...i, quantidade: i.quantidade + 1 } : i))
    }
    return [...carrinho, { chave, produto, tamanho, quantidade: 1 }]
}

// variacao: +1 ou -1. Chegando a zero, o item sai do carrinho.
export function alterarQuantidade(carrinho: readonly ItemCarrinho[], chave: string, variacao: number): ItemCarrinho[] {
    return carrinho
        .map((i) => (i.chave === chave ? { ...i, quantidade: i.quantidade + variacao } : i))
        .filter((i) => i.quantidade > 0)
}

export function removerItem(carrinho: readonly ItemCarrinho[], chave: string): ItemCarrinho[] {
    return carrinho.filter((i) => i.chave !== chave)
}

export function totalItens(carrinho: readonly ItemCarrinho[]): number {
    return carrinho.reduce((total, i) => total + i.quantidade, 0)
}

// arredonda em centavos: 599.9 * 3 não vira 1799.7000000000003
export function subtotal(item: ItemCarrinho): number {
    return Math.round(item.produto.preco * 100) * item.quantidade / 100
}

export function valorTotal(carrinho: readonly ItemCarrinho[]): number {
    return carrinho.reduce((total, i) => total + Math.round(i.produto.preco * 100) * i.quantidade, 0) / 100
}