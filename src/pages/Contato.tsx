import LeadForm from '../components/LeadForm.tsx'
import { useApp } from '../context/AppContext.ts'

export default function Contato() {
    const { motoSelecionada, registrarLead } = useApp()

    return (
        <section className="py-12">
            <div className="mx-auto max-w-xl px-6">
                <h1 className="text-4xl">Fale com a equipe</h1>
                <p className="mt-3 text-musgo-600">
                    Preencha seus dados e retornamos com a proposta da sua próxima moto.
                </p>
                <LeadForm aoEnviar={registrarLead} motoInteresse={motoSelecionada} />
            </div>
        </section>
    )
}