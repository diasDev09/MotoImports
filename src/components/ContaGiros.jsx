import { useEffect, useState } from 'react'

const CX = 200
const CY = 200
const RAIO = 160
const ANGULO_INICIO = 150
const ANGULO_TOTAL = 240
const MARCAS = 13
const ZONA_VERMELHA_INICIO = 10
const VALOR_FINAL = 9.5

// converte a posição no mostrador (0 a 12) em graus
function angulo(valor) {
  return ANGULO_INICIO + (valor / (MARCAS - 1)) * ANGULO_TOTAL
}

// converte ângulo e raio em coordenadas x e y do SVG (trigonometria básica)
function ponto(graus, raio) {
  const rad = (graus * Math.PI) / 180
  return { x: CX + raio * Math.cos(rad), y: CY + raio * Math.sin(rad) }
}

// monta o desenho de um arco de círculo entre dois ângulos
function arco(de, ate, raio) {
  const a = ponto(de, raio)
  const b = ponto(ate, raio)
  const grande = ate - de > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${raio} ${raio} 0 ${grande} 1 ${b.x} ${b.y}`
}

export default function ContaGiros() {
  // a agulha começa em 0 e sobe até o valor final quando a página carrega,
  // a animação em si é uma transição de CSS (veja .cg-agulha no home.css)
  const [valor, setValor] = useState(0)

  // A agulha sobe uma vez quando a página carrega.
  useEffect(() => {
    const id = requestAnimationFrame(() => setValor(VALOR_FINAL))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg
      className="conta-giros"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Conta-giros marcando zero taxas surpresa no preço final"
    >
      <path
        className="cg-trilha"
        d={arco(ANGULO_INICIO, ANGULO_INICIO + ANGULO_TOTAL, RAIO)}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        className="cg-faixa"
        d={arco(angulo(ZONA_VERMELHA_INICIO), angulo(MARCAS - 1), RAIO)}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {Array.from({ length: MARCAS }, (_, i) => {
        const a = angulo(i)
        const fora = ponto(a, RAIO - 14)
        const dentro = ponto(a, RAIO - 32)
        const num = ponto(a, RAIO - 56)
        return (
          <g key={i}>
            <line
              className="cg-marca"
              x1={fora.x}
              y1={fora.y}
              x2={dentro.x}
              y2={dentro.y}
              strokeWidth="3"
            />
            <text
              className="cg-numero"
              x={num.x}
              y={num.y}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {i}
            </text>
          </g>
        )
      })}

      <line
        className="cg-agulha"
        x1={CX + 60}
        y1={CY}
        x2={CX + RAIO - 26}
        y2={CY}
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          transform: `rotate(${angulo(valor)}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      />
      <circle className="cg-miolo" cx={CX} cy={CY} r="56" strokeWidth="3" />
      <text className="cg-valor" x={CX} y={CY + 6} textAnchor="middle">
        R$ 0
      </text>
      <text className="cg-legenda" x={CX} y={CY + 30} textAnchor="middle">
        de taxa surpresa
      </text>
    </svg>
  )
}