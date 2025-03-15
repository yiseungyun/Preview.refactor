export const convertToRem = (size: number | string) => {
  if (typeof size === "string") return size;
  size = Number(size);
  if (size % 4 === 0) return `${size / 4}rem`;
  return `${size * 0.25}rem`;
}