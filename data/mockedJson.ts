const emptyResult: string[][] = [[]];

const oneRow = [["a", "csv", "with", "one", "row!"]];

const oneRowSearchResult = emptyResult;

const oneCol = [["this"], ["csv"], ["has"], ["only"], ["one"], ["column"]];

const oneColSearchResult = [["this"]];

export const exampleCsvStrings = [
  ["first_name", "last_name", "age"],
  ["Harry", "Potter", "56"],
  ["Danny", "Fish", "23"],
  ["Harry", "Harry", "12"],
];

const exampleSearchResultStrings = [
  ["Harry", "Potter", "56"],
  ["Harry", "Harry", "12"],
];

const exampleCsvNumbers = [
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [0, 1, 0, 1, 0],
];

const exampleSearchResultNumbers = [[0, 1, 0, 1, 0]];

export default {
  emptyResult,
  oneRow,
  oneRowSearchResult,
  oneCol,
  oneColSearchResult,
  exampleCsvStrings,
  exampleSearchResultStrings,
  exampleCsvNumbers,
  exampleSearchResultNumbers,
};
