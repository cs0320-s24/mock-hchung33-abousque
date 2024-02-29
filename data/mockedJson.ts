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

const exampleIncomeCsv = [
  [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ],
  ["RI", "White", "$1,058.47", "395773.6521", "$1.00", "75%"],
  ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  [
    "RI",
    "Native American/American Indian",
    "$471.07",
    "2315.505646",
    "$0.45",
    "0%",
  ],
  ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
  ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
  ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
];

const exampleIncomeSearchResult = [
  ["RI", "White", "$1,058.47", "395773.6521", "$1.00", "75%"],
  ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  [
    "RI",
    "Native American/American Indian",
    "$471.07",
    "2315.505646",
    "$0.45",
    "0%",
  ],
  ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
  ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
  ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
];

const malformed = [[1, 2, 1], [5]];

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
  exampleIncomeCsv,
  exampleIncomeSearchResult,
  malformed,
};
