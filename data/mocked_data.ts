const emptyResult = [];

const oneRow = [["a", "csv", "with", "one", "row!"]];

const oneCol = [["this"], ["csv"], ["has"], ["only"], ["one"], ["column"]];

const exampleCsvStrings = [
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

// MAPS FROM (PRETEND) FILEPATHS TO JS DATASETS
const filepathToData = new Map<string, string[][] | number[][]>([
  ["names_and_ages.csv", exampleCsvStrings],
  ["numbers.csv", exampleCsvNumbers],
  ["one_row.csv", oneRow],
  ["one_col.csv", oneCol],
  ["empty.csv", emptyResult],
]);

const dataToFilepath = new Map<string[][] | number[][], string>([
  [exampleCsvStrings, "names_and_ages.csv"],
  [exampleCsvNumbers, "numbers.csv"],
  [oneRow, "one_row.csv"],
  [oneCol, "one_col.csv"],
  [emptyResult, "empty.csv"],
]);
