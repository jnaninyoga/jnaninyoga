import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './router'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <router />
  </React.StrictMode>,
)
