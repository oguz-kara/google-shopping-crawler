import { ProductWithRelateds } from '@features/product-filter/types'
import { Cell } from 'exceljs'
import * as _ from 'lodash'

interface PriceData {
  yourPurchasePrice: number | Cell
  yourPrice: number | Cell
  topCompatitorPrice: number
  baseCompatitorPrice: number
  averageCompatitorSalePrice: number
}

// Function to calculate top, base, and average prices
function calculatePrices(data: ProductWithRelateds) {
  try {
    const salePrices = data.relatedProducts.map((item) =>
      item.price
        ? parseFloat(item.price.replace(/[^0-9,]/g, '').replace(',', '.'))
        : null,
    )
    return {
      yourPurchasePrice: data.baseProduct.E,
      yourPrice: data.baseProduct.F,
      topCompatitorPrice: _.max(salePrices),
      baseCompatitorPrice: _.min(salePrices),
      averageCompatitorSalePrice: _.mean(salePrices),
    }
  } catch (err) {
    console.log('analyze parsing error... (app)')
  }
}

export function analyzeProductPrices(data: ProductWithRelateds) {
  const priceData: PriceData = calculatePrices(data) as PriceData
  const {
    yourPurchasePrice,
    topCompatitorPrice,
    baseCompatitorPrice,
    averageCompatitorSalePrice,
  } = priceData as PriceData
  const minimumProfitMargin = 0.2

  const recommendedSalePrice =
    (yourPurchasePrice as number) / (1 - minimumProfitMargin)

  return {
    recommendedSalePrice:
      recommendedSalePrice < averageCompatitorSalePrice
        ? averageCompatitorSalePrice
        : recommendedSalePrice,
    averageCompatitorSalePrice,
    topCompatitorPrice,
    baseCompatitorPrice,
  }
}

export function analyzeProductListPrices(productsData: ProductWithRelateds[]) {
  if (productsData)
    return productsData?.map((product: ProductWithRelateds) => {
      const prices = analyzeProductPrices(product)
      return {
        ...product.baseProduct,
        ...prices,
      }
    })
  return []
}
