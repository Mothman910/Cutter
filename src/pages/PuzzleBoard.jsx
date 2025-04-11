/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PuzzleBoard = ({ svgFile, imageUrl }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [svgViewBox, setSvgViewBox] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(svgFile);
        const svgText = await response.text();

        // Parsowanie SVG jako XML
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Wyciąganie ścieżek <path>
        const paths = Array.from(svgDoc.querySelectorAll('path')).map((path) => ({
          id: path.getAttribute('id'),
          d: path.getAttribute('d'),
        }));

        setSvgContent(paths);
      } catch (error) {
        console.error('Błąd podczas wczytywania pliku SVG:', error);
      }
    };

    fetchSvg();
  }, [svgFile]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Układanka
      </Typography>
      <Box
        component="section"
        sx={{
          p: 2,
          border: '1px dashed grey',
          padding: 0,
          margin: '15px',
          position: 'relative',
          width: '700px',
          height: '700px',
          backgroundColor: '#121212',
        }}
      >
        {svgContent &&
          svgContent.map((path, index) => (
            <motion.img
              key={path.id || index}
              drag
              src={imageUrl}
              alt={`Element ${index}`}
              style={{
                position: 'absolute',
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                clipPath: `path('${path.d}')`,
                WebkitClipPath: `path('${path.d}')`,
                cursor: 'pointer',
              }}
            />
          ))}
      </Box>
      <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ mt: 2, mb: 4 }}>
        Powrót do strony głównej
      </Button>
    </Container>
  );
};

export default PuzzleBoard;
