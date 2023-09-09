import { Worksheet, Cell } from "exceljs"

export type ReadFile = (filepath: string) => Promise<Worksheet>
export type ColumnData = (workbook: Worksheet) => RowData[]
export type RowData = { [key: string]: Cell }
export type ColumnNamesSet = Set<string>
export interface Product {
  A: number;
  B: string;
  C: string;
  D: string;
  E: number;
  F: {
    result: number;
    sharedFormula: string;
  };
  G: number;
  H: string;
  J: null | any; // Change 'any' to a more specific type if needed
}