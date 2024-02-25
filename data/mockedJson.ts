const emptyResult: string[] = [];

const oneRow = [["a", "csv", "with", "one", "row!"]];

const oneCol = [["this"], ["csv"], ["has"], ["only"], ["one"], ["column"]];

export const exampleCsvStrings = [
  ["first name", "last name", "age"],
  ["Harry", "Potter", "56"],
  ["Danny", "Fish", "23"],
  ["John", "Harry", "12"],
];

const exampleSearchResultStrings = [
  ["Harry", "Potter", "56"],
  ["John", "Harry", "12"],
];

const exampleCsvNumbers = [
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [0, 1, 0, 1, 0],
];

const exampleSearchResultNumbers = [[0, 1, 0, 1, 0]];

export default {
  exampleCsvStrings,
  emptyResult,
  oneRow,
  oneCol,
  exampleSearchResultStrings,
  exampleCsvNumbers,
  exampleSearchResultNumbers,
};
