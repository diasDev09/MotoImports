import { describe, it, expect } from 'vitest'
import { montarPedidoBoutique, paraDocumento } from './documentos.ts'
import { adicionarAoCarrinho } from '../domain/boutique.ts'
import type { ItemCarrinho } from '../domain/boutique.ts'
import { PRODUTOS_BOUTIQUE } from '../data/boutique.ts'

describe('montarPedidoBoutique', () => {
    it('guarda só o essencial de cada item e fecha o total', () => {
        const capacete = PRODUTOS_BOUTIQUE.find((p) => p.tamanhos)!
        const outro = PRODUTOS_BOUTIQUE.find((p) => !p.tamanhos)!
        let carrinho: ItemCarrinho[] = []
        carrinho = adicionarAoCarrinho(carrinho, capacete, capacete.tamanhos![0])
        carrinho = adicionarAoCarrinho(carrinho, outro, '')
        carrinho = adicionarAoCarrinho(carrinho, outro, '')

        const pedido = montarPedidoBoutique(carrinho, 'pix')

        expect(pedido.itens).toHaveLength(2)
        expect(pedido.itens[0]).toEqual({
            produtoId: capacete.id,
            nome: capacete.nome,
            tamanho: capacete.tamanhos![0],
            quantidade: 1,
            precoUnitario: capacete.preco,
            subtotal: capacete.preco,
        })
        expect(pedido.itens[1].quantidade).toBe(2)
        expect(pedido.total).toBeCloseTo(capacete.preco + outro.preco * 2, 2)
        expect(pedido.pagamento).toBe('pix')
        // nada de imagem, descrição ou outros campos do produto
        expect(Object.keys(pedido.itens[0])).not.toContain('imagem')
    })
})

describe('paraDocumento', () => {
    it('remove campos undefined, que o Firestore não aceita', () => {
        expect(paraDocumento({ a: 1, b: undefined, c: { d: undefined, e: 'x' } })).toEqual({ a: 1, c: { e: 'x' } })
    })

    it('devolve uma cópia: alterar o resultado não altera o original', () => {
        const original = { lista: [1, 2] }
        const copia = paraDocumento(original)
        copia.lista.push(3)
        expect(original.lista).toEqual([1, 2])
    })
})
