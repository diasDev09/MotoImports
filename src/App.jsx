import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Placeholder from './components/Placeholder.jsx'
import Home from './pages/Home.jsx'
import PosVenda from './pages/PosVenda.jsx'
import Boutique from './pages/Boutique.jsx'
import Simulador from './pages/Simulador.jsx'
import Checkout from './pages/Checkout.jsx'

// Cada colega troca o <Placeholder /> da sua rota pela página real.
// Exemplo: import Catalogo from './pages/Catalogo.jsx'
//          <Route path="/catalogo" element={<Catalogo />} />

export default function App() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/catalogo"
            element={<Placeholder titulo="Catálogo" />}
          />
          <Route
            path="/moto/:id"
            element={<Placeholder titulo="Detalhes da moto" />}
          />
          <Route
            path="/contato"
            element={<Placeholder titulo="Fale com a equipe" />}
          />
          <Route
            path="/simulador"
            element={<Simulador />}
          />
          <Route
            path="/checkout"
            element={<Checkout />}
          />
          <Route
            path="/pos-venda"
            element={<PosVenda />}
          />

          <Route 
            path="/boutique" 
            element={<Boutique />} 
            />

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