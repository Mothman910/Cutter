/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';

const PuzzleBoard = ({ svgFile, imageUrl }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [svgViewBox, setSvgViewBox] = useState(null);

  // Moja nauka
  console.log(svgFile);
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(svgFile);
        const svgText = await response.text();
        console.log('Zawartość pliku SVG:', svgText);

        // Parsowanie SVG jako XML
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        console.log('Dokument SVG:', svgDoc);

        // Wyciąganie ścieżek <path>
        const paths = Array.from(svgDoc.querySelectorAll('path')).map((path) => ({
          id: path.getAttribute('id'),
          d: path.getAttribute('d'),
        }));
        console.log('Ścieżki SVG:', paths);

        setSvgContent(paths);
      } catch (error) {
        console.error('Błąd podczas wczytywania pliku SVG:', error);
      }
    };

    fetchSvg();
  }, [svgFile]);
  console.log('svgContent:', svgContent);
  // Moja nauka

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey', padding: 0, margin: '15px' }} style={{ position: 'relative', width: '700px', height: '700px' }}>
      {svgContent &&
        svgContent.map((path, index) => (
          <motion.img
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
  );
};

export default PuzzleBoard;
