import { scraper } from '@features/scrapping'
import fs from 'fs'
import path from 'path'
import excel from '@features/excel'
import { getSimilarProducts } from '@features/product-filter/lib/productFilter'
import { analyzeProductListPrices } from '@features/analyze/lib/analyze'
import { ProductWithRelateds } from '@features/product-filter/types'
// scraper.google.shoppingScraper()

const excelFilePath = path.resolve(
  __dirname,
  'features',
  'excel',
  'products.xlsx',
)

const start = async () => {
  const workbook = await excel.getReadedFile(excelFilePath)
  const data = excel.getColumnDataFromWorksheet(workbook)
  const testData = data.slice(267, 273)

  const scrappedData = await scraper.google.shoppingScraper(testData)
  const similarProducts = scrappedData?.map((item) => getSimilarProducts(item))
  const analyzedProduct = analyzeProductListPrices(similarProducts as ProductWithRelateds[])

  fs.writeFile('result.txt', JSON.stringify(analyzedProduct), (err) => {
    if (err) console.log(err)
    else {
      console.log('File written successfully\n')
      console.log('The written has the following contents:')
    }
  })
}

start()
