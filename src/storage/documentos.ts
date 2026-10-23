import type { FormaPagamentoBoutique } from '../data/boutique.ts'
import type { ItemCarrinho } from '../domain/boutique.ts'
import { subtotal, valorTotal } from '../domain/boutique.ts'

// Funções puras que transformam o estado do app no formato que vai para o banco.
// Ficam separadas do Firestore para serem testadas sem rede.

export interface PedidoBoutique {
    itens: { produtoId: number; nome: string; tamanho: string; quantidade: number; precoUnitario: number; subtotal: number }[]
    total: number
    pagamento: FormaPagamentoBoutique
}

export function montarPedidoBoutique(carrinho: readonly ItemCarrinho[], pagamento: FormaPagamentoBoutique): PedidoBoutique {
    return {
        itens: carrinho.map((item) => ({
            produtoId: item.produto.id,
            nome: item.produto.nome,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco,
            subtotal: subtotal(item),
        })),
        total: valorTotal(carrinho),
        pagamento,
    }
}

// O Firestore recusa `undefined`. Passar por JSON remove esses campos e também garante
// que só vão dados simples (nada de função ou instância de classe).
export function paraDocumento<T>(dados: T): T {
    return JSON.parse(JSON.stringify(dados)) as T
}
