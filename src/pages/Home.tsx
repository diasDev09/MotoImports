import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CartaoDestaque from '../components/CartaoDestaque.tsx'
import NotaPreco from '../components/NotaPreco.tsx'
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

const botaoEscuro = 'botao inline-flex min-h-11 items-center px-6 py-3 text-sm'
const botaoContorno = 'botao-vazado inline-flex min-h-11 items-center px-6 py-3 text-sm'

// vitrine em zigue-zague: larguras 2/1/1/2, alturas e inclinações alternadas
const zigue = [
    'lg:mt-0 lg:-rotate-1',
    'lg:mt-12 lg:rotate-1',
    'lg:mt-4 lg:rotate-1',
    'lg:mt-16 lg:-rotate-1',
]

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

    // a nota de preço do herói usa a MT-07; se ela sair do catálogo, usa a primeira da vitrine
    const exemplo = motos.find((m) => m.id === 'yamaha-mt-07') ?? destaques[0]

    return (
        <>
            <section aria-labelledby="titulo-hero" className="overflow-x-clip">
                <div className="mx-auto grid max-w-site items-center gap-12 px-6 pb-12 pt-12 md:grid-cols-[1.15fr_1fr] md:pt-16">
                    <div>
                        {/* três linhas deslocadas, como cartaz colado; os espaços mantêm o texto corrido para leitores de tela */}
                        <h1 id="titulo-hero" className="text-[2.5rem] md:text-6xl">
                            <span className="block">Sua próxima moto</span>{' '}
                            <span className="block md:ml-10">já chega com</span>{' '}
                            <span className="block md:ml-20">
                                <span className="destaque">tudo pago.</span>
                            </span>
                        </h1>
                        <p className="mt-8 max-w-[56ch] text-lg">
                            Esportivas, nakeds, trails e customs importadas das melhores marcas do mundo. Frete,
                            imposto e importação já estão no valor, então não tem susto na hora de fechar.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/catalogo" className={botaoEscuro}>
                                Ver as motos
                            </Link>
                            <Link to="/simulador" className={botaoContorno}>
                                Simular parcelas
                            </Link>
                        </div>
                    </div>
                    {exemplo && <NotaPreco moto={exemplo} />}
                </div>
            </section>

            <section aria-label="Vantagens da loja" className="border-y-2 border-dashed border-cimento">
                <ul className="mx-auto grid max-w-site gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
                    {vantagens.map((v) => (
                        <li key={v.titulo} className="flex flex-col">
                            <strong className="font-display text-xl">{v.titulo}</strong>
                            <span className="text-sm text-suave">{v.texto}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-labelledby="titulo-destaques" className="overflow-x-clip py-20">
                <div className="mx-auto max-w-site px-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 id="titulo-destaques" className="text-4xl md:text-[2.5rem]">
                                Motos em <span className="destaque">destaque</span>
                            </h2>
                            <p className="mt-3 max-w-[56ch] text-suave">
                                Uma amostra do que tem no catálogo, de 300 a mais de 1.250 cilindradas.
                            </p>
                        </div>
                        <Link to="/catalogo" className={botaoContorno}>
                            Ver todas
                        </Link>
                    </div>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr]">
                        {destaques.map((m, i) => (
                            <div key={m.id} className={`flex flex-col ${zigue[i % zigue.length]}`}>
                                <CartaoDestaque moto={m} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="titulo-estilos" className="pb-20">
                <div className="mx-auto max-w-site px-6">
                    <h2 id="titulo-estilos" className="text-4xl md:text-[2.5rem]">
                        Qual é o seu jeito de <span className="destaque">pilotar?</span>
                    </h2>
                    {/* lista escalonada: cada linha entra um degrau para a direita no desktop */}
                    <div className="mt-10 flex flex-col gap-5">
                        {estilos.map((e, i) => (
                            <Link
                                key={e.nome}
                                to={`/catalogo?categoria=${encodeURIComponent(e.nome)}`}
                                style={{ '--degrau': `${i * 3}rem` } as CSSProperties}
                                className="folha folha-sombra flex min-h-11 flex-col gap-2 p-6 hover:translate-x-1 md:ml-(--degrau) md:flex-row md:items-baseline md:gap-6"
                            >
                                <h3 className="text-2xl md:w-56 md:shrink-0">{e.nome}</h3>
                                <p className="text-sm md:flex-1">{e.texto}</p>
                                <span className="text-sm font-bold">Ver motos →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="titulo-passos" className="overflow-x-clip pb-24">
                <div className="mx-auto max-w-site px-6">
                    <h2 id="titulo-passos" className="text-4xl md:text-[2.5rem]">
                        Do clique à <span className="destaque">garagem</span>
                    </h2>
                    <p className="mt-3 max-w-[56ch] text-suave">
                        Pode olhar o catálogo à vontade, não precisa de cadastro. Só pedimos seus dados quando
                        você quiser receber uma proposta.
                    </p>
                    {/* escada: cada passo desce um degrau */}
                    <ol className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {passos.map((p, i) => (
                            <li
                                key={p.titulo}
                                style={{ '--degrau': `${i * 2.5}rem` } as CSSProperties}
                                className="folha folha-sombra p-6 lg:mt-(--degrau)"
                            >
                                <span aria-hidden="true" className="font-display text-6xl font-bold text-sangue">
                                    {i + 1}
                                </span>
                                <h3 className="mt-2 text-2xl">{p.titulo}</h3>
                                <p className="mt-2 text-sm">{p.texto}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="sobre" aria-labelledby="titulo-sobre" className="border-y-2 border-dashed border-cimento py-20">
                <div className="mx-auto grid max-w-site gap-12 px-6 lg:grid-cols-2">
                    <div className="space-y-5">
                        <h2 id="titulo-sobre" className="text-4xl md:text-[2.5rem]">
                            Quem está por trás da Moto Imports
                        </h2>
                        <p className="max-w-[56ch] text-suave">
                            Muita gente desiste da moto importada por causa da burocracia, do imposto e do preço
                            que muda no final. Criamos a Moto Imports para tirar esse peso das costas do piloto.
                        </p>
                        <p className="max-w-[56ch] text-suave">
                            Trabalhamos com parceiros de importação em vários países, cuidamos da papelada e
                            entregamos um preço fechado. E a gente não some depois da venda: tem oficina para
                            revisão e garantia, e uma boutique com acessórios e capacetes certificados.
                        </p>
                    </div>

                    <ul className="space-y-5">
                        {diferenciais.map((d) => (
                            <li key={d.titulo} className="border-2 border-dashed border-linha p-6">
                                <h3 className="text-2xl">{d.titulo}</h3>
                                <p className="mt-2 text-sm text-suave">{d.texto}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="titulo-chamada" className="overflow-x-clip px-6 py-20">
                {/* faixa de fita crepe, levemente torta */}
                <div className="mx-auto max-w-site -rotate-1 bg-fita p-10 text-center text-tinta shadow-[8px_8px_0_var(--color-sangue)]">
                    <h2 id="titulo-chamada" className="text-4xl md:text-[2.5rem]">
                        Achou a sua? Vamos conversar.
                    </h2>
                    <p className="mx-auto mt-4 max-w-[56ch]">
                        Deixe seu contato e a equipe envia a proposta com ficha técnica e cotação por WhatsApp
                        ou e-mail.
                    </p>
                    <Link to="/contato" className="botao mt-8 inline-flex min-h-11 items-center px-6 py-3 text-sm">
                        Quero uma proposta
                    </Link>
                </div>
            </section>
        </>
    )
}
