import React from "react";

const GenerateInitialsImage = ({ name, color }: { name: string, color: string }) => {
  // Obtener las iniciales
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  // Estilos para el contenedor del círculo
  const containerStyle: React.CSSProperties = {
    width: '50px', // Cambiar el tamaño según sea necesario
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color,
    color: '#ffffff',
    fontSize: '25px', // Cambiar el tamaño de fuente según sea necesario
    textTransform: 'uppercase',
  };

  return <div style={containerStyle}>{initials}</div>;
};

export const MemoizedGenerateInitialsImage = React.memo(GenerateInitialsImage);