import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthProvider.tsx'
import { useAuth } from './AuthContext.ts'
import { criarServicoFalso, USUARIO_TESTE } from '../test/servicoAuth.ts'
import type { ServicoAuth } from './AuthContext.ts'

function Painel() {
    const { estado, usuario, disponivel, erro, entrar, sair } = useAuth()
    return (
        <div>
            <output data-testid="estado">{estado}</output>
            <output data-testid="nome">{usuario?.nome ?? '-'}</output>
            <output data-testid="disponivel">{String(disponivel)}</output>
            <output data-testid="erro">{erro ?? '-'}</output>
            <button onClick={() => void entrar()}>entrar</button>
            <button onClick={() => void sair()}>sair</button>
        </div>
    )
}

describe('AuthProvider', () => {
    it('começa anônimo quando não há sessão e loga ao entrar com o Google', async () => {
        const user = userEvent.setup()
        const { servico, chamadas } = criarServicoFalso(null)
        render(<AuthProvider servico={servico}><Painel /></AuthProvider>)

        expect(screen.getByTestId('estado')).toHaveTextContent('anonimo')
        await user.click(screen.getByRole('button', { name: 'entrar' }))

        await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('logado'))
        expect(screen.getByTestId('nome')).toHaveTextContent(USUARIO_TESTE.nome)
        expect(chamadas.entrar).toBe(1)
    })

    it('restaura a sessão aberta e permite sair', async () => {
        const user = userEvent.setup()
        const { servico, chamadas } = criarServicoFalso(USUARIO_TESTE)
        render(<AuthProvider servico={servico}><Painel /></AuthProvider>)

        expect(screen.getByTestId('estado')).toHaveTextContent('logado')
        await user.click(screen.getByRole('button', { name: 'sair' }))

        await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('anonimo'))
        expect(chamadas.sair).toBe(1)
    })

    it('fica "carregando" até o provedor responder', () => {
        const semResposta: ServicoAuth = {
            observar: () => () => {},
            entrarComGoogle: async () => {},
            sair: async () => {},
        }
        render(<AuthProvider servico={semResposta}><Painel /></AuthProvider>)
        expect(screen.getByTestId('estado')).toHaveTextContent('carregando')
    })

    it('sem Firebase configurado, fica anônimo, indisponível e avisa ao tentar entrar', async () => {
        const user = userEvent.setup()
        render(<AuthProvider servico={null}><Painel /></AuthProvider>)

        expect(screen.getByTestId('estado')).toHaveTextContent('anonimo')
        expect(screen.getByTestId('disponivel')).toHaveTextContent('false')
        await user.click(screen.getByRole('button', { name: 'entrar' }))
        expect(screen.getByTestId('erro')).toHaveTextContent(/ainda não foi configurado/i)
    })

    it('fechar a janela do Google não vira mensagem de erro', async () => {
        const user = userEvent.setup()
        const fechou: ServicoAuth = {
            observar: (cb) => (cb(null), () => {}),
            entrarComGoogle: () => Promise.reject({ code: 'auth/popup-closed-by-user' }),
            sair: async () => {},
        }
        render(<AuthProvider servico={fechou}><Painel /></AuthProvider>)
        await user.click(screen.getByRole('button', { name: 'entrar' }))
        expect(screen.getByTestId('erro')).toHaveTextContent('-')
    })

    it('mostra aviso claro quando o navegador bloqueia o popup', async () => {
        const user = userEvent.setup()
        const bloqueado: ServicoAuth = {
            observar: (cb) => (cb(null), () => {}),
            entrarComGoogle: () => Promise.reject({ code: 'auth/popup-blocked' }),
            sair: async () => {},
        }
        render(<AuthProvider servico={bloqueado}><Painel /></AuthProvider>)
        await user.click(screen.getByRole('button', { name: 'entrar' }))
        expect(await screen.findByTestId('erro')).toHaveTextContent(/bloqueou a janela/i)
    })

    it('useAuth fora do provider avisa com um erro claro', () => {
        expect(() => render(<Painel />)).toThrow(/AuthProvider/)
    })
})
