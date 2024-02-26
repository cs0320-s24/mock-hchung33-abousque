import { useState } from "react";
import mockedJson from "../../../data/mockedJson.js";

// loadedFilepath variable

// MOCKED DATA
const exampleCsvStrings = mockedJson.exampleCsvStrings;
const emptyResult = mockedJson.emptyResult;
const oneRow = mockedJson.oneRow;
const oneCol = mockedJson.oneCol;
const exampleSearchResultStrings = mockedJson.exampleSearchResultStrings;
const exampleCsvNumbers = mockedJson.exampleCsvNumbers;
const exampleSearchResultNumbers = mockedJson.exampleSearchResultNumbers;

interface CSVActions{
  mockedCSV(filepath: string) : string[][];
  mockedViewCSV : string[][];
}

export function csvActions() {
  const [currentCSV, setCurrentCSV] = useState<string[][] | number[][]>();

  const filepathToData = new Map<string, string[][] | number[][]>([
    ["names_and_ages.csv", exampleCsvStrings],
    ["numbers.csv", exampleCsvNumbers],
    ["one_row.csv", oneRow],
    ["one_col.csv", oneCol],
    //   ["empty.csv", emptyResult],
  ]);

  const dataToFilepath = new Map<string[][] | number[][], string>([
    [exampleCsvStrings, "names_and_ages.csv"],
    [exampleCsvNumbers, "numbers.csv"],
    [oneRow, "one_row.csv"],
    [oneCol, "one_col.csv"],
    //   [emptyResult], "empty.csv"],
  ]);

  function mockedLoadCsv(filepath: string): string[][] {
    if (!filepathToData.has(filepath)) {
      return [["Invalid filepath"]];
    }
    setCurrentCSV(filepathToData.get(filepath));
    return [["Successfully loaded CSV at " + filepath]];
  }

  function mockedViewCsv(): string[][] {
    if (currentCSV === undefined) {
      return [["Attempted to view CSV before loading CSV"]];
    } else {
      return currentCSV.map((row, index) =>
        row.map((cell, index) => cell.toString())
      );
    }
  }

  return {mockedLoadCsv, mockedViewCsv}

}
