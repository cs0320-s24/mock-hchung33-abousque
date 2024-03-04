import { useState } from "react";
import mockedJson from "../../../data/mockedJson.js";

// MOCKED DATA
const exampleCsvStrings = mockedJson.exampleCsvStrings;
const oneRow = mockedJson.oneRow;
const oneCol = mockedJson.oneCol;
const exampleSearchResultStrings = mockedJson.exampleSearchResultStrings;
const exampleCsvNumbers = mockedJson.exampleCsvNumbers;
const exampleSearchResultNumbers = mockedJson.exampleSearchResultNumbers;
const oneColSearchResult = mockedJson.oneColSearchResult;
const oneRowSearchResult = mockedJson.oneRowSearchResult;
const exampleIncomeCsv = mockedJson.exampleIncomeCsv;
const exampleIncomeSearchResult = mockedJson.exampleIncomeSearchResult;
const malformedCsv = mockedJson.malformed;

/**
 * Contains functions for mocked versions of loadCsv, viewCsv, and searchCsv backend.
 */
interface CSVActionsCollection {
  mockedLoadCsv(filepath: string): string[][];
  mockedViewCsv(): string[][];
  mockedSearchCsv(column: string | number, value: string): string[][];
}

/**
 * Mocks execution of load, view, and search csv functionality.
 *
 * @returns the 3 mocked functions: mockedLoadCsv, mockedViewCsv, and mockedSearchCsv
 */
export function csvActions(): CSVActionsCollection {
  const [currentCSVPath, setCurrentCSVPath] = useState<string>();
  const [currentCSV, setCurrentCSV] = useState<string[][] | number[][]>();

  const filepathToData = new Map<string, string[][] | number[][]>([
    ["names_and_ages.csv", exampleCsvStrings],
    ["numbers.csv", exampleCsvNumbers],
    ["one_row.csv", oneRow],
    ["one_col.csv", oneCol],
    ["income.csv", exampleIncomeCsv],
    ["malformed.csv", malformedCsv],
  ]);

  const filepathToSearchResult = new Map<string, string[][] | number[][]>([
    ["names_and_ages.csv", exampleSearchResultStrings],
    ["numbers.csv", exampleSearchResultNumbers],
    ["one_row.csv", oneRowSearchResult],
    ["one_col.csv", oneColSearchResult],
    ["income.csv", exampleIncomeSearchResult],
  ]);

  /**
   * Mocks load functionality for a CSV at a certain (fake) filepath.
   *
   * @param filepath the fake filepath to load the CSV of interest from
   * @returns a string[][] the output of executing the load command
   */
  function mockedLoadCsv(filepath: string): string[][] {
    if (!filepathToData.has(filepath)) {
      return [["Invalid filepath"]];
    } else if (filepath === "malformed.csv") {
      return [["Malformed CSV. Unable to handle this file."]];
    }
    setCurrentCSVPath(filepath);
    setCurrentCSV(filepathToData.get(filepath));
    return [["Successfully loaded CSV at " + filepath]];
  }

  /**
   * Mocks view functionality for a previously "loaded" (mocked) CSV.
   *
   * @returns a string[][] the output of executing the view command
   */
  function mockedViewCsv(): string[][] {
    if (currentCSVPath === undefined || currentCSV === undefined) {
      return [["Attempted to view CSV before loading CSV"]];
    } else {
      return currentCSV.map((row, index) =>
        row.map((cell, index) => cell.toString())
      );
    }
  }

  /**
   * Mocks search functionality for a previously "loaded" (mocked) CSV.
   *
   * @param column the column name or index to search in
   * @param value the string value to search for
   * @returns a string[][] the output of executing the search command
   */
  function mockedSearchCsv(column: string | number, value: string): string[][] {
    if (currentCSVPath === undefined || currentCSV === undefined) {
      return [["Atempted to search CSV before loading CSV"]];
    } else {
      const result = filepathToSearchResult.get(currentCSVPath);
      if (result === undefined) {
        return [["Internal error in search. Concerning developer bug."]];
      } else {
        return result.map((row, index) =>
          row.map((cell, index) => cell.toString())
        );
      }
    }
  }

  // Return to use in REPLInput
  return {
    mockedLoadCsv,
    mockedViewCsv,
    mockedSearchCsv,
  };
}
