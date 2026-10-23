import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ContaGiros from '../components/ContaGiros.tsx'
import CartaoDestaque from '../components/CartaoDestaque.tsx'
import { motos } from '../data/motos.ts'
import type { Moto } from '../data/motos.ts'

// faixa logo abaixo do topo, resume o que a loja oferece (RF-02, RF-05, RF-07 e RF-08)
const vantagens = [
    { titulo: 'Preço final', texto: 'Frete, importação e impostos já estão no valor.' },
    { titulo: 'Até 72x', texto: 'Simule financiamento ou consórcio na hora.' },
    { titulo: 'Test ride em vídeo', texto: 'Veja e ouça a moto antes de decidir.' },
    { titulo: 'Retire na loja', texto: 'Reserve pelo site e busque pessoalmente.' },
]

// ids das motos que aparecem na vitrine, tem que existir no motos.ts
const idsDestaque = [
    'ducati-panigale-v2',
    'yamaha-mt-07',
    'bmw-r-1250-gs',
    'harley-davidson-fat-boy',
]

// o link leva para o catálogo já filtrado (a página do catálogo lê o ?categoria= da URL)
const estilos = [
    { nome: 'Sport', texto: 'Pista no sangue. Velocidade, curva e eletrônica de ponta.' },
    { nome: 'Naked', texto: 'Pegada urbana, torque forte e a mecânica à mostra.' },
    { nome: 'Trail/Adventure', texto: 'Asfalto, estrada de terra e muito quilômetro pela frente.' },
    { nome: 'Custom', texto: 'Estrada aberta, motor grave e estilo de sobra.' },
]

const passos = [
    { titulo: 'Escolha', texto: 'Filtre por tipo de moto, cilindrada e modo de pilotagem.' },
    { titulo: 'Compare', texto: 'Confira a ficha técnica, o preço e o vídeo de test ride.' },
    { titulo: 'Simule', texto: 'Veja as parcelas no financiamento ou no consórcio e escolha os acessórios.' },
    { titulo: 'Feche', texto: 'Peça a proposta por WhatsApp ou e-mail, ou reserve e retire na loja.' },
]

const diferenciais = [
    {
        titulo: 'Importação resolvida',
        texto: 'Parceiros e despachantes cuidam do frete, da documentação e da liberação na alfândega.',
    },
    {
        titulo: 'Preço que não muda',
        texto: 'O valor do site já inclui frete alfandegário, despacho e impostos.',
    },
    {
        titulo: 'Oficina e boutique',
        texto: 'Revisão de garantia, troca de fluidos, preparação de pista, acessórios e capacetes.',
    },
]

const botaoEscuro =
    'inline-flex items-center rounded-lg bg-musgo-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600'
const botaoContorno =
    'inline-flex items-center rounded-lg border border-musgo-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-musgo-200'

