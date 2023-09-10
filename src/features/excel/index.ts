import ejs, { Cell, Row, Worksheet } from 'exceljs'
import { ReadFile, ColumnData, ColumnNamesSet, RowData } from './types'
import fs from 'fs'

export const getReadedFile: ReadFile = async (filepath) => {
  // ! implement error handling
  // ! for sheet not founded

  const workbook = new ejs.Workbook()

  await workbook.xlsx.readFile(filepath)

  return workbook.getWorksheet('Sayfa1')
}

const extractColumnNames = (worksheet: Worksheet) => {
  const columnNames: ColumnNamesSet = new Set()
  worksheet.eachRow({ includeEmpty: false }, (row: Row) => {
    row.eachCell((cell: Cell) => {
      columnNames.add(cell.address.substring(0, 1)) // Extract column name (e.g., 'A', 'B', 'C')
    })
  })

  return columnNames
}

const extractDataFromWorksheet = (
  worksheet: Worksheet,
  columnNames: ColumnNamesSet,
) => {
  const result: RowData[] = []
  worksheet.eachRow({ includeEmpty: false }, (row: Row) => {
    const rowData: RowData = {}
    columnNames.forEach((columnName) => {
      const cellValue = row.getCell(columnName).value as Cell
      rowData[columnName] = cellValue
    })
    result.push(rowData)
  })

  return result
}

export const getColumnDataFromWorksheet: ColumnData = (worksheet) => {
  try {
    const columnNames = extractColumnNames(worksheet)
    const data = extractDataFromWorksheet(worksheet, columnNames)

    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export const writeDataToXlsxFile = (data: any) => {
  // Create a new workbook and add a worksheet
  const workbook = new ejs.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  // Define the headers
  worksheet.columns = [
    { header: 'barkod', key: 'A' },
    { header: 'urun ismi', key: 'B' },
    { header: 'marka', key: 'C' },
    { header: 'kategori', key: 'D' },
    { header: 'alis fiyati', key: 'E' },
    { header: 'satis fiyati', key: 'F' },
    { header: 'stok adedi', key: 'G' },
    { header: 'stok turu', key: 'H' },
    { header: 'onerilen satis fiyati', key: 'recommendedSalePrice' },
    {
      header: 'rakip ortalama satis fiyati',
      key: 'averageCompatitorSalePrice',
    },
    // Add more headers as needed
  ]

  // Add the data to the worksheet
  worksheet.addRows(data)

  // Save the workbook to a file
  const filePath = 'output.xlsx'
  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log(`Excel file saved as ${filePath}`)
    })
    .catch((error) => {
      console.error('Error saving Excel file:', error)
    })
}
