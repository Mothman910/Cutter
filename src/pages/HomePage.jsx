import React, { useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardActionArea, CardMedia, CardContent, Paper } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';
// No need for useNavigate in this component
import ImageSelectionModal from '../components/ImageSelectionModal';
import TemplateSelectionModal from '../components/TemplateSelectionModal';
import ExtensionIcon from '@mui/icons-material/Extension';

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
`;

const HomePage = () => {
  const { availableImages, openImagePreview, imageModalOpen, templateModalOpen } = usePuzzle();
  // No need for navigate in this component

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = fontStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 6,
          textAlign: 'center',
        }}
      >
        <ExtensionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: 'primary.main',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontFamily: 'Comfortaa, cursive',
            fontWeight: 700,
          }}
        >
          Magiczne Puzzle
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mt: 4,
            mb: 4,
            color: 'grey.300',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '1.8rem',
            letterSpacing: '0.5px',
          }}
        >
          Wybierz jeden z pieknych obrazkow i uloz swoja ulubiona ukladanke!
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'grey.400',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'italic',
              fontSize: '1rem',
              letterSpacing: '0.3px',
              lineHeight: 1.6,
            }}
          >
            <p>Samoświadomość swoich możliwości jest kluczowym elementem rozwoju osobistego. Rozpoznanie różnicy między marzeniami a realnymi umiejętnościami nie musi prowadzić do porzucenia celów, ale może pomóc w wyznaczeniu osiągalnych etapów. Podobnie jak w układaniu puzzli - zaczynamy od prostszych, aby stopniowo przejść do bardziej skomplikowanych. Czasem warto podzielić duże wyzwanie na mniejsze kroki, zamiast z niego całkowicie rezygnować.</p>
          </Typography>
        </Paper>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {availableImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              }}
            >
              <CardActionArea onClick={() => openImagePreview(image)}>
                <CardMedia component="img" height="250" image={image.path} alt={image.name} sx={{ objectFit: 'cover' }} />
                <CardContent sx={{ textAlign: 'center', bgcolor: 'background.paper' }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: 'center',
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                    }}
                  >
                    {image.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: 'center',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 400,
                      letterSpacing: '0.3px',
                    }}
                  >
                    Kliknij, aby zobaczyc powiekszenie i wybrac ten obraz
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
