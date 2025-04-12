import React, { createContext, useState, useContext } from 'react';

const PuzzleContext = createContext();

export const usePuzzle = () => useContext(PuzzleContext);

export const PuzzleProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  // Dostepne obrazy
  const availableImages = [
    { id: 1, path: 'src/assets/patterns/img_1.jpg', name: 'Obrazek 1' },
    { id: 2, path: 'src/assets/patterns/img_2.jpg', name: 'Obrazek 2' },
    { id: 3, path: 'src/assets/patterns/img_3.jpg', name: 'Obrazek 3' },
  ];

  // Dostepne szablony puzzli (SVG)
  const availableTemplates = [
    { id: 1, path: 'src/assets/templates/7x7.svg', name: '7×7 (49 elementow)' },
    { id: 2, path: 'src/assets/templates/jigsaw7x7.svg', name: 'Jigsaw 7×7 (49 elementow)' },
    { id: 3, path: 'src/assets/templates/jigsaw10x10.svg', name: 'Jigsaw 10×10 (100 elementow)' },
    { id: 4, path: 'src/assets/templates/jigsaw10x14.svg', name: 'Jigsaw 10×14 (140 elementow)' },
    { id: 5, path: 'src/assets/templates/jigsaw15x21.svg', name: 'Jigsaw 15×21 (315 elementow)' },
    { id: 6, path: 'src/assets/templates/jigsaw20x20.svg', name: 'Jigsaw 20×20 (400 elementow)' },
    { id: 7, path: 'src/assets/templates/jigsaw20x28.svg', name: 'Jigsaw 20×28 (560 elementow)' },
  ];

  // Otworz modal z podgladem obrazu
  const openImagePreview = (image) => {
    setSelectedImagePreview(image);
    setImageModalOpen(true);
  };

  // Wybierz obraz i zamknij modal
  const confirmImageSelection = () => {
    setSelectedImage(selectedImagePreview);
    setImageModalOpen(false);
    setTemplateModalOpen(true); // Po wyborze obrazu otworz modal wyboru szablonu
  };

  // Wybierz szablon i zamknij modal
  const confirmTemplateSelection = (template) => {
    setSelectedTemplate(template);
    setTemplateModalOpen(false);
  };

  return (
    <PuzzleContext.Provider
      value={{
        selectedImage,
        selectedTemplate,
        availableImages,
        availableTemplates,
        imageModalOpen,
        templateModalOpen,
        selectedImagePreview,
        openImagePreview,
        setImageModalOpen,
        setTemplateModalOpen,
        confirmImageSelection,
        confirmTemplateSelection,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};

export default PuzzleContext;
