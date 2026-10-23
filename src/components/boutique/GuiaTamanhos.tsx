import { GUIA_TAMANHOS } from '../../data/boutique.ts'

export default function GuiaTamanhos() {
    return (
        <section className="folha folha-sombra mb-8 p-6" aria-labelledby="guia-titulo">
            <h3 id="guia-titulo" className="text-2xl">Como escolher o tamanho do capacete</h3>
            <p className="mt-2 text-sm">
                Use uma fita métrica ao redor da cabeça, cerca de 2 cm acima das sobrancelhas e logo acima das
                orelhas. Mantenha a fita nivelada e anote a circunferência em centímetros.
            </p>

            <table className="my-4 w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="bg-fita text-tinta">
                        <th className="border-2 border-linha p-2">Tamanho</th>
                        <th className="border-2 border-linha p-2">Circunferência aproximada</th>
                    </tr>
                </thead>
                <tbody>
                    {GUIA_TAMANHOS.map((linha) => (
                        <tr key={linha.tamanho}>
                            <td className="border-2 border-linha p-2">{linha.tamanho}</td>
                            <td className="border-2 border-linha p-2">{linha.circunferencia}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="text-sm">
                <strong>Importante:</strong> esta tabela é apenas uma referência. As medidas variam por fabricante e
                modelo. Consulte a tabela oficial da marca e experimente o capacete antes de pilotar. Ele deve ficar
                firme, sem pontos de pressão dolorosos.
            </p>
        </section>
    )
}