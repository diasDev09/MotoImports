import type { ServicoAuth, Usuario } from '../auth/AuthContext.ts'

// Configuração vem do .env.local (veja .env.example). Esses valores NÃO são segredos:
// a segurança dos dados está nas regras do Firestore (firestore.rules), não em esconder a chave.
const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigurado = Object.values(config).every(Boolean)

// Os módulos do Firebase são carregados só quando necessário (import dinâmico):
// quem não está configurado, e os testes, nunca baixam esse código.
async function carregarAuth() {
    const [{ initializeApp, getApps, getApp }, auth] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
    ])
    const app = getApps().length > 0 ? getApp() : initializeApp(config)
    return { auth, instancia: auth.getAuth(app) }
}

export function criarServicoAuthFirebase(): ServicoAuth | null {
    if (!firebaseConfigurado) return null

    return {
        observar(aoMudar) {
            let cancelado = false
            let parar: (() => void) | undefined

            carregarAuth()
                .then(({ auth, instancia }) => {
                    if (cancelado) return
                    parar = auth.onAuthStateChanged(instancia, (u) => {
                        const usuario: Usuario | null = u
                            ? {
                                  uid: u.uid,
                                  nome: u.displayName ?? u.email ?? 'Cliente',
                                  email: u.email ?? '',
                                  foto: u.photoURL ?? undefined,
                              }
                            : null
                        aoMudar(usuario)
                    })
                })
                .catch(() => {
                    if (!cancelado) aoMudar(null)
                })

            return () => {
                cancelado = true
                parar?.()
            }
        },

        async entrarComGoogle() {
            const { auth, instancia } = await carregarAuth()
            await auth.signInWithPopup(instancia, new auth.GoogleAuthProvider())
        },

        async sair() {
            const { auth, instancia } = await carregarAuth()
            await auth.signOut(instancia)
        },
    }
}
