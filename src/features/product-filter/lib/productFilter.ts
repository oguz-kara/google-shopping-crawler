import { ProductData } from '@features/scrapping/types'
import { findBestMatch } from 'string-similarity'
import fs from 'fs'

export const getSimilarProducts = (productData: ProductData) => {
  const baseProduct = productData.baseProduct || []
  const adsProducts = productData.ads || []
  const regularProducts = productData.regular || []
  const relatedProducts = productData.related || []

  const targetName = baseProduct.B
  const threshold = 0.7
  const allScrapedProducts = [
    ...adsProducts,
    ...regularProducts,
    ...relatedProducts,
  ]

  const names = allScrapedProducts.map((item) => ({ name: item.name }))
  console.log({ names })

  fs.writeFile(
    'movies.json',
    JSON.stringify(names),
    {
      encoding: 'utf8',
      flag: 'w',
      mode: 0o666,
    },
    (err) => {
      if (err) console.log(err)
      else {
        console.log('File written successfully\n')
        console.log('The written has the following contents:')
        console.log(fs.readFileSync('movies.txt', 'utf8'))
      }
    },
  )

  const matches = findBestMatch(
    targetName as string,
    allScrapedProducts.map((item) => item.name) as string[],
  )

  const filteredProducts = allScrapedProducts.filter((product, index) => {
    return matches.ratings[index].rating >= threshold
  })

  const result = {
    baseProduct,
    relatedProducts: filteredProducts,
  }

  return result
}
