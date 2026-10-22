import { createContext, useContext, useMemo, useState } from 'react'

// Estado que as partes do grupo dividem: moto escolhida, acessórios e lead.
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [motoSelecionada, setMotoSelecionada] = useState(null)
  const [acessorios, setAcessorios] = useState([])
  const [lead, setLead] = useState(null)

  // não deixa adicionar o mesmo acessório duas vezes
  function adicionarAcessorio(item) {
    setAcessorios((atual) => (atual.some((a) => a.id === item.id) ? atual : [...atual, item]))
  }

  function removerAcessorio(id) {
    setAcessorios((atual) => atual.filter((a) => a.id !== id))
  }

  // useMemo para só recalcular a soma quando a lista de acessórios mudar
  const totalAcessorios = useMemo(
    () => acessorios.reduce((soma, a) => soma + a.preco, 0),
    [acessorios],
  )

  const [simulacao, setSimulacao] = useState(null)
  const [voucherReserva, setVoucherReserva] = useState(null)

  const value = {
    motoSelecionada,
    selecionarMoto: setMotoSelecionada,
    limparMoto: () => setMotoSelecionada(null),
    acessorios,
    adicionarAcessorio,
    removerAcessorio,
    limparAcessorios: () => setAcessorios([]),
    totalAcessorios,
    lead,
    registrarLead: setLead,
    simulacao,
    salvarSimulacao: setSimulacao,
    voucherReserva,
    salvarVoucherReserva: setVoucherReserva,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// atalho para usar o contexto em qualquer componente: const { motoSelecionada } = useApp()
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp precisa estar dentro do AppProvider')
  return ctx
}