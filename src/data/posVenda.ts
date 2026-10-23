// Serviços e horários da oficina (porte da v1, da Ariely).
// Para incluir um serviço ou horário, é só editar estas listas.

export const SERVICOS = [
    {
        id: 'revisao',
        nome: 'Revisão preventiva',
        descricao: 'Verificação dos principais componentes da moto.',
        duracao: 'Aproximadamente 2 horas',
    },
    {
        id: 'oleo',
        nome: 'Troca de óleo',
        descricao: 'Manutenção do óleo do motor.',
        duracao: 'Aproximadamente 40 minutos',
    },
    {
        id: 'freios',
        nome: 'Manutenção dos freios',
        descricao: 'Inspeção do sistema de frenagem.',
        duracao: 'Aproximadamente 1 hora',
    },
    {
        id: 'diagnostico',
        nome: 'Diagnóstico mecânico',
        descricao: 'Avaliação inicial de possíveis problemas.',
        duracao: 'Aproximadamente 1 hora',
    },
] as const

export type ServicoId = (typeof SERVICOS)[number]['id']

export const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'] as const