import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PuzzleProvider } from './contexts/PuzzleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PuzzleProvider>
      <App />
    </PuzzleProvider>
  </React.StrictMode>
);
