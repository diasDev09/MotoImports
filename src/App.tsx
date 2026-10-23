import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import Placeholder from './components/Placeholder.tsx'
import Home from './pages/Home.tsx'
import Catalogo from './pages/Catalogo.tsx'
import Contato from './pages/Contato.tsx'
import Simulador from './pages/Simulador.tsx'
import Checkout from './pages/Checkout.tsx'

// Cada colega troca o <Placeholder /> da sua rota pela página real.

export default function App() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/moto/:id" element={<Placeholder titulo="Detalhes da moto" />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/checkout" element={<Checkout />} />
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