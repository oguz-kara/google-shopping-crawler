import ejs, { Cell, Row, Worksheet } from 'exceljs'
import { ReadFile, ColumnData, ColumnNamesSet, RowData } from './types'

const getReadedFile: ReadFile = async (filepath) => {
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

const extractDataFromWorksheet = (worksheet: Worksheet, columnNames:ColumnNamesSet ) => {
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

const getColumnDataFromWorksheet: ColumnData = (worksheet) => {
  try {
    const columnNames = extractColumnNames(worksheet)
    const data = extractDataFromWorksheet(worksheet, columnNames)
    
    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default {
  getReadedFile,
  getColumnDataFromWorksheet,
}
