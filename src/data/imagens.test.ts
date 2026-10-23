import { describe, it, expect } from 'vitest'
import { motos } from './motos.ts'
import { PRODUTOS_BOUTIQUE } from './boutique.ts'

// Evita foto quebrada no site: todo caminho de imagem precisa existir em public/img.
// O glob só lista os arquivos (sem carregá-los); as chaves são caminhos a partir de public/.
const arquivos = new Set(
    Object.keys(import.meta.glob('../../public/img/**/*.webp')).map((c) => c.replace('../../public', '')),
)

describe('imagens locais', () => {
    it('encontra os arquivos de public/img', () => {
        expect(arquivos.size).toBeGreaterThanOrEqual(19)
    })

    it.each(motos.map((m) => [m.id, m.imagem]))('moto %s tem foto em public/', (_id, imagem) => {
        expect(arquivos.has(imagem)).toBe(true)
    })

    it.each(PRODUTOS_BOUTIQUE.map((p) => [p.nome, p.imagem]))('produto %s tem foto em public/', (_nome, imagem) => {
        expect(arquivos.has(imagem)).toBe(true)
    })
})
