import { describe, it, expect } from 'vitest'

describe('o que estou testando', () => {      // agrupa testes relacionados
    it('o comportamento esperado', () => {       // um teste
        // 1) preparar
        const a = 2
        const b = 3
        // 2) executar
        const resultado = a + b
        // 3) verificar
        expect(resultado).toBe(5)
    })
})