import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF5722', // Pomarańczowy - przyjazny dla dzieci
    },
    secondary: {
      main: '#4CAF50', // Zielony - kontrastujacy z pomarańczowym
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: {
      fontFamily: '"Fredoka One", cursive',
    },
    h2: {
      fontFamily: '"Fredoka One", cursive',
    },
    h3: {
      fontFamily: '"Fredoka One", cursive',
    },
    h4: {
      fontFamily: '"Fredoka One", cursive',
    },
    h5: {
      fontFamily: '"Fredoka One", cursive',
    },
    h6: {
      fontFamily: '"Fredoka One", cursive',
    },
    button: {
      fontFamily: '"Fredoka One", cursive',
      textTransform: 'none',
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
