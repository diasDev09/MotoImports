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

    return (
        <section className="py-12">
            <div className="mx-auto max-w-xl px-6">
                <h1 className="text-4xl">Fale com a equipe</h1>
                <p className="mt-3 text-musgo-600">
                    Preencha seus dados e retornamos com a proposta da sua próxima moto.
                </p>

                {motoSelecionada && urlVideo && (
                    <div className="mt-6">
                        <VideoTestRide urlVideo={urlVideo} titulo={`Test-ride da ${motoSelecionada.nome}`} />
                    </div>
                )}

                <LeadForm aoEnviar={registrarLead} motoInteresse={motoSelecionada} />

                {lead && (
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setPropostaAberta(true)}
                            className="rounded-lg bg-musgo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-900"
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