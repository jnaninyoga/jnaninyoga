import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router'
import Suspens from './layouts/Suspens';
import "handyscript";
// I18NEXT - Localization
import './locale/index'
// TAILWIND - CSS
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<Suspens/>}>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </Suspense>
)
