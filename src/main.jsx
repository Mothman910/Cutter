import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PuzzleProvider } from './contexts/PuzzleContext';

// Importowanie czcionek
import '@fontsource/fredoka-one';
import '@fontsource/nunito';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PuzzleProvider>
      <App />
    </PuzzleProvider>
  </React.StrictMode>
);
