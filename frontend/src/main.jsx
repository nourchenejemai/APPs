import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {SnackbarProvider} from 'notistack'
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <AppContextProvider>
      <App />

      </AppContextProvider>
    </SnackbarProvider>
  </BrowserRouter>,
)
