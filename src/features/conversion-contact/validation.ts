import { z } from 'zod'

const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Informe seu nome com pelo menos 3 caracteres.')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, 'Use apenas letras e espaços no nome.'),
  whatsapp: z
    .string()
    .trim()
    .refine((value) => {
      const digits = onlyDigits(value)
      return digits.length === 10 || digits.length === 11
    }, 'Informe um WhatsApp com DDD.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  city: z
    .string()
    .trim()
    .min(2, 'Informe sua cidade.')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' .-]+$/, 'Informe uma cidade válida.'),
})

export type LeadFormValues = z.infer<typeof leadSchema>

export function formatWhatsapp(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
