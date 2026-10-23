import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import type { ChangeEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApp } from '../context/AppContext.ts'
import { HORARIOS, SERVICOS } from '../data/posVenda.ts'
import { agendaSimulada, horarioOcupado } from '../domain/agenda.ts'
import { criarAgendamentoSchema, dataIsoLocal, formatarDataIso } from '../domain/agendamento.ts'
import type { Agendamento, AgendamentoEntrada } from '../domain/agendamento.ts'
import { formatarTelefone } from '../domain/lead.ts'

// Pós-venda: agendamento de serviço na oficina (porte da v1, da Ariely).
// RF-10: calendário sem datas passadas e horários já ocupados bloqueados. A oficina ainda confirma o horário.

const campo = 'rounded-lg border border-musgo-400 bg-white px-3 py-2 text-musgo-900'

function Etapa({ numero, titulo, children }: { numero: string; titulo: string; children: ReactNode }) {
    return (
        <fieldset className="rounded-card border border-musgo-200 bg-white p-5">
            <legend className="flex items-center gap-3 px-2 text-sm font-bold uppercase tracking-wide">
                <span className="rounded-full bg-musgo-900 px-2 py-0.5 text-xs text-white">{numero}</span>
                {titulo}
            </legend>
            {children}
        </fieldset>
    )
}

