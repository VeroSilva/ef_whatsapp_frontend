export const isColorDark = (color: any) => {
    const hexColor = color.replace("#", "");
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const relativeBrightness = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

    return relativeBrightness < 0.5;
}

export const uniqueIdGenerator = () => {
  const uniqueTime = Date.now();
  const random = Math.floor(Math.random() * 10000); // Número random entre 0 y 9999
  const uniqueId = `${uniqueTime}-${random}`;
  return uniqueId;
}