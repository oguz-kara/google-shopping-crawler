import { ProductData } from '@features/scrapping/types'
import { checkSimilarityWithWords, isAmountMatch, isProper } from '../utils'

export const getSimilarProducts = (productData: ProductData) => {
  const baseProduct = productData.baseProduct || []
  const adsProducts = productData.ads || []
  const regularProducts = productData.regular || []
  const relatedProducts = productData.related || []

  const targetName = baseProduct.B
  const allScrapedProducts = [
    ...adsProducts,
    ...regularProducts,
    ...relatedProducts,
  ]

  const levenshteinFiltered = allScrapedProducts.filter((product) =>
    isProper(String(targetName), product.name),
  )
  const wordFiltered = levenshteinFiltered.filter((product) =>
    checkSimilarityWithWords(targetName as string, product.name),
  )
  const amountFiltered = wordFiltered.filter((product) =>
    isAmountMatch(String(targetName), product.name),
  )

  console.log({ allScrapedProducts })
  console.log(
    '___________________________________________________________________',
  )
  console.log({
    targetName,
    levenshteinFiltered,
    amountFiltered,
  })

  const result = {
    baseProduct,
    relatedProducts: amountFiltered,
  }

  return result
}
