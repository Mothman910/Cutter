import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemButton, Typography, Box, Divider, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePuzzle } from '../contexts/PuzzleContext';
import ExtensionIcon from '@mui/icons-material/Extension';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TemplateSelectionModal = ({ open }) => {
  const { availableTemplates, setTemplateModalOpen, confirmTemplateSelection } = usePuzzle();
  const navigate = useNavigate();

  const handleClose = () => {
    setTemplateModalOpen(false);
  };

  const handleSelectTemplate = (template) => {
    confirmTemplateSelection(template);
    navigate('/puzzle');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontFamily: '"Fredoka One", cursive',
          fontSize: '1.8rem',
          color: 'primary.main',
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <ExtensionIcon fontSize="large" />
        <span>Wybierz ilosc elementow ukladanki</span>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ my: 3, textAlign: 'center' }}>
          Im wiecej elementow, tym trudniejsza ukladanka! Wybierz poziom trudnosci odpowiedni dla siebie.
        </Typography>
        <Box sx={{ px: 2 }}>
          <Grid container spacing={2}>
            {availableTemplates.map((template) => (
              <Grid item xs={12} sm={6} key={template.id}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => handleSelectTemplate(template)}
                    sx={{
                      p: 0,
                      borderRadius: 0,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'background.paper',
                      color: 'text.primary',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <ExtensionIcon
                        sx={{
                          fontSize: 40,
                          color: 'primary.main',
                          mb: 1,
                        }}
                      />
                      <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
                        {template.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Kliknij, aby wybrac ten szablon
                      </Typography>
                    </Box>
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="secondary" startIcon={<ArrowBackIcon />} sx={{ minWidth: '140px' }}>
          Powrot
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelectionModal;
