import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { RepositorioProvider } from './storage/RepositorioProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O Router vem por fora para o AppProvider e todas as páginas poderem usar rotas */}
    <BrowserRouter>
      <AuthProvider>
        <RepositorioProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </RepositorioProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)