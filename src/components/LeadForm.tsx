import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema } from '../domain/lead.ts'
import type { Lead, LeadEntrada, LeadRegistrado } from '../domain/lead.ts'

const estiloInput = 'rounded-lg border border-musgo-400 bg-white px-3 py-2 text-musgo-900'

// Campo reutilizável: rótulo ligado ao input, erro anunciado por leitores de tela.
function Campo({
    id,
    rotulo,
    erro,
    children,
}: {
    id: string
    rotulo: string
    erro?: string
    children: ReactNode
}) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm">
                {rotulo}
            </label>
            {children}
            {erro && (
                <p id={`${id}-erro`} role="alert" className="text-sm font-medium text-erro">
                    {erro}
                </p>
            )}
        </div>
    )
}

interface LeadFormProps {
    aoEnviar: (lead: LeadRegistrado) => void
    motoInteresse?: { id: string; nome: string } | null
}

export default function LeadForm({ aoEnviar, motoInteresse }: LeadFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm<LeadEntrada, unknown, Lead>({
        resolver: zodResolver(leadSchema),
        defaultValues: { nome: '', email: '', telefone: '', mensagem: '', consentimento: false },
    })

    function enviar(dados: Lead) {
        // dados já chegam validados e com o telefone só com dígitos
        aoEnviar({ ...dados, motoId: motoInteresse?.id ?? null })
        reset()
    }

    // props comuns a todos os inputs: ligação com o erro e estado inválido (acessibilidade)
    const acessivel = (campo: keyof LeadEntrada) => ({
        'aria-invalid': errors[campo] ? ('true' as const) : ('false' as const),
        'aria-describedby': errors[campo] ? `${campo}-erro` : undefined,
    })

    return (
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(enviar)} noValidate>
            {motoInteresse && (
                <p>
                    Moto de interesse: <strong>{motoInteresse.nome}</strong>
                </p>
            )}

            <Campo id="nome" rotulo="Nome" erro={errors.nome?.message}>
                <input id="nome" type="text" autoComplete="name" className={estiloInput} {...acessivel('nome')} {...register('nome')} />
            </Campo>

            <Campo id="email" rotulo="E-mail" erro={errors.email?.message}>
                <input id="email" type="email" autoComplete="email" className={estiloInput} {...acessivel('email')} {...register('email')} />
            </Campo>

            <Campo id="telefone" rotulo="Telefone com DDD" erro={errors.telefone?.message}>
                <input
                    id="telefone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(81) 99999-9999"
                    className={estiloInput}
                    {...acessivel('telefone')}
                    {...register('telefone')}
                />
            </Campo>

            <Campo id="mensagem" rotulo="Mensagem (opcional)" erro={errors.mensagem?.message}>
                <textarea id="mensagem" rows={4} className={estiloInput} {...acessivel('mensagem')} {...register('mensagem')} />
            </Campo>

            <div className="flex items-start gap-3">
                <input
                    id="consentimento"
                    type="checkbox"
                    className="mt-1 size-4 accent-musgo-600"
                    {...acessivel('consentimento')}
                    {...register('consentimento')}
                />
                <label htmlFor="consentimento" className="text-sm">
                    Autorizo a MotoImports a usar meus dados para entrar em contato sobre este atendimento (LGPD).
                </label>
            </div>
            {errors.consentimento && (
                <p id="consentimento-erro" role="alert" className="text-sm font-medium text-erro">
                    {errors.consentimento.message}
                </p>
            )}

            <button
                type="submit"
                className="self-start rounded-lg bg-musgo-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600"
            >
                Enviar
            </button>

            {isSubmitSuccessful && (
                <p role="status" className="rounded-lg border border-musgo-400 bg-musgo-200 p-4">
                    Recebemos seu contato! Nossa equipe fala com você em breve.
                </p>
            )}
        </form>
    )
}