import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';

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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Podgląd obrazka</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <img
            src={selectedImagePreview.path}
            alt={selectedImagePreview.name}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Anuluj</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Wybierz ten obraz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelectionModal;
