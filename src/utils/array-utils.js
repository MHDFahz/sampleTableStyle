export const getUniqueValues = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};
