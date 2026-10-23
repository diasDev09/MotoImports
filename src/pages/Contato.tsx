import { useAuthOpcional } from '../auth/AuthContext.ts'
import { useRepositorio } from '../storage/Repositorio.ts'
import type { LeadRegistrado } from '../domain/lead.ts'
import { useState } from 'react'
import LeadForm from '../components/LeadForm.tsx'
import ProposalModal from '../components/ProposalModal.tsx'
import VideoTestRide from '../components/VideoTestRide.tsx'
import { useApp } from '../context/AppContext.ts'
import { formatarPreco } from '../utils/formatters.ts'

export default function Contato() {
    const { motoSelecionada, lead, registrarLead } = useApp()
    const [propostaAberta, setPropostaAberta] = useState(false)

    const urlVideo = motoSelecionada?.videoUrl
    const auth = useAuthOpcional()
    const repositorio = useRepositorio()

    // O contato é público: se guardar no banco falhar, a pessoa não é barrada (o lead continua no app).
    // O erro só vai para o console, para quem mantém o site investigar.
    function enviarLead(novo: LeadRegistrado) {
        registrarLead(novo)
        repositorio?.salvarLead(novo, auth?.usuario?.uid).catch((e: unknown) => {
            console.error('Não foi possível guardar o contato', e)
        })
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-xl px-6">
                <h1 className="text-5xl md:text-6xl">Fale com a equipe</h1>
                <p className="mt-3 text-suave">
                    Preencha seus dados e retornamos com a proposta da sua próxima moto.
                </p>

                {motoSelecionada && urlVideo && (
                    <div className="mt-6">
                        <VideoTestRide urlVideo={urlVideo} titulo={`Test-ride da ${motoSelecionada.nome}`} />
                    </div>
                )}

                <LeadForm aoEnviar={enviarLead} motoInteresse={motoSelecionada} />

                {lead && (
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setPropostaAberta(true)}
                            className="botao min-h-11 px-6 py-3 text-sm"
                        >
                            Receber proposta
                        </button>
                        <ProposalModal
                            aberto={propostaAberta}
                            lead={lead}
                            contexto={{
                                nomeMoto: motoSelecionada?.nome,
                                preco: motoSelecionada ? formatarPreco(motoSelecionada.preco) : undefined,
                            }}
                            aoFechar={() => setPropostaAberta(false)}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}