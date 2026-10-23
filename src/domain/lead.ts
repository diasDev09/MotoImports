// RF-01 / RNF-05: validação do lead (contato do interessado).
// Fica no domínio, sem React, para ser testada sozinha e reaproveitada.
import { z } from 'zod'

// deixa só os dígitos: "(81) 99999-9999" -> "81999999999"
export function somenteDigitos(texto: string): string {
    return texto.replace(/\D/g, '')
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