import type { ServicoAuth, Usuario } from '../auth/AuthContext.ts'

// Serviço de login falso para os testes: sem rede, sem Firebase.
// Começa logado (usuario) ou anônimo (null); entrarComGoogle "loga" o usuário informado.
export const USUARIO_TESTE: Usuario = {
    uid: 'u-teste',
    nome: 'Maria Teste',
    email: 'maria@exemplo.com',
}

export function criarServicoFalso(inicial: Usuario | null = USUARIO_TESTE, aoEntrar: Usuario = USUARIO_TESTE) {
    let ouvinte: ((u: Usuario | null) => void) | null = null
    const chamadas = { entrar: 0, sair: 0 }

    const servico: ServicoAuth = {
        observar(aoMudar) {
            ouvinte = aoMudar
            aoMudar(inicial)
            return () => {
                ouvinte = null
            }
        },
        async entrarComGoogle() {
            chamadas.entrar++
            ouvinte?.(aoEntrar)
        },
        async sair() {
            chamadas.sair++
            ouvinte?.(null)
        },
    }
    return { servico, chamadas }
}
