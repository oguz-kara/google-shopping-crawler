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
  name: string | null
  price: string | null
  provider: string | null
  link: string | null
  image: string | null
}

export interface RelatedScrapedProduct {
  price: string | null | undefined;
  provider: string | null | undefined;
  link: string | null | undefined;
}