import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import Placeholder from './components/Placeholder.tsx'
import Home from './pages/Home.tsx'

// Cada colega troca o <Placeholder /> da sua rota pela página real.

export default function App() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Placeholder titulo="Catálogo" />} />
          <Route path="/moto/:id" element={<Placeholder titulo="Detalhes da moto" />} />
          <Route path="/contato" element={<Placeholder titulo="Fale com a equipe" />} />
          <Route path="/simulador" element={<Placeholder titulo="Simulador de financiamento" />} />
          <Route path="/checkout" element={<Placeholder titulo="Reserva e retirada" />} />
          <Route path="/pos-venda" element={<Placeholder titulo="Pós-venda e boutique" />} />
          <Route
            path="*"
            element={<Placeholder titulo="Página não encontrada" mensagem="Não achamos essa página." />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}