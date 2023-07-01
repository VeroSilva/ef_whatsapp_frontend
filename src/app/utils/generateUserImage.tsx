import React, { useRef, useEffect } from 'react';

const GenerateInitialsImage = (name: string) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const containerWidth = canvas.parentElement?.clientWidth || 200;
      const containerHeight = canvas.parentElement?.clientHeight || 200;

      // Establecer el tamaño del canvas
      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // Configuración del círculo
      const size = Math.min(containerWidth, containerHeight);
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      const radius = size / 2;
      const backgroundColor = getRandomColor(['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e']);
      const textColor = '#ffffff';

      // Establecer el color de fondo
      context.fillStyle = backgroundColor;
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fill();

      // Establecer el color del texto
      context.fillStyle = textColor;
      context.font = `${size / 2}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      // Obtener las iniciales
      const initials = name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

      // Dibujar las iniciales en el centro del círculo
      context.fillText(initials, centerX, centerY);
    }
  }, [name]);

  // Generar un color aleatorio de la paleta
  const getRandomColor = (palette: string[]): string => {
    return palette[Math.floor(Math.random() * palette.length)];
  };

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default GenerateInitialsImage;