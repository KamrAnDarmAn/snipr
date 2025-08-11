import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { UrlContextProvider } from './context/urls-context.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/user-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserContextProvider>
      <ThemeProvider defaultTheme="system" storageKey="quick-quezzer-theme">
        <UrlContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UrlContextProvider>
      </ThemeProvider>
    </UserContextProvider>
  </StrictMode>,
)
