import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, LinearProgress } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';
import PuzzleBoard from './PuzzleBoard';

const PuzzlePage = () => {
  const { selectedImage, selectedTemplate } = usePuzzle();
  const navigate = useNavigate();

  // Przekieruj na strone glowna, jesli nie wybrano obrazu lub szablonu
  useEffect(() => {
    if (!selectedImage || !selectedTemplate) {
      navigate('/');
    }
  }, [selectedImage, selectedTemplate, navigate]);

  if (!selectedImage || !selectedTemplate) {
    return (
      <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 4,
            mb: 4,
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          Przekierowywanie na strone glowna...
        </Typography>
        <Box sx={{ width: '60%', maxWidth: '400px' }}>
          <LinearProgress color="primary" />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <PuzzleBoard svgFile={selectedTemplate.path} imageUrl={selectedImage.path} />
    </Box>
  );
};

export default PuzzlePage;
