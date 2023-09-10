import { scraper } from '@features/scrapping'
import path from 'path'
import { Product } from '@features/excel/types'
import fs from 'fs'
// scraper.google.shoppingScraper()

const excelFilePath = path.resolve(
  __dirname,
  'features',
  'excel',
  'products.xlsx',
)

const start = async () => {
  // const workbook = await excel.getReadedFile(excelFilePath)
  // const data = excel.getColumnDataFromWorksheet(workbook)

  const testData: Product[] = [
    {
      A: 15,
      B: 'SHELL CORENA S3 R 68 20 LT',
      E: 1976.271,
      F: 2371.53,
    },
    {
      A: 15,
      B: 'MOTUL 5100 15W50 4T 1 LT',
      E: 159.7893,
      F: 191.75,
    },
    {
      A: 15,
      B: 'CASTROL POWER 1 4T 10W/40 1LT',
      E: 90.41978,
      F: 108.5,
    },
  ]

  const result = await scraper.google.shoppingScraper(testData)

  fs.writeFile('books.txt', JSON.stringify(result), (err) => {
    if (err) console.log(err)
    else {
      console.log('File written successfully\n')
      console.log('The written has the following contents:')
      console.log(fs.readFileSync('books.txt', 'utf8'))
    }
  })
}

start()