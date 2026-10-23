import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/800.css'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O Router vem por fora para o AppProvider e todas as páginas poderem usar rotas */}
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)