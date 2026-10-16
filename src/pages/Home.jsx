import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ContaGiros from '../components/ContaGiros.jsx'
import CartaoDestaque from '../components/CartaoDestaque.jsx'
import { motos } from '../data/motos.js'

// faixa logo abaixo do topo, resume o que a loja oferece (RF-02, RF-05, RF-07 e RF-08)
const vantagens = [
  { titulo: 'Preço final', texto: 'Frete, importação e impostos já estão no valor.' },
  { titulo: 'Até 72x', texto: 'Simule financiamento ou consórcio na hora.' },
  { titulo: 'Test ride em vídeo', texto: 'Veja e ouça a moto antes de decidir.' },
  { titulo: 'Retire na loja', texto: 'Reserve pelo site e busque pessoalmente.' },
]

// ids das motos que aparecem na vitrine, tem que existir no motos.js
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
    .filter(Boolean)

  return (
    <>
      <section className="hero" aria-labelledby="titulo-hero">
        <div className="container hero-grade">
          <div>
            <h1 id="titulo-hero">Sua próxima moto já chega com tudo pago.</h1>
            <p>
              Esportivas, nakeds, trails e customs importadas das melhores marcas do mundo. Frete,
              imposto e importação já estão no valor, então não tem susto na hora de fechar.
            </p>
            <div className="hero-acoes">
              <Link to="/catalogo" className="btn btn-primario">
                Ver as motos
              </Link>
              <Link to="/simulador" className="btn btn-contorno">
                Simular parcelas
              </Link>
            </div>
          </div>
          <ContaGiros />
        </div>
      </section>

      <section className="vantagens" aria-label="Vantagens da loja">
        <ul className="container vantagens-grade">
          {vantagens.map((v) => (
            <li key={v.titulo}>
              <strong>{v.titulo}</strong>
              <span>{v.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="secao" aria-labelledby="titulo-destaques">
        <div className="container">
          <div className="secao-topo">
            <div>
              <h2 id="titulo-destaques">Motos em destaque</h2>
              <p>Uma amostra do que tem no catálogo, de 300 a mais de 1.250 cilindradas.</p>
            </div>
            <Link to="/catalogo" className="btn btn-contorno">
              Ver todas
            </Link>
          </div>
          <div className="destaques-grade">
            {destaques.map((m) => (
              <CartaoDestaque key={m.id} moto={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="estilos secao" aria-labelledby="titulo-estilos">
        <div className="container">
          <h2 id="titulo-estilos">Qual é o seu jeito de pilotar?</h2>
          <div className="estilos-grade">
            {estilos.map((e) => (
              <Link
                key={e.nome}
                to={`/catalogo?categoria=${encodeURIComponent(e.nome)}`}
                className="estilo"
              >
                <h3>{e.nome}</h3>
                <p>{e.texto}</p>
                <span>Ver motos</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="secao" aria-labelledby="titulo-passos">
        <div className="container">
          <h2 id="titulo-passos">Do clique à garagem</h2>
          <p>
            Pode olhar o catálogo à vontade, não precisa de cadastro. Só pedimos seus dados quando
            você quiser receber uma proposta.
          </p>
          <ol className="passos">
            {passos.map((p) => (
              <li key={p.titulo}>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sobre" className="sobre secao" aria-labelledby="titulo-sobre">
        <div className="container sobre-grade">
          <div>
            <h2 id="titulo-sobre">Quem está por trás da Moto Imports</h2>
            <p>
              Muita gente desiste da moto importada por causa da burocracia, do imposto e do preço
              que muda no final. Criamos a Moto Imports para tirar esse peso das costas do
              piloto.
            </p>
            <p>
              Trabalhamos com parceiros de importação em vários países, cuidamos da papelada e
              entregamos um preço fechado. E a gente não some depois da venda: tem oficina para
              revisão e garantia, e uma boutique com acessórios e capacetes certificados.
            </p>
          </div>

          <ul className="sobre-lista">
            {diferenciais.map((d) => (
              <li key={d.titulo}>
                <h3>{d.titulo}</h3>
                <p>{d.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="chamada secao" aria-labelledby="titulo-chamada">
        <div className="container">
          <h2 id="titulo-chamada">Achou a sua? Vamos conversar.</h2>
          <p>
            Deixe seu contato e a equipe envia a proposta com ficha técnica e cotação por WhatsApp
            ou e-mail.
          </p>
          <Link to="/contato" className="btn btn-primario">
            Quero uma proposta
          </Link>
        </div>
      </section>
    </>
  )
}