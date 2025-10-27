import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//
// Only import and initialize Eruda if we are in development mode
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => eruda.default.init());
}
// ✨ END OF ERUDA CODE ✨


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)