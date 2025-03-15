
import React from 'react';
import ReactDOM from 'react-dom/client'
import ImagePixelator from './pixelator.jsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <ImagePixelator />
      </div>
    </div>
  </React.StrictMode>,
)