export default function Home() {
    const { hash, key } = useLocation()

    // o React Router não rola até a âncora sozinho, então rolamos aqui.
    // O "key" faz funcionar de novo quando clicam no mesmo link duas vezes.
    useEffect(() => {
        if (!hash) return
        document.querySelector(hash)?.scrollIntoView()
    }, [hash, key])

    const destaques = idsDestaque
        .map((id) => motos.find((m) => m.id === id))
        .filter((m): m is Moto => m !== undefined)

    return (
        <>
            <section aria-labelledby="titulo-hero" className="mx-auto max-w-site px-6 pt-8">
                <div className="grid items-center gap-8 rounded-card bg-white/70 p-8 md:grid-cols-2 md:p-12">
                    <div>
                        <h1 id="titulo-hero" className="text-4xl uppercase leading-tight md:text-5xl">
                            Sua próxima moto já chega com <span className="destaque">tudo pago.</span>
                        </h1>
                        <p className="mt-5 text-lg">
                            Esportivas, nakeds, trails e customs importadas das melhores marcas do mundo. Frete,
                            imposto e importação já estão no valor, então não tem susto na hora de fechar.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/catalogo" className={botaoEscuro}>
                                Ver as motos
                            </Link>
                            <Link to="/simulador" className={botaoContorno}>
                                Simular parcelas
                            </Link>
                        </div>
                    </div>
                    <ContaGiros />
                </div>
            </section>

            <section aria-label="Vantagens da loja" className="mt-10 bg-musgo-400 text-musgo-900">
                <ul className="mx-auto grid max-w-site gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
                    {vantagens.map((v) => (
                        <li key={v.titulo} className="flex flex-col">
                            <strong className="font-display text-lg">{v.titulo}</strong>
                            <span className="text-sm font-medium">{v.texto}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-labelledby="titulo-destaques" className="py-16">
                <div className="mx-auto max-w-site px-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 id="titulo-destaques" className="text-3xl uppercase">
                                Motos em <span className="destaque">destaque</span>
                            </h2>
                            <p className="mt-2 text-musgo-600">
                                Uma amostra do que tem no catálogo, de 300 a mais de 1.250 cilindradas.
                            </p>
                        </div>
                        <Link to="/catalogo" className={botaoContorno}>
                            Ver todas
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {destaques.map((m) => (
                            <CartaoDestaque key={m.id} moto={m} />
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="titulo-estilos" className="pb-16">
                <div className="mx-auto max-w-site px-6">
                    <h2 id="titulo-estilos" className="text-3xl uppercase">
                        Qual é o seu jeito de <span className="destaque">pilotar?</span>
                    </h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {estilos.map((e) => (
                            <Link
                                key={e.nome}
                                to={`/catalogo?categoria=${encodeURIComponent(e.nome)}`}
                                className="flex flex-col gap-2 rounded-card bg-musgo-200 p-6 hover:bg-musgo-400"
                            >
                                <h3 className="text-xl">{e.nome}</h3>
                                <p className="text-sm">{e.texto}</p>
                                <span className="mt-auto pt-2 text-sm font-semibold">Ver motos →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="titulo-passos" className="pb-16">
                <div className="mx-auto max-w-site px-6">
                    <h2 id="titulo-passos" className="text-3xl uppercase">
                        Do clique à <span className="destaque">garagem</span>
                    </h2>
                    <p className="mt-2 max-w-2xl text-musgo-600">
                        Pode olhar o catálogo à vontade, não precisa de cadastro. Só pedimos seus dados quando
                        você quiser receber uma proposta.
                    </p>
                    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {passos.map((p, i) => (
                            <li key={p.titulo} className="rounded-card border border-musgo-200 bg-white p-6">
                                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-musgo-600">
                                    {i + 1}
                                </span>
                                <h3 className="mt-2 text-xl">{p.titulo}</h3>
                                <p className="mt-1 text-sm">{p.texto}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="sobre" aria-labelledby="titulo-sobre" className="bg-musgo-900 py-16 text-musgo-50">
                <div className="mx-auto grid max-w-site gap-10 px-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <h2 id="titulo-sobre" className="text-3xl uppercase">
                            Quem está por trás da Moto Imports
                        </h2>
                        <p className="text-musgo-200">
                            Muita gente desiste da moto importada por causa da burocracia, do imposto e do preço
                            que muda no final. Criamos a Moto Imports para tirar esse peso das costas do piloto.
                        </p>
                        <p className="text-musgo-200">
                            Trabalhamos com parceiros de importação em vários países, cuidamos da papelada e
                            entregamos um preço fechado. E a gente não some depois da venda: tem oficina para
                            revisão e garantia, e uma boutique com acessórios e capacetes certificados.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        {diferenciais.map((d) => (
                            <li key={d.titulo} className="rounded-card border border-musgo-600 p-6">
                                <h3 className="text-xl">{d.titulo}</h3>
                                <p className="mt-1 text-sm text-musgo-200">{d.texto}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="titulo-chamada" className="px-6 py-16">
                <div className="mx-auto max-w-site rounded-card bg-musgo-600 p-10 text-center text-white">
                    <h2 id="titulo-chamada" className="text-3xl uppercase">
                        Achou a sua? Vamos conversar.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl">
                        Deixe seu contato e a equipe envia a proposta com ficha técnica e cotação por WhatsApp
                        ou e-mail.
                    </p>
                    <Link
                        to="/contato"
                        className="mt-6 inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-musgo-900 hover:bg-musgo-200"
                    >
                        Quero uma proposta
                    </Link>
                </div>
            </section>
        </>
    )
}