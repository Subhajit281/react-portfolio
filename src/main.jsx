import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from "react-helmet-async";

//
// Only import and initialize Eruda if we are in development mode
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => eruda.default.init());
}
// ✨ END OF ERUDA CODE ✨


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)