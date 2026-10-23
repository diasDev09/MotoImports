import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppProvider } from './AppProvider.tsx'
import { useApp } from './AppContext.ts'
import { motos } from '../data/motos.ts'
import { simularOperacao } from '../domain/financing.ts'
import { criarVoucherReserva } from '../domain/reservation.ts'

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

    it('começa com o estado inicial recebido (usado nos testes das páginas)', () => {
        const { result } = renderHook(() => useApp(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <AppProvider inicial={{ moto: motos[0], acessorios: [{ id: 'a', nome: 'A', preco: 10 }] }}>{children}</AppProvider>
            ),
        })
        expect(result.current.motoSelecionada?.id).toBe(motos[0].id)
        expect(result.current.totalAcessorios).toBe(10)
    })

    it('guarda a simulação e permite limpar', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        expect(result.current.simulacao).toBeNull()

        const simulacao = simularOperacao({ moto: { preco: 100000 }, meses: 24 })
        act(() => result.current.salvarSimulacao(simulacao))
        expect(result.current.simulacao?.meses).toBe(24)

        act(() => result.current.salvarSimulacao(null))
        expect(result.current.simulacao).toBeNull()
    })

    it('guarda o voucher da reserva e permite começar outra', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        expect(result.current.voucherReserva).toBeNull()

        const voucher = criarVoucherReserva({
            moto: motos[0],
            cliente: { nome: 'Maria Silva', telefone: '81999999999', email: 'm@e.com', cidade: 'Recife' },
            lojaId: 'sp-jardins',
        })
        act(() => result.current.salvarVoucherReserva(voucher))
        expect(result.current.voucherReserva?.codigo).toMatch(/^MI-\d{4}-SP-/)

        act(() => result.current.salvarVoucherReserva(null))
        expect(result.current.voucherReserva).toBeNull()
    })

    it('guarda o lead registrado', () => {
        const { result } = renderHook(() => useApp(), { wrapper })
        act(() =>
            result.current.registrarLead({
                nome: 'Maria',
                email: 'm@e.com',
                telefone: '81999999999',
                cidade: 'Recife',
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