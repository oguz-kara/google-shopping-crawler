import { scraper } from '@features/scrapping'
import excel from '@features/excel'
import path from 'path'
// scraper.google.shoppingScraper()

const excelFilePath = path.resolve(__dirname, 'features', 'excel', 'products.xlsx')

const start = async () => {
  const workbook = await excel.getReadedFile(excelFilePath)
  const data = excel.getColumnDataFromWorksheet(workbook)
  const productNames = data.map((item) => item.B)
  await scraper.google.shoppingScraper(productNames)
}

start()
