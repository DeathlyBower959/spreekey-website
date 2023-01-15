import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Fonts
// import './fonts/FILENAME.ttf'

import { BrowserRouter } from 'react-router-dom'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

