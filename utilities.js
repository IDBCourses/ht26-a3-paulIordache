export const getCSS = (className) => {
  let elem = document.querySelector(`${className}`);
  let shapeStyleCSS = getComputedStyle(elem);
  return shapeStyleCSS;
};
