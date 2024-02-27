import { useState } from "react";
import mockedJson from "../../../data/mockedJson.js";

// MOCKED DATA
const exampleCsvStrings = mockedJson.exampleCsvStrings;
const emptyResult = mockedJson.emptyResult;
const oneRow = mockedJson.oneRow;
const oneCol = mockedJson.oneCol;
const exampleSearchResultStrings = mockedJson.exampleSearchResultStrings;
const exampleCsvNumbers = mockedJson.exampleCsvNumbers;
const exampleSearchResultNumbers = mockedJson.exampleSearchResultNumbers;

interface CSVActions {
  mockedCSV(filepath: string): string[][];
  mockedViewCSV: string[][];
  mockedSearchCSV(column: string | number, value: string): string[][];
}

export function csvActions() {
  const [currentCSVPath, setCurrentCSVPath] = useState<string>();
  const [currentCSV, setCurrentCSV] = useState<string[][] | number[][]>();

  const filepathToData = new Map<string, string[][] | number[][]>([
    ["names_and_ages.csv", exampleCsvStrings],
    ["numbers.csv", exampleCsvNumbers],
    ["one_row.csv", oneRow],
    ["one_col.csv", oneCol],
    //   ["empty.csv", emptyResult],
  ]);

  // const dataToFilepath = new Map<string[][] | number[][], string>([
  //   [exampleCsvStrings, "names_and_ages.csv"],
  //   [exampleCsvNumbers, "numbers.csv"],
  //   [oneRow, "one_row.csv"],
  //   [oneCol, "one_col.csv"],
  //   //   [emptyResult], "empty.csv"],
  // ]);

  const fileToSearchResult = new Map<string, string[][] | number[][]>([
    ["names_and_ages.csv", exampleSearchResultStrings],
    ["numbers.csv", exampleSearchResultNumbers],
  ]);

  function mockedLoadCsv(filepath: string): string[][] {
    if (!filepathToData.has(filepath)) {
      return [["Invalid filepath"]];
    }
    setCurrentCSVPath(filepath);
    setCurrentCSV(filepathToData.get(filepath));
    return [["Successfully loaded CSV at " + filepath]];
  }

  function mockedViewCsv(): string[][] {
    if (currentCSVPath === undefined || currentCSV === undefined) {
      return [["Attempted to view CSV before loading CSV"]];
    } else {
      return currentCSV.map((row, index) =>
        row.map((cell, index) => cell.toString())
      );
    }
  }

  function mockedSearchCsv(column: string | number, value: string): string[][] {
    if (currentCSVPath === undefined) {
      return [["Atempted to search CSV before loading CSV"]];
    } else {
      const result = fileToSearchResult.get(currentCSVPath);
      if (result === undefined) {
        return [["Internal error in search. Concerning developer bug."]];
      } else {
        return result.map((row, index) =>
          row.map((cell, index) => cell.toString())
        );
      }
    }
  }

  return {mockedLoadCsv, mockedViewCsv, mockedSearchCsv}

}

