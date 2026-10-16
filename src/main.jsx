import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './styles/theme.css'
import './styles/layout.css'
import './styles/home.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O Router vem por fora para o AppProvider e todas as páginas poderem usar rotas */}
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)