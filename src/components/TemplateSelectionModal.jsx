import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePuzzle } from '../contexts/PuzzleContext';

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Wybierz ilość elementów układanki</DialogTitle>
      <DialogContent>
        <List>
          {availableTemplates.map((template) => (
            <ListItem key={template.id} disablePadding>
              <ListItemButton onClick={() => handleSelectTemplate(template)}>
                <ListItemText primary={template.name} secondary="Kliknij, aby wybrać ten szablon" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Anuluj</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelectionModal;
