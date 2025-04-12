/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

// This component is deprecated and only exists for backward compatibility
// The actual implementation is in src/pages/PuzzleBoard.jsx
const PuzzleBoard = ({ svgFile, imageUrl }) => {
  const navigate = useNavigate();
  
  // Redirect to the PuzzlePage which uses the actual implementation
  React.useEffect(() => {
    console.warn('Using deprecated PuzzleBoard component from components directory. Please use the one in pages directory.');
    navigate('/puzzle');
  }, [navigate]);

  return null;
};

export default PuzzleBoard;
