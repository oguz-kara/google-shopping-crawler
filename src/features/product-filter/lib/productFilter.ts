import { ProductData } from '@features/scrapping/types'
import { findBestMatch } from 'string-similarity'

export const getSimirlarProducts = (productData: ProductData) => {
  const baseProduct = productData.baseProduct
  const adsProducts = productData.ads
  const regularProducts = productData.regular
  const relatedProducts = productData.related

  const targetName = baseProduct.B
  const threshold = 0.7
  const allScrapedProducts = [
    ...adsProducts,
    ...regularProducts,
    ...relatedProducts,
  ]

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
