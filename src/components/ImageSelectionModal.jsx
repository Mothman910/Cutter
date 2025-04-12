import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Paper } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ImageSelectionModal = ({ open }) => {
  const { selectedImagePreview, setImageModalOpen, confirmImageSelection } = usePuzzle();

  const handleClose = () => {
    setImageModalOpen(false);
  };

  const handleConfirm = () => {
    confirmImageSelection();
  };

  if (!selectedImagePreview) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontFamily: 'Comfortaa, cursive',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: 'primary.main',
          py: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        Podglad obrazka
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 1,
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundImage: 'linear-gradient(45deg, #333 25%, #444 25%, #444 50%, #333 50%, #333 75%, #444 75%, #444 100%)',
              backgroundSize: '10px 10px',
            }}
          >
            <img
              src={selectedImagePreview.path}
              alt={selectedImagePreview.name}
              style={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '8px',
              }}
            />
          </Paper>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {selectedImagePreview.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Z tego obrazka stworzymy piekne puzzle! Gotowy do zabawy?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          sx={{
            minWidth: '140px',
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          sx={{
            minWidth: '180px',
          }}
        >
          Wybierz ten obraz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelectionModal;
