import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactFormSaverDemo from './App'

// Use Vite's base (import.meta.env.BASE_URL) as the router basename so
// client side routing works when the app is served from a subpath.
const basename = (import.meta as any).env?.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ReactFormSaverDemo />
    </BrowserRouter>
  </React.StrictMode>,
)
