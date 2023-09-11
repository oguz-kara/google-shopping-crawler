import { scraper } from '@features/scrapping'
import path from 'path'
import {
  getReadedFile,
  getColumnDataFromWorksheet,
  writeDataToXlsxFile,
} from '@features/excel'
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
  const workbook = await getReadedFile(excelFilePath)
  const data = getColumnDataFromWorksheet(workbook)
  const testData = data.slice(75, 79)

  const scrappedData = await scraper.google.shoppingScraper(testData)
  const similarProducts = scrappedData?.map((item) => getSimilarProducts(item))
  const analyzedProducts = analyzeProductListPrices(
    similarProducts as ProductWithRelateds[],
  )
  writeDataToXlsxFile(analyzedProducts)
}

start()