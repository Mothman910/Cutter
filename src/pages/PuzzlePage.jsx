import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';
import PuzzleBoard from './PuzzleBoard';

const PuzzlePage = () => {
  const { selectedImage, selectedTemplate } = usePuzzle();
  const navigate = useNavigate();

  // Przekieruj na stronę główną, jeśli nie wybrano obrazu lub szablonu
  useEffect(() => {
    if (!selectedImage || !selectedTemplate) {
      navigate('/');
    }
  }, [selectedImage, selectedTemplate, navigate]);

  if (!selectedImage || !selectedTemplate) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Przekierowywanie na stronę główną...
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <PuzzleBoard svgFile={selectedTemplate.path} imageUrl={selectedImage.path} />
    </Box>
  );
};

export default PuzzlePage;
