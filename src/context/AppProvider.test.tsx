import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppProvider } from './AppProvider.tsx'
import { useApp } from './AppContext.ts'
import { motos } from '../data/motos.ts'

const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>

describe('AppContext', () => {
    it('começa vazio', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        expect(result.current.motoSelecionada).toBeNull()
        expect(result.current.acessorios).toEqual([])
        expect(result.current.totalAcessorios).toBe(0)
        expect(result.current.lead).toBeNull()
    })

    it('seleciona e limpa a moto', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        act(() => result.current.selecionarMoto(motos[0]))
        expect(result.current.motoSelecionada?.id).toBe(motos[0].id)
        act(() => result.current.limparMoto())
        expect(result.current.motoSelecionada).toBeNull()
    })

    it('soma os acessórios e não deixa repetir o mesmo item', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        const capacete = { id: 'cap-1', nome: 'Capacete', preco: 1500 }
        act(() => result.current.adicionarAcessorio(capacete))
        act(() => result.current.adicionarAcessorio(capacete)) // repetido: ignorado
        act(() => result.current.adicionarAcessorio({ id: 'lu-1', nome: 'Luvas', preco: 300 }))
        expect(result.current.acessorios).toHaveLength(2)
        expect(result.current.totalAcessorios).toBe(1800)
    })

    it('remove um acessório e atualiza o total', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        act(() => result.current.adicionarAcessorio({ id: 'a', nome: 'A', preco: 100 }))
        act(() => result.current.adicionarAcessorio({ id: 'b', nome: 'B', preco: 50 }))
        act(() => result.current.removerAcessorio('a'))
        expect(result.current.totalAcessorios).toBe(50)
        act(() => result.current.limparAcessorios())
        expect(result.current.acessorios).toEqual([])
    })

    it('guarda o lead registrado', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        act(() =>
            result.current.registrarLead({
                nome: 'Maria',
                email: 'm@e.com',
                telefone: '81999999999',
                consentimento: true,
                motoId: null,
            }),
        )
        expect(result.current.lead?.nome).toBe('Maria')
    })

    it('avisa com erro claro se usado fora do AppProvider', () => {
        expect(() => renderHook(() => useApp())).toThrow(/AppProvider/)
    })
})