export const transformDate = (timestamp: number): string => {
  const currentDate = new Date();
  const providedDate = new Date(timestamp * 1000); // Convierte el timestamp a milisegundos

  // Verifica si la fecha está dentro de las últimas 24 horas
  const isWithin24Hours = (currentDate.getTime() - providedDate.getTime()) < 24 * 60 * 60 * 1000;

  if (isWithin24Hours) {
    // Formatea la fecha en "hh:mm"
    const formattedTime = `${providedDate.getHours()}:${providedDate.getMinutes().toString().padStart(2, '0')}`;
    return formattedTime;
  } else if (isYesterday(currentDate, providedDate)) {
    return 'Ayer';
  } else if (isWithinOneWeek(currentDate, providedDate)) {
    // Obtiene el nombre del día de la semana
    const dayOfWeek = providedDate.toLocaleDateString('es-ES', { weekday: 'long' });
    return dayOfWeek;
  } else {
    // Formatea la fecha en "dd/mm/yyyy"
    const formattedDate = `${providedDate.getDate()}/${providedDate.getMonth() + 1}/${providedDate.getFullYear()}`;
    return formattedDate;
  }
}

function isYesterday(currentDate: Date, providedDate: Date): boolean {
  const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  return providedDate.toDateString() === yesterday.toDateString();
}

function isWithinOneWeek(currentDate: Date, providedDate: Date): boolean {
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  return providedDate >= oneWeekAgo;
}

export function convertEpochToDateTime(epochTime: number): string {
  const date = new Date(epochTime * 1000); // Convertir a milisegundos
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Formatear el resultado en "dd/mm/yyyy hh:mm"
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

  return formattedDateTime;
}
