// RF-01 / RNF-05: validação do lead (contato do interessado).
// Fica no domínio, sem React, para ser testada sozinha e reaproveitada.
import { z } from 'zod'

// deixa só os dígitos: "(81) 99999-9999" -> "81999999999"
export function somenteDigitos(texto: string): string {
    return texto.replace(/\D/g, '')
}

// máscara de telefone enquanto a pessoa digita (porte da v1, da Mylena):
// "81999999999" -> "(81) 99999-9999"; aceita fixo (10 dígitos) e celular (11)
export function formatarTelefone(valor: string): string {
    const d = somenteDigitos(valor).slice(0, 11)

    if (d.length <= 2) return d
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const leadSchema = z.object({
    nome: z.string().trim().min(2, 'Informe seu nome (mínimo 2 letras).'),
    email: z.email('Informe um e-mail válido, como nome@exemplo.com.'),
    // telefone brasileiro com DDD: 10 dígitos (fixo) ou 11 (celular)
    telefone: z
        .string()
        .refine((valor) => /^\d{10,11}$/.test(somenteDigitos(valor)), {
            message: 'Informe o telefone com DDD, por exemplo (81) 99999-9999.',
        })
        .transform(somenteDigitos),
    // cidade (da v1, da Mylena). \p{L} aceita qualquer letra, inclusive o apóstrofo curvo do celular
    cidade: z
        .string()
        .trim()
        .min(2, 'Informe sua cidade.')
        .regex(/^[\p{L}'’ .-]+$/u, 'Informe uma cidade válida.'),
    mensagem: z.string().trim().max(500, 'A mensagem pode ter no máximo 500 caracteres.').optional(),
    // RNF-05 (LGPD): sem consentimento explícito, não há envio
    consentimento: z.boolean().refine((valor) => valor === true, {
        message: 'Para continuar, aceite o uso dos seus dados para contato.',
    }),
})

// o que o formulário preenche (antes de transformar) e o que sai validado
export type LeadEntrada = z.input<typeof leadSchema>
export type Lead = z.output<typeof leadSchema>

// lead guardado no app: o lead validado + a moto de interesse (se houver)
export type LeadRegistrado = Lead & { motoId: string | null }