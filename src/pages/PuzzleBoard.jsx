/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

// Import Google Fonts in the component to ensure they're available
// This is a modern, elegant and sophisticated font combination
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
`;

// Define the snap threshold in pixels
const SNAP_THRESHOLD = 20;

const PuzzleBoard = ({ svgFile, imageUrl }) => {
  // Add font styles to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = fontStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Essential state
  const [svgContent, setSvgContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [puzzlePositions, setPuzzlePositions] = useState([]);
  const [pieceBounds, setPieceBounds] = useState([]);
  const [snappedPieces, setSnappedPieces] = useState([]);

  // State do śledzenia ukończenia układanki
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Dodaj stan dla pomocy
  const [showHelp, setShowHelp] = useState(true);
  const [helpDismissed, setHelpDismissed] = useState(false);

  // Dodajemy referencję do śledzenia pozycji startowej przy przeciąganiu
  const dragStartPositionRef = useRef({});

  // Dodajemy stan do śledzenia postępu i ukończenia
  const [progress, setProgress] = useState(0);

  // Funkcja do zamknięcia pomocy
  const handleDismissHelp = () => {
    setShowHelp(false);
    setHelpDismissed(true);
  };

  // Automatycznie zamknij pomoc po 10 sekundach
  useEffect(() => {
    if (showHelp) {
      const timeout = setTimeout(() => {
        setShowHelp(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [showHelp]);

  // Refs and navigation
  const positionsGeneratedRef = useRef(false);
  const navigate = useNavigate();
  const dragStartPosRef = useRef({}); // Ref do przechowywania pozycji startowej puzzli

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate path bounds for a SVG path and normalize path for responsive scaling
  const calculatePathBounds = useCallback((pathData) => {
    if (!pathData) {
      return {
        minX: 0,
        minY: 0,
        maxX: 700,
        maxY: 700,
        width: 700,
        height: 700,
        normalizedPath: '',
      };
    }

    try {
      // Create temporary SVG element to calculate bounds
      const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEl.setAttribute('width', '700');
      svgEl.setAttribute('height', '700');
      svgEl.style.position = 'absolute';
      svgEl.style.visibility = 'hidden';
      document.body.appendChild(svgEl);

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', pathData);
      svgEl.appendChild(pathEl);

      // Get bounding box
      const bbox = pathEl.getBBox();

      // Create a normalized path that will scale properly
      // We'll create a viewBox that matches the original SVG dimensions
      const viewBoxWidth = 700;
      const viewBoxHeight = 700;

      // Create a new SVG with a viewBox for scaling
      const normalizedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      normalizedSvg.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
      normalizedSvg.setAttribute('width', '100%');
      normalizedSvg.setAttribute('height', '100%');

      // Clone the path into the normalized SVG
      const normalizedPath = pathEl.cloneNode(true);
      normalizedSvg.appendChild(normalizedPath);

      // Get the outerHTML of the SVG to use as a data URI for the clipPath
      const svgString = new XMLSerializer().serializeToString(normalizedSvg);
      const normalizedPathUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      document.body.removeChild(svgEl);

      // Add margin for safety
      const margin = 40;
      return {
        minX: Math.max(0, bbox.x - margin),
        minY: Math.max(0, bbox.y - margin),
        maxX: Math.min(700, bbox.x + bbox.width + margin),
        maxY: Math.min(700, bbox.y + bbox.height + margin),
        width: bbox.width + 2 * margin,
        height: bbox.height + 2 * margin,
        normalizedPathUri: normalizedPathUri,
        pathData: pathData,
      };
    } catch (error) {
      console.error('Error calculating path bounds:', error);
      return {
        minX: 0,
        minY: 0,
        maxX: 700,
        maxY: 700,
        width: 700,
        height: 700,
        normalizedPathUri: '',
        pathData: pathData,
      };
    }
  }, []);

  // Generate random positions for puzzle pieces
  const generateRandomPositions = useCallback(
    (paths) => {
      if (positionsGeneratedRef.current && puzzlePositions.length === paths.length) {
        return puzzlePositions;
      }

      const positions = [];
      const bounds = [];

      // Reference to the puzzle board element
      const boardRef = document.getElementById('puzzle-board-reference');
      let boardRect = null;

      // If the board element exists, get its position and dimensions
      if (boardRef) {
        boardRect = boardRef.getBoundingClientRect();
      }

      // Calculate bounds for each path
      for (const path of paths) {
        const pathBounds = calculatePathBounds(path.d);
        bounds.push(pathBounds);
      }

      setPieceBounds(bounds);

      // Define board dimensions - use the reference board area if available
      let boardTop, boardLeft, boardWidth, boardHeight;

      if (boardRect) {
        // Use the actual board reference dimensions
        boardTop = boardRect.top;
        boardLeft = boardRect.left;
        boardWidth = boardRect.width;
        boardHeight = boardRect.height;
      } else {
        // Fallback to default values if board reference not found
        boardWidth = 700;
        boardHeight = 700;
        boardTop = 100;
        boardLeft = (windowSize.width - boardWidth) / 2;
      }

      // Place pieces randomly within the reference board area
      for (let i = 0; i < paths.length; i++) {
        const pieceWidth = bounds[i].width;
        const pieceHeight = bounds[i].height;

        // Get the reference board dimensions for responsive sizing
        const boardRef = document.getElementById('puzzle-board-reference');
        let boardWidth = windowSize.width * 0.8; // Default to 80% of window width
        let boardHeight = boardWidth; // Square aspect ratio

        if (boardRef) {
          const boardRect = boardRef.getBoundingClientRect();
          boardWidth = boardRect.width;
          boardHeight = boardRect.height;
        }

        // Use the actual board dimensions for puzzle sizing
        const fullImageWidth = boardWidth;
        const fullImageHeight = boardHeight;

        // Random X position - adjusted to account for the full image size
        const minX = boardLeft + 100; // Increased margin from left edge
        const maxX = boardLeft + boardWidth - fullImageWidth; // Ensure full image stays within board
        let randomX = Math.random() * (maxX - minX) + minX;

        // Ensure X is never negative or too far right
        randomX = Math.max(randomX, 0);
        randomX = Math.min(randomX, windowSize.width - fullImageWidth);

        // Random Y position - adjusted to account for the full image size
        const minY = boardTop + 100; // Increased margin from top edge
        const maxY = boardTop + boardHeight - fullImageHeight; // Ensure full image stays within board
        let randomY = Math.random() * (maxY - minY) + minY;

        // Ensure Y is never negative or too far down
        randomY = Math.max(randomY, 70); // Account for navigation bar
        randomY = Math.min(randomY, windowSize.height - fullImageHeight);

        // Simple collision avoidance
        let attempts = 0;
        const maxAttempts = 5;
        let collision = false;

        do {
          collision = false;

          // Check for collisions with already placed pieces
          for (let j = 0; j < positions.length; j++) {
            const existingPos = positions[j];
            const existingBounds = bounds[j];

            // Check if pieces overlap
            const overlapX = randomX < existingPos.x + existingBounds.width && randomX + pieceWidth > existingPos.x;
            const overlapY = randomY < existingPos.y + existingBounds.height && randomY + pieceHeight > existingPos.y;

            if (overlapX && overlapY) {
              collision = true;
              break;
            }
          }

          if (collision && attempts < maxAttempts) {
            // Try a new random position
            randomX = Math.random() * (maxX - minX) + minX;
            randomY = Math.random() * (maxY - minY) + minY;
            attempts++;
          }
        } while (collision && attempts < maxAttempts);

        // Add position to list
        positions.push({
          x: randomX,
          y: randomY,
        });
      }

      positionsGeneratedRef.current = true;
      return positions;
    },
    [calculatePathBounds, puzzlePositions, windowSize]
  );

  // Load SVG file
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(svgFile);

        if (!response.ok) {
          throw new Error(`Failed to load SVG file: ${response.status} ${response.statusText}`);
        }

        const svgText = await response.text();

        if (!svgText || svgText.length === 0) {
          throw new Error('SVG file is empty');
        }

        // Parse SVG as XML
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Check for parsing errors
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Error parsing SVG: ' + parserError.textContent);
        }

        // Extract paths
        const paths = Array.from(svgDoc.querySelectorAll('path')).map((path) => ({
          id: path.getAttribute('id'),
          d: path.getAttribute('d'),
        }));

        if (paths.length === 0) {
          throw new Error('No paths found in SVG file');
        }

        setSvgContent(paths);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading SVG file:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSvg();
  }, [svgFile]);

  // Generate positions when SVG content is loaded
  useEffect(() => {
    // Delay position generation slightly to ensure the board reference is rendered
    if (svgContent && svgContent.length > 0 && !positionsGeneratedRef.current) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        const positions = generateRandomPositions(svgContent);
        setPuzzlePositions(positions);
      }, 100);
    }
  }, [svgContent, generateRandomPositions]);

  // Aktualizujemy postęp i sprawdzamy, czy układanka jest ukończona
  useEffect(() => {
    if (svgContent && svgContent.length > 0) {
      const newProgress = Math.round((snappedPieces.length / svgContent.length) * 100);
      setProgress(newProgress);
      setCompletionPercentage(newProgress); // Aktualizujemy tylko jedną wartość procentową
      
      if (snappedPieces.length === svgContent.length) {
        setIsCompleted(true);
      }
    }
  }, [snappedPieces, svgContent]);

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  // Get the correct position for each puzzle piece
  const getCorrectPosition = useCallback((index) => {
    // The reference board position and dimensions
    const boardRef = document.getElementById('puzzle-board-reference');
    if (!boardRef) return { x: 0, y: 0 };

    const boardRect = boardRef.getBoundingClientRect();
    return {
      x: boardRect.left,
      y: boardRect.top,
    };
  }, []);

  // Check if a piece is close to its correct position
  const checkSnapPosition = useCallback(
    (index, currentX, currentY) => {
      const correctPos = getCorrectPosition(index);

      // Calculate distance to correct position
      const distance = Math.sqrt(Math.pow(currentX - correctPos.x, 2) + Math.pow(currentY - correctPos.y, 2));

      // If within threshold, snap to correct position
      if (distance < SNAP_THRESHOLD) {
        return {
          x: correctPos.x,
          y: correctPos.y,
          snapped: true,
        };
      }

      return null;
    },
    [getCorrectPosition]
  );

  // Update puzzle position after drag
  const updatePuzzlePosition = (index, position) => {
    const currentPosition = { ...puzzlePositions[index] };
    const bound = pieceBounds[index] || { width: 100, height: 100 };

    // Używamy bezpośrednio wartości x,y zamiast offsetu
    const newX = position.x;
    const newY = position.y;

    // Add margin to prevent pieces from going off-screen
    const margin = 50;

    // Limit X position
    let limitedX = newX;
    if (newX < -bound.width + margin) limitedX = -bound.width + margin;
    if (newX > windowSize.width - margin) limitedX = windowSize.width - margin;

    // Limit Y position
    let limitedY = newY;
    if (newY < 0) limitedY = 0;
    if (newY > windowSize.height - margin) limitedY = windowSize.height - margin;

    // Check if piece should snap to position
    const snapPosition = checkSnapPosition(index, limitedX, limitedY);
    let snapped = false;

    if (snapPosition) {
      limitedX = snapPosition.x;
      limitedY = snapPosition.y;
      snapped = snapPosition.snapped;

      // Update snapped pieces state if this is newly snapped
      if (snapped && !snappedPieces.includes(index)) {
        const newSnappedPieces = [...snappedPieces, index];
        setSnappedPieces(newSnappedPieces);

        // Dodaj efekt dźwiękowy lub wibracji na urządzeniach mobilnych
        if ('vibrate' in navigator) {
          navigator.vibrate(100); // Krótka wibracja na urządzeniach mobilnych
        }
      }
    }

    // Update position in state
    const updatedPositions = [...puzzlePositions];
    updatedPositions[index] = { x: limitedX, y: limitedY, snapped };
    setPuzzlePositions(updatedPositions);

    return { x: limitedX, y: limitedY, snapped };
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Navigation bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={handleBackToHome}
          sx={{
            borderRadius: 2,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '0.9rem',
            textTransform: 'none',
            padding: '8px 16px',
            letterSpacing: '0.5px',
          }}
        >
          Powrot do strony glownej
        </Button>
      </Box>

      {/* Puzzle workspace */}
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          pt: '70px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Puzzle pieces */}
        {svgContent &&
          svgContent.length > 0 &&
          puzzlePositions.length === svgContent.length &&
          svgContent.map((path, index) => {
            if (!path.d) return null;

            // Pobieramy pozycję ze stanu - to jest pozycja *przed* potencjalnym przeciągnięciem
            const position = puzzlePositions[index];

            return (
              <motion.img
                key={path.id || `puzzle-${index}`}
                src={imageUrl}
                alt={`Puzzle piece ${index}`}
                drag
                dragMomentum={false}
                dragElastic={0}
                initial={false}
                animate={{
                  x: position.x,
                  y: position.y,
                  // Dodajemy animację dla "snapniętych" elementów
                  scale: position.snapped ? [1, 1.05, 1] : 1,
                  boxShadow: position.snapped ? ['0 4px 8px rgba(0, 0, 0, 0.3)', '0 0 15px rgba(255, 87, 34, 0.8)', '0 4px 8px rgba(0, 0, 0, 0.3)'] : '0 4px 8px rgba(0, 0, 0, 0.3)',
                  transition: {
                    duration: position.snapped ? 0.5 : 0.2,
                    ease: 'easeInOut',
                  },
                }}
                dragConstraints={position.snapped ? { top: 0, left: 0, right: 0, bottom: 0 } : false}
                onDragStart={(e, info) => {
                  if (position.snapped) {
                    e.stopPropagation();
                    return;
                  }

                  // Zapisz pozycję startową puzzla w refie
                  dragStartPosRef.current[index] = { x: position.x, y: position.y };

                  // Zwiększ z-index elementu podczas przeciągania
                  e.target.style.zIndex = 20;
                }}
                onDragEnd={(event, info) => {
                  // Resetuj z-index po zakończeniu przeciągania
                  event.target.style.zIndex = 10;

                  // Pobierz pozycję startową z refa
                  const startPos = dragStartPosRef.current[index];
                  if (!startPos) return; // Bezpiecznik

                  // Oblicz końcową pozycję na podstawie pozycji startowej i offsetu
                  const finalX = startPos.x + info.offset.x;
                  const finalY = startPos.y + info.offset.y;

                  // Zaktualizuj pozycję puzzla w stanie
                  updatePuzzlePosition(index, { x: finalX, y: finalY });

                  // Usuń pozycję startową z refa
                  delete dragStartPosRef.current[index];
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  // Use SVG clipPath with viewBox for proper scaling
                  clipPath: `path('${path.d}')`,
                  WebkitClipPath: `path('${path.d}')`,
                  // Add pointer-events: none to all areas outside the clip path
                  pointerEvents: 'painted',
                  filter: position.snapped ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.1)' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                  cursor: position.snapped ? 'default' : 'grab',
                  touchAction: 'none',
                  zIndex: position.snapped ? 5 : 10,
                }}
              />
            );
          })}

        {/* Puzzle board reference area */}
        <Paper
          elevation={3}
          id="puzzle-board-reference"
          sx={{
            position: 'absolute',
            top: { xs: '80px', sm: '100px' },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '90vw', sm: '80vw', md: '70vw', lg: '60vw', xl: '50vw' },
            height: { xs: '90vw', sm: '80vw', md: '70vw', lg: '60vw', xl: '50vw' },
            maxWidth: '700px',
            maxHeight: '700px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px dashed rgba(255, 87, 34, 0.5)',
            borderRadius: 3,
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              p: 2,
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.5px',
            }}
          >
            Przeciagnij elementy puzzli, aby ulozyc obrazek w tym miejscu
          </Typography>
        </Paper>

        {/* Loading status */}
        {isLoading && (
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'primary.main',
              zIndex: 9998,
              backgroundColor: 'rgba(0,0,0,0.7)',
              p: 3,
              borderRadius: 2,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            Ladowanie puzzli...
          </Typography>
        )}

        {/* Error message */}
        {error && (
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'error.main',
              zIndex: 9998,
              backgroundColor: 'rgba(0,0,0,0.7)',
              p: 3,
              borderRadius: 2,
            }}
          >
            Blad: {error}
          </Typography>
        )}

        {/* Progress indicator - pokazuje liczbę ułożonych puzzli */}
        {!isCompleted && progress > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: { xs: '90%', sm: '80%', md: '60%' },
              maxWidth: '600px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                textAlign: 'center',
                mb: 1,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(0,0,0,0.6)',
                px: 2,
                py: 1,
                borderRadius: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Ukończono: {progress}% ({snappedPieces.length} z {svgContent?.length || 0} elementów)
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'primary.main',
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Completion message */}
        {isCompleted && (
          <Paper
            elevation={5}
            sx={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.85)',
              p: 4,
              borderRadius: 3,
              backdropFilter: 'blur(5px)',
              border: '2px solid #4CAF50',
              maxWidth: '90%',
              width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translate(-50%, -60%)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%)',
                },
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#4CAF50',
                fontFamily: 'Fredoka One, cursive',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Gratulacje!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontFamily: 'Montserrat, sans-serif',
                mb: 3,
              }}
            >
              Udało Ci się ułożyć całą układankę! Puzzle zostały poprawnie umieszczone.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBackToHome}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
              }}
            >
              Wróć do menu głównego
            </Button>
          </Paper>
        )}

        {/* Help panel */}
        {showHelp && !helpDismissed && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: '90vw', sm: '80vw', md: '70vw', lg: '60vw', xl: '50vw' },
              maxWidth: '700px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              zIndex: 9999,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '1rem',
                letterSpacing: '0.5px',
                mb: 2,
              }}
            >
              Witaj w grze układanki! Przeciągnij elementy puzzli, aby ułożyć obrazek.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDismissHelp}
              sx={{
                borderRadius: 2,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'none',
                padding: '8px 16px',
                letterSpacing: '0.5px',
              }}
            >
              Rozumiem
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default PuzzleBoard;
