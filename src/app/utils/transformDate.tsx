// Funciones comunes
function formatDate(date: Date, format: string): string {
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const formattedHours = date.getHours() % 12 || 12;
  return format.replace(/HH/g, formattedHours.toString().padStart(2, '0'))
    .replace(/mm/g, date.getMinutes().toString().padStart(2, '0'))
    .replace(/ss/g, date.getSeconds().toString().padStart(2, '0'))
    .replace(/A/g, ampm)
    .replace(/dd/g, date.getDate().toString().padStart(2, '0'))
    .replace(/MM/g, (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace(/yyyy/g, date.getFullYear().toString());
}

function isToday(currentDate: Date, providedDate: Date): boolean {
  const isWithin24Hours = (currentDate.getTime() - providedDate.getTime()) < 24 * 60 * 60 * 1000;
  return isWithin24Hours && currentDate.getDate() === providedDate.getDate()
}

function isYesterday(currentDate: Date, providedDate: Date): boolean {
  const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  return providedDate.toDateString() === yesterday.toDateString();
}

function isWithinOneWeek(currentDate: Date, providedDate: Date): boolean {
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  return providedDate >= oneWeekAgo;
}

// Transformar timestamp a string
export function transformDate(timestamp: number): string {
  const currentDate = new Date();
  const providedDate = timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp);

  if (isToday(currentDate, providedDate)) {
    // Formatear la fecha en "Hoy HH:mm AM/PM"
    return `Hoy ${formatDate(providedDate, 'HH:mm A')}`;
  } else if (isYesterday(currentDate, providedDate)) {
    // Formatear la fecha en "Ayer HH:mm AM/PM"
    return `Ayer ${formatDate(providedDate, 'HH:mm A')}`;
  } else if (isWithinOneWeek(currentDate, providedDate)) {
    // Obtener el nombre del día de la semana y la hora en formato HH:mm AM/PM
    const dayOfWeek = providedDate.toLocaleDateString('es-ES', { weekday: 'long' });
    return `${dayOfWeek} ${formatDate(providedDate, 'HH:mm A')}`;
  } else {
    // Formatear la fecha en "dd/MM/yyyy HH:mm:ss AM/PM"
    return formatDate(providedDate, 'dd/MM/yyyy HH:mm A');
  }
}

export function convertDateFormatAndRelative(inputDate: string): string {
  const [day, month, year] = inputDate.split("/");
  const inputDateObj = new Date(+year, +month - 1, +day);
  const currentDate = new Date();

  // Obtener el nombre del día de la semana en que se envió el mensaje
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayOfWeek = daysOfWeek[inputDateObj.getDay()];

  if (isToday(currentDate, inputDateObj)) {
    return "Hoy";
  }

  if (isYesterday(currentDate, inputDateObj)) {
    return "Ayer";
  }

  // Verificar si es de esta semana
  const isThisWeek =
    inputDateObj >= new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) &&
    inputDateObj <= currentDate;

  // Si no es Hoy, Ayer ni de esta semana, devuelve el nombre del día de la semana y la fecha completa
  if (!isThisWeek) {
    const formattedDate = `${dayOfWeek} ${inputDateObj.getDate()}/${inputDateObj.getMonth() + 1}/${inputDateObj.getFullYear()}`;
    return formattedDate;
  }

  // Si no es Hoy ni Ayer, devuelve el nombre del día de la semana en que se envió el mensaje
  return dayOfWeek;
}
