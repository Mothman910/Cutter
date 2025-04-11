import React from 'react';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';
import ImageSelectionModal from '../components/ImageSelectionModal';
import TemplateSelectionModal from '../components/TemplateSelectionModal';

const HomePage = () => {
  const { availableImages, openImagePreview, imageModalOpen, templateModalOpen } = usePuzzle();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Puzzle App
      </Typography>
      <Typography variant="h5" component="h2" align="center" sx={{ mb: 4 }}>
        Wybierz obraz do ułożenia
      </Typography>

      <Grid container spacing={3}>
        {availableImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => openImagePreview(image)}>
                <CardMedia component="img" height="200" image={image.path} alt={image.name} />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {image.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kliknij, aby zobaczyć powiększenie i wybrać ten obraz
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modalne okna wyboru */}
      <ImageSelectionModal open={imageModalOpen} />
      <TemplateSelectionModal open={templateModalOpen} />
    </Container>
  );
};

export default HomePage;
