import type { Repositorio } from '../storage/Repositorio.ts'
import { paraDocumento } from '../storage/documentos.ts'
import { carregarApp, firebaseConfigurado } from './firebase.ts'

// Estrutura no banco (as regras em firestore.rules espelham isto):
//   users/{uid}/reservas/{codigo}   voucher de reserva (id = código do voucher)
//   users/{uid}/pedidosBoutique/{id}
//   users/{uid}/agendamentos/{id}
//   leads/{id}                      contatos (qualquer pessoa cria, ninguém lê pelo site)
// Todo documento leva "uid" (quando há dono) e "criadoEm" (carimbo do servidor, não do relógio do cliente).

async function carregarBanco() {
    const [app, fs] = await Promise.all([carregarApp(), import('firebase/firestore')])
    return { fs, db: fs.getFirestore(app) }
}

export function criarRepositorioFirestore(): Repositorio | null {
    if (!firebaseConfigurado) return null

    return {
        async salvarReserva(uid, voucher) {
            const { fs, db } = await carregarBanco()
            await fs.setDoc(fs.doc(db, 'users', uid, 'reservas', voucher.codigo), {
                uid,
                codigo: voucher.codigo,
                voucher: paraDocumento(voucher),
                criadoEm: fs.serverTimestamp(),
            })
        },

        async salvarPedidoBoutique(uid, pedido) {
            const { fs, db } = await carregarBanco()
            await fs.addDoc(fs.collection(db, 'users', uid, 'pedidosBoutique'), {
                uid,
                ...paraDocumento(pedido),
                criadoEm: fs.serverTimestamp(),
            })
        },

        async salvarAgendamento(uid, agendamento) {
            const { fs, db } = await carregarBanco()
            await fs.addDoc(fs.collection(db, 'users', uid, 'agendamentos'), {
                uid,
                ...paraDocumento(agendamento),
                criadoEm: fs.serverTimestamp(),
            })
        },

        async salvarLead(lead, uid) {
            const { fs, db } = await carregarBanco()
            await fs.addDoc(fs.collection(db, 'leads'), {
                ...paraDocumento(lead),
                ...(uid ? { uid } : {}),
                criadoEm: fs.serverTimestamp(),
            })
        },
    }
}