function Campo({
    id,
    rotulo,
    erro,
    largo,
    children,
}: {
    id: string
    rotulo: string
    erro?: string
    largo?: boolean
    children: ReactNode
}) {
    return (
        <div className={`flex flex-col gap-1 ${largo ? 'sm:col-span-2' : ''}`}>
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

export default function PosVenda() {
    const { horariosReservados, reservarHorario } = useApp()
    const hoje = dataIsoLocal()
    const schema = useMemo(
        () => criarAgendamentoSchema(hoje, agendaSimulada, horariosReservados),
        [hoje, horariosReservados],
    )
    const [agendado, setAgendado] = useState<Agendamento | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        resetField,
        setValue,
        control,
        subscribe,
        formState: { errors },
    } = useForm<AgendamentoEntrada, unknown, Agendamento>({
        resolver: zodResolver(schema),
        defaultValues: {
            servico: '',
            nome: '',
            telefone: '',
            moto: '',
            data: '',
            horario: undefined, // o select começa em "Selecione um horário"
            observacoes: '',
            consentimento: false,
        },
    })

    const dataEscolhida = useWatch({ control, name: 'data' })

    // se a pessoa mexer em qualquer campo, o resumo anterior deixa de valer (como na v1)
    useEffect(() => {
        return subscribe({ formState: { values: true }, callback: () => setAgendado(null) })
    }, [subscribe])

    const acessivel = (nome: keyof AgendamentoEntrada) => ({
        'aria-invalid': errors[nome] ? ('true' as const) : ('false' as const),
        'aria-describedby': errors[nome] ? `${nome}-erro` : undefined,
    })

    const servicoEscolhido = SERVICOS.find((s) => s.id === agendado?.servico)

    return (
        <section>
            <div className="bg-musgo-900 px-6 py-14 text-white">
                <div className="mx-auto max-w-site">
                    <p className="text-sm font-semibold uppercase tracking-widest">Moto Imports · Pós-venda</p>
                    <h1 className="mt-3 max-w-2xl text-4xl">Cuidado com sua moto, em cada quilômetro.</h1>
                    <p className="mt-3 max-w-xl">
                        Agende seu serviço e conte com uma equipe preparada para cuidar da sua companheira de estrada.
                    </p>
                    <Link to="/boutique" className="mt-6 inline-block rounded-lg border border-white px-5 py-2 text-sm font-semibold hover:bg-musgo-600">
                        Conheça a boutique →
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-6 py-12">
                <h2 className="text-3xl">Agende seu serviço</h2>
                <p className="mt-2 text-musgo-600">
                    Escolha o serviço, informe os dados da sua moto e selecione a data desejada.
                </p>

                <form
                    className="mt-8 flex flex-col gap-6"
                    noValidate
                    onSubmit={handleSubmit((dados) => {
                        reservarHorario({ data: dados.data, horario: dados.horario })
                        setAgendado(dados)
                    })}
                >
                    <Etapa numero="01" titulo="Escolha o serviço desejado">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {SERVICOS.map((servico) => (
                                <label
                                    key={servico.id}
                                    className="flex cursor-pointer flex-col gap-1 rounded-lg border border-musgo-200 p-4 text-sm has-:checked:border-musgo-900 has-:checked:bg-musgo-50"
                                >
                                    <input type="radio" value={servico.id} className="sr-only" {...register('servico')} />
                                    <span className="font-semibold">{servico.nome}</span>
                                    <span>{servico.descricao}</span>
                                    <span className="text-xs text-musgo-600">{servico.duracao}</span>
                                </label>
                            ))}
                        </div>
                        {errors.servico && (
                            <p role="alert" className="mt-2 text-sm font-medium text-erro">
                                {errors.servico.message}
                            </p>
                        )}
                    </Etapa>

                    <Etapa numero="02" titulo="Dados do cliente e da moto">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Campo id="nome" rotulo="Nome completo" erro={errors.nome?.message}>
                                <input id="nome" type="text" autoComplete="name" placeholder="Digite seu nome" className={campo} {...acessivel('nome')} {...register('nome')} />
                            </Campo>
                            <Campo id="telefone" rotulo="Telefone" erro={errors.telefone?.message}>
                                <input
                                    id="telefone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="(81) 99999-9999"
                                    className={campo}
                                    {...acessivel('telefone')}
                                    {...register('telefone', {
                                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.value = formatarTelefone(e.target.value)
                                        },
                                    })}
                                />
                            </Campo>
                            <Campo id="moto" rotulo="Modelo da moto" erro={errors.moto?.message} largo>
                                <input id="moto" type="text" placeholder="Ex.: Honda CG 160, ano 2024" className={campo} {...acessivel('moto')} {...register('moto')} />
                            </Campo>
                        </div>
                    </Etapa>

                    <Etapa numero="03" titulo="Data e horário">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1 sm:col-span-2">
                                <p id="data-rotulo" className="text-sm">Data desejada</p>
                                <input type="hidden" {...register('data')} />
                                <div role="group" aria-labelledby="data-rotulo" className="w-fit rounded-lg border border-musgo-400 bg-white p-2">
                                    <DayPicker
                                        mode="single"
                                        locale={ptBR}
                                        weekStartsOn={0}
                                        selected={dataEscolhida ? new Date(`${dataEscolhida}T00:00:00`) : undefined}
                                        onSelect={(dia) => {
                                            setValue('data', dia ? dataIsoLocal(dia) : '', { shouldValidate: true, shouldDirty: true })
                                            resetField('horario') // o horário escolhido pode estar ocupado no novo dia
                                        }}
                                        disabled={{ before: new Date(`${hoje}T00:00:00`) }}
                                        style={{
                                            '--rdp-accent-color': 'var(--color-musgo-600)',
                                            '--rdp-accent-background-color': 'var(--color-musgo-200)',
                                        } as CSSProperties}
                                    />
                                </div>
                                {errors.data && (
                                    <p id="data-erro" role="alert" className="text-sm font-medium text-erro">
                                        {errors.data.message}
                                    </p>
                                )}
                            </div>
                            <Campo id="horario" rotulo="Horário desejado" erro={errors.horario?.message}>
                                <select
                                    id="horario"
                                    className={campo}
                                    disabled={!dataEscolhida}
                                    {...acessivel('horario')}
                                    {...register('horario')}
                                >
                                    <option value="">{dataEscolhida ? 'Selecione um horário' : 'Escolha a data primeiro'}</option>
                                    {HORARIOS.map((h) => {
                                        const ocupado = Boolean(dataEscolhida) && horarioOcupado(dataEscolhida, h, agendaSimulada, horariosReservados)
                                        return (
                                            <option key={h} value={h} disabled={ocupado}>
                                                {ocupado ? `${h} (ocupado)` : h}
                                            </option>
                                        )
                                    })}
                                </select>
                            </Campo>
                            <Campo id="observacoes" rotulo="Observações (opcional)" erro={errors.observacoes?.message} largo>
                                <textarea
                                    id="observacoes"
                                    rows={3}
                                    placeholder="Descreva algum problema ou informação importante."
                                    className={campo}
                                    {...acessivel('observacoes')}
                                    {...register('observacoes')}
                                />
                            </Campo>
                        </div>

                        <div className="mt-4 flex items-start gap-3">
                            <input id="consentimento" type="checkbox" className="mt-1 size-4 accent-musgo-600" {...acessivel('consentimento')} {...register('consentimento')} />
                            <label htmlFor="consentimento" className="text-sm">
                                Autorizo a MotoImports a usar meus dados para entrar em contato sobre este agendamento (LGPD).
                            </label>
                        </div>
                        {errors.consentimento && (
                            <p id="consentimento-erro" role="alert" className="mt-1 text-sm font-medium text-erro">
                                {errors.consentimento.message}
                            </p>
                        )}
                    </Etapa>

                    <button
                        type="submit"
                        className="self-start rounded-lg bg-musgo-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-musgo-600"
                    >
                        Solicitar agendamento
                    </button>

                    <p className="text-xs uppercase text-musgo-600">
                        A disponibilidade do horário escolhido será verificada pela oficina. O agendamento só será
                        confirmado após a validação do horário.
                    </p>
                </form>

                <div aria-live="polite">
                    {agendado && (
                        <section className="mt-8 rounded-card border border-musgo-400 bg-musgo-200 p-6">
                            <h2 className="text-2xl">Aguarde a confirmação do agendamento</h2>
                            <p className="mt-2">Recebemos sua solicitação. Confira os dados informados:</p>
                            <ul className="mt-3 flex flex-col gap-1 text-sm">
                                <li><strong>Cliente:</strong> {agendado.nome}</li>
                                <li><strong>Telefone:</strong> {formatarTelefone(agendado.telefone)}</li>
                                <li><strong>Moto:</strong> {agendado.moto}</li>
                                <li><strong>Serviço:</strong> {servicoEscolhido?.nome}</li>
                                <li><strong>Data:</strong> {formatarDataIso(agendado.data)}</li>
                                <li><strong>Horário:</strong> {agendado.horario}</li>
                                {agendado.observacoes && <li><strong>Observações:</strong> {agendado.observacoes}</li>}
                            </ul>
                            <p className="mt-3 text-sm">
                                O agendamento depende da confirmação da oficina. Entraremos em contato para validar o horário escolhido.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    reset()
                                    setAgendado(null)
                                }}
                                className="mt-4 rounded-lg border border-musgo-900 px-5 py-2 text-sm font-semibold hover:bg-musgo-50"
                            >
                                Fazer novo agendamento
                            </button>
                        </section>
                    )}
                </div>
            </div>
        </section>
    )
}