import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthProvider.tsx'
import ExigeLogin from './ExigeLogin.tsx'
import { criarServicoFalso } from '../test/servicoAuth.ts'
import type { ServicoAuth } from './AuthContext.ts'

describe('ExigeLogin', () => {
    it('mostra o conteúdo para quem está logado', () => {
        const { servico } = criarServicoFalso()
        render(<AuthProvider servico={servico}><ExigeLogin motivo="comprar"><p>área da compra</p></ExigeLogin></AuthProvider>)
        expect(screen.getByText('área da compra')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Entrar com Google' })).not.toBeInTheDocument()
    })

    it('esconde o conteúdo e convida a entrar quando anônimo', async () => {
        const user = userEvent.setup()
        const { servico, chamadas } = criarServicoFalso(null)
        render(<AuthProvider servico={servico}><ExigeLogin motivo="reservar a moto"><p>área da compra</p></ExigeLogin></AuthProvider>)

        expect(screen.queryByText('área da compra')).not.toBeInTheDocument()
        expect(screen.getByText(/para reservar a moto/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Entrar com Google' }))
        expect(chamadas.entrar).toBe(1)
        // depois do login o conteúdo aparece sozinho
        expect(await screen.findByText('área da compra')).toBeInTheDocument()
    })

    it('em modo página usa o título principal h1', () => {
        const { servico } = criarServicoFalso(null)
        render(<AuthProvider servico={servico}><ExigeLogin pagina motivo="x"><p>y</p></ExigeLogin></AuthProvider>)
        expect(screen.getByRole('heading', { level: 1, name: /entre para continuar/i })).toBeInTheDocument()
    })

    it('enquanto verifica o login, não mostra o conteúdo nem o convite', () => {
        const pendente: ServicoAuth = { observar: () => () => {}, entrarComGoogle: async () => {}, sair: async () => {} }
        render(<AuthProvider servico={pendente}><ExigeLogin motivo="x"><p>y</p></ExigeLogin></AuthProvider>)
        expect(screen.getByRole('status')).toHaveTextContent(/verificando/i)
        expect(screen.queryByText('y')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Entrar com Google' })).not.toBeInTheDocument()
    })

    it('sem Firebase configurado, o botão fica desativado e há um aviso', () => {
        render(<AuthProvider servico={null}><ExigeLogin motivo="x"><p>y</p></ExigeLogin></AuthProvider>)
        expect(screen.getByRole('button', { name: 'Entrar com Google' })).toBeDisabled()
        expect(screen.getByText(/ainda não foi configurado/i)).toBeInTheDocument()
    })
})
