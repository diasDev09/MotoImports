import { useState } from 'react'
import '../styles/pos-venda.css'

const servicos = [
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
]

const horarios = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
]

function obterDataAtual() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export default function PosVenda() {
  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
    moto: '',
    servico: '',
    data: '',
    horario: '',
    observacoes: '',
  })

  const [agendamento, setAgendamento] = useState(null)

  function atualizarCampo(event) {
    const { name, value } = event.target

    setCliente((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    setAgendamento(null)
  }

  function enviarAgendamento(event) {
    event.preventDefault()

    if (!cliente.servico) {
      alert('Selecione o serviço desejado.')
      return
    }

    if (cliente.data < obterDataAtual()) {
      alert('Selecione uma data de hoje em diante.')
      return
    }

    setAgendamento({ ...cliente })
  }

  const servicoSelecionado = servicos.find(
    (servico) => servico.id === agendamento?.servico
  )

  function limparAgendamento() {
    setAgendamento(null)

    setCliente({
      nome: '',
      telefone: '',
      moto: '',
      servico: '',
      data: '',
      horario: '',
      observacoes: '',
    })
  }

  return (
    <section className="pos-venda">
      <div className="pos-venda-banner">
        <span className="pos-venda-etiqueta">
          MOTOIMPORTS | PÓS-VENDA
        </span>

        <h1>Cuidado com sua moto, em cada quilômetro.</h1>

        <p>
          Agende seu serviço e conte com uma equipe preparada para cuidar
          da sua companheira de estrada.
        </p>
      </div>

      <div className="pos-venda-conteudo">
        <div className="pos-venda-introducao">
          <span className="pos-venda-sobretitulo">
            OFICINA MOTOIMPORTS
          </span>

          <h2>Agende seu serviço</h2>

          <p>
            Escolha o serviço, informe os dados da sua moto e selecione
            a data desejada.
          </p>
        </div>

        <form
          className="agendamento-formulario"
          onSubmit={enviarAgendamento}
        >
          <fieldset className="agendamento-secao">
            <legend>
              <span className="etapa-numero">01</span>
              ESCOLHA O SERVIÇO DESEJADO
            </legend>

            <div className="servicos-grade">
              {servicos.map((servico) => (
                <label
                  key={servico.id}
                  className={`servico-opcao ${
                    cliente.servico === servico.id ? 'selecionado' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="servico"
                    value={servico.id}
                    checked={cliente.servico === servico.id}
                    onChange={atualizarCampo}
                    required
                  />

                  <span className="servico-nome">
                    {servico.nome}
                  </span>

                  <span className="servico-descricao">
                    {servico.descricao}
                  </span>

                  <span className="servico-duracao">
                    {servico.duracao}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="agendamento-secao">
            <legend>
              <span className="etapa-numero">02</span>
              DADOS DO CLIENTE E DA MOTO
            </legend>

            <div className="agendamento-campos">
              <label className="campo-agendamento">
                Nome completo:

                <input
                  type="text"
                  name="nome"
                  value={cliente.nome}
                  onChange={atualizarCampo}
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="campo-agendamento">
                Telefone:

                <input
                  type="tel"
                  name="telefone"
                  value={cliente.telefone}
                  onChange={atualizarCampo}
                  placeholder="(81) 99999-9999"
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="campo-agendamento campo-completo">
                Modelo da moto:

                <input
                  type="text"
                  name="moto"
                  value={cliente.moto}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Honda CG 160, ano 2024"
                  required
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="agendamento-secao">
            <legend>
              <span className="etapa-numero">03</span>
              DATA E HORÁRIO
            </legend>

            <div className="agendamento-campos">
              <label className="campo-agendamento">
                Data desejada:

                <input
                  type="date"
                  name="data"
                  value={cliente.data}
                  onChange={atualizarCampo}
                  min={obterDataAtual()}
                  required
                />
              </label>

              <label className="campo-agendamento">
                Horário desejado:

                <select
                  name="horario"
                  value={cliente.horario}
                  onChange={atualizarCampo}
                  required
                >
                  <option value="">Selecione um horário</option>

                  {horarios.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
              </label>

              <label className="campo-agendamento campo-completo">
                Observações (opcional)

                <textarea
                  name="observacoes"
                  value={cliente.observacoes}
                  onChange={atualizarCampo}
                  placeholder="Descreva algum problema ou informação importante."
                  rows={3}
                />
              </label>
            </div>
          </fieldset>

          <button className="botao-agendar" type="submit">
            Solicitar agendamento!
          </button>

          <p className="agendamento-aviso">
            A DISPONIBILIDADE DO HORÁRIO ESCOLHIDO SERÁ VERIFICADA PELA
            OFICINA. O AGENDAMENTO SÓ SERÁ CONFIRMADO APÓS A VALIDAÇÃO
            DO HORÁRIO.
          </p>
        </form>

        {agendamento && (
          <section
            className="agendamento-confirmacao"
            aria-live="polite"
          >
            <h2>Aguarde confirmação de agendamento</h2>

            <p>
              Sua solicitação foi preenchida com sucesso!
            </p>

            <p>Confira os dados informados:</p>

            <ul>
              <li>
                <strong>Cliente:</strong> {agendamento.nome}
              </li>

              <li>
                <strong>Telefone:</strong> {agendamento.telefone}
              </li>

              <li>
                <strong>Moto:</strong> {agendamento.moto}
              </li>

              <li>
                <strong>Serviço:</strong> {servicoSelecionado?.nome}
              </li>

              <li>
                <strong>Data:</strong>{' '}
                {agendamento.data.split('-').reverse().join('/')}
              </li>

              <li>
                <strong>Horário:</strong> {agendamento.horario}
              </li>

              {agendamento.observacoes && (
                <li>
                  <strong>Observações:</strong>{' '}
                  {agendamento.observacoes}
                </li>
              )}
            </ul>

            <p>
              O agendamento depende da confirmação da oficina! Entraremos em contato com você para validar o horário escolhido.
            </p>

            <button
              type="button"
              className="botao-limpar"
              onClick={limparAgendamento}
            >
              Fazer novo agendamento
            </button>
          </section>
        )}
      </div>
    </section>
  )
}