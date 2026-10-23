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
function angulo(valor: number): number {
    return ANGULO_INICIO + (valor / (MARCAS - 1)) * ANGULO_TOTAL
}

// converte ângulo e raio em coordenadas x e y do SVG (trigonometria básica)
function ponto(graus: number, raio: number): { x: number; y: number } {
    const rad = (graus * Math.PI) / 180
    return { x: CX + raio * Math.cos(rad), y: CY + raio * Math.sin(rad) }
}

// monta o desenho de um arco de círculo entre dois ângulos
function arco(de: number, ate: number, raio: number): string {
    const a = ponto(de, raio)
    const b = ponto(ate, raio)
    const grande = ate - de > 180 ? 1 : 0
    return `M ${a.x} ${a.y} A ${raio} ${raio} 0 ${grande} 1 ${b.x} ${b.y}`
}

// Conta-giros do hero (porte da v1, da Emilly).
export default function ContaGiros() {
    // a agulha começa em 0 e sobe até o valor final quando a página carrega;
    // a animação em si é uma transição de CSS (classes `transition-transform` na agulha)
    const [valor, setValor] = useState(0)

    useEffect(() => {
        const id = requestAnimationFrame(() => setValor(VALOR_FINAL))
        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <svg
            className="mx-auto w-full max-w-md"
            viewBox="0 0 400 400"
            role="img"
            aria-label="Conta-giros marcando zero taxas surpresa no preço final"
        >
            <path
                className="stroke-tinta/30"
                d={arco(ANGULO_INICIO, ANGULO_INICIO + ANGULO_TOTAL, RAIO)}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
            />
            <path
                className="stroke-sangue"
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
                            className="stroke-tinta"
                            x1={fora.x}
                            y1={fora.y}
                            x2={dentro.x}
                            y2={dentro.y}
                            strokeWidth="3"
                        />
                        <text
                            className="fill-tinta font-display text-base font-bold"
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
                data-testid="agulha"
                className="stroke-sangue transition-transform duration-1800ms ease-out motion-reduce:transition-none"
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
            <circle className="fill-papel stroke-tinta" cx={CX} cy={CY} r="56" strokeWidth="3" />
            <text className="fill-tinta font-display text-3xl font-bold" x={CX} y={CY + 6} textAnchor="middle">
                R$ 0
            </text>
            <text className="fill-tinta text-xs" x={CX} y={CY + 30} textAnchor="middle">
                de taxa surpresa
            </text>
        </svg>
    )
}