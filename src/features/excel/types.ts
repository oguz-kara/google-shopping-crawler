import { Worksheet, Cell } from 'exceljs'

export type ReadFile = (filepath: string) => Promise<Worksheet>
export type ColumnData = (workbook: Worksheet) => RowData[]
export type RowData = { [key: string]: Cell }
export type ColumnNamesSet = Set<string>
export interface Product {
  A: number
  B: string
  C?: string
  D?: string
  E: number
  F: number
}

export interface ScrapedProduct {
  price: string;
  provider: string;
  link: string;
  image: string;
  name: string;
}

