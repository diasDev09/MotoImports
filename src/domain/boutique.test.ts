import { describe, it, expect } from 'vitest'
import { PRODUTOS_BOUTIQUE } from '../data/boutique.ts'
import type { ProdutoBoutique } from '../data/boutique.ts'
import {
    FILTROS_INICIAIS,
    adicionarAoCarrinho,
    alterarQuantidade,
    chaveItem,
    exigeTamanho,
    filtrarProdutos,
    normalizar,
    removerItem,
    subtotal,
    totalItens,
    valorTotal,
} from './boutique.ts'

const produto = (id: number): ProdutoBoutique => PRODUTOS_BOUTIQUE.find((p) => p.id === id)!
const capacete = produto(101) // Racing Pro Black, R$ 599,90
const luvas = produto(2) // R$ 120

describe('catálogo da boutique', () => {
    it('tem ids únicos e preços positivos', () => {
        const ids = PRODUTOS_BOUTIQUE.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
        expect(PRODUTOS_BOUTIQUE.every((p) => p.preco > 0)).toBe(true)
    })

    it('todo capacete tem estilo, certificação e tamanhos', () => {
        PRODUTOS_BOUTIQUE.filter((p) => p.categoria === 'Capacetes').forEach((p) => {
            expect(p.estilo).toBeDefined()
            expect(p.certificacoes?.length).toBeGreaterThan(0)
            expect(p.tamanhos?.length).toBeGreaterThan(0)
        })
    })
})

describe('normalizar', () => {
    it('ignora acento e maiúscula', () => {
        expect(normalizar('Vestuário')).toBe('vestuario')
    })
})

describe('filtrarProdutos', () => {
    it('sem filtro, devolve tudo', () => {
        expect(filtrarProdutos(PRODUTOS_BOUTIQUE, FILTROS_INICIAIS)).toHaveLength(PRODUTOS_BOUTIQUE.length)
    })

    it('busca por nome ou descrição, sem depender de acento', () => {
        const r = filtrarProdutos(PRODUTOS_BOUTIQUE, { ...FILTROS_INICIAIS, busca: 'PROTECAO' })
        expect(r.map((p) => p.nome)).toEqual(['Óculos para Motociclista', 'Capa de Chuva'])
    })

    it('filtra por categoria', () => {
        const r = filtrarProdutos(PRODUTOS_BOUTIQUE, { ...FILTROS_INICIAIS, categoria: 'Vestuário' })
        expect(r.map((p) => p.nome)).toEqual(['Luvas para Motociclista', 'Jaqueta de Motociclismo'])
    })

    it('em Capacetes, filtra por estilo e por certificação', () => {
        const base = { ...FILTROS_INICIAIS, categoria: 'Capacetes' as const }
        expect(filtrarProdutos(PRODUTOS_BOUTIQUE, { ...base, estilo: 'Touring' }).map((p) => p.id)).toEqual([104])
        expect(filtrarProdutos(PRODUTOS_BOUTIQUE, { ...base, certificacao: 'Snell' }).map((p) => p.id)).toEqual([104, 105])
        expect(filtrarProdutos(PRODUTOS_BOUTIQUE, { ...base, estilo: 'Esportivo', certificacao: 'Snell' }).map((p) => p.id)).toEqual([105])
    })

    it('estilo e certificação são ignorados fora de Capacetes', () => {
        const r = filtrarProdutos(PRODUTOS_BOUTIQUE, { ...FILTROS_INICIAIS, estilo: 'Touring', certificacao: 'Snell' })
        expect(r).toHaveLength(PRODUTOS_BOUTIQUE.length)
    })

    it('combina busca e categoria', () => {
        const r = filtrarProdutos(PRODUTOS_BOUTIQUE, { ...FILTROS_INICIAIS, busca: 'racing', categoria: 'Capacetes' })
        expect(r.map((p) => p.id)).toEqual([101, 105])
    })

    it('nada encontrado devolve lista vazia', () => {
        expect(filtrarProdutos(PRODUTOS_BOUTIQUE, { ...FILTROS_INICIAIS, busca: 'foguete' })).toEqual([])
    })
})

describe('carrinho', () => {
    it('só capacete exige tamanho', () => {
        expect(exigeTamanho(capacete)).toBe(true)
        expect(exigeTamanho(luvas)).toBe(false)
    })

    it('a chave separa tamanhos do mesmo produto', () => {
        expect(chaveItem(capacete, 'M')).toBe('101-M')
        expect(chaveItem(capacete, 'G')).toBe('101-G')
        expect(chaveItem(luvas, '')).toBe('2-unico')
    })

    it('adicionar o mesmo item soma a quantidade; tamanho diferente vira outro item', () => {
        let c = adicionarAoCarrinho([], capacete, 'M')
        c = adicionarAoCarrinho(c, capacete, 'M')
        c = adicionarAoCarrinho(c, capacete, 'G')
        expect(c).toHaveLength(2)
        expect(c[0].quantidade).toBe(2)
        expect(totalItens(c)).toBe(3)
    })

    it('não altera a lista original (função pura)', () => {
        const original = adicionarAoCarrinho([], luvas)
        adicionarAoCarrinho(original, luvas)
        expect(original[0].quantidade).toBe(1)
    })

    it('alterar quantidade: +1 soma, -1 subtrai e zero remove o item', () => {
        let c = adicionarAoCarrinho([], luvas)
        c = alterarQuantidade(c, '2-unico', 1)
        expect(c[0].quantidade).toBe(2)
        c = alterarQuantidade(c, '2-unico', -1)
        c = alterarQuantidade(c, '2-unico', -1)
        expect(c).toEqual([])
    })

    it('remover tira só o item pedido', () => {
        const c = adicionarAoCarrinho(adicionarAoCarrinho([], luvas), capacete, 'M')
        expect(removerItem(c, '2-unico').map((i) => i.chave)).toEqual(['101-M'])
    })

    it('valores em centavos exatos, sem erro de ponto flutuante', () => {
        let c = adicionarAoCarrinho([], capacete, 'M')
        c = alterarQuantidade(c, '101-M', 1)
        c = alterarQuantidade(c, '101-M', 1) // 3 capacetes
        expect(subtotal(c[0])).toBe(1799.7) // 599,90 * 3
        c = adicionarAoCarrinho(c, luvas)
        expect(valorTotal(c)).toBe(1919.7)
    })

    it('carrinho vazio vale zero', () => {
        expect(valorTotal([])).toBe(0)
        expect(totalItens([])).toBe(0)
    })
})