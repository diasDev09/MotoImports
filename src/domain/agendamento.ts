// Pós-venda: validação do pedido de agendamento (porte da v1, da Ariely).
// Na v1 a validação era feita com alert(); aqui as mensagens aparecem junto de cada campo.
import { z } from 'zod'
import { HORARIOS, SERVICOS } from '../data/posVenda.ts'
import { somenteDigitos } from './lead.ts'

// "2026-10-23", no fuso do navegador (toISOString usaria UTC e viraria o dia à noite)
export function dataIsoLocal(data: Date = new Date()): string {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

// "2026-10-23" -> "23/10/2026"
export function formatarDataIso(iso: string): string {
    return iso.split('-').reverse().join('/')
}

const idsServico = SERVICOS.map((s) => s.id) as [string, ...string[]]

// "hoje" entra como parâmetro: assim dá para testar sem depender do relógio
export function criarAgendamentoSchema(hoje: string = dataIsoLocal()) {
    return z.object({
        servico: z.enum(idsServico, { error: 'Selecione o serviço desejado.' }),
        nome: z.string().trim().min(3, 'Informe seu nome completo.'),
        telefone: z
            .string()
            .refine((valor) => /^\d{10,11}$/.test(somenteDigitos(valor)), {
                message: 'Informe o telefone com DDD, por exemplo (81) 99999-9999.',
            })
            .transform(somenteDigitos),
        moto: z.string().trim().min(2, 'Informe o modelo da sua moto.'),
        data: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Escolha a data desejada.')
            .refine((data) => data >= hoje, { message: 'Escolha uma data de hoje em diante.' }),
        horario: z.enum(HORARIOS, { error: 'Escolha um horário.' }),
        observacoes: z.string().trim().max(500, 'Use no máximo 500 caracteres.').optional(),
        // RNF-05 (LGPD): o agendamento guarda nome e telefone, então também precisa de consentimento
        consentimento: z.boolean().refine((valor) => valor === true, {
            message: 'Para agendar, aceite o uso dos seus dados para contato.',
        }),
    })
}

export type AgendamentoEntrada = z.input<ReturnType<typeof criarAgendamentoSchema>>
export type Agendamento = z.output<ReturnType<typeof criarAgendamentoSchema>>