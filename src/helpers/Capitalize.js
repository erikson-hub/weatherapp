const capitalizeWords = (str) => {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
    return char.toUpperCase();
  });
};
export default capitalizeWords;
