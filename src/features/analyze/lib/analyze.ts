import { ProductWithRelateds } from '@features/product-filter/types'

// Sample data structure
const products = [
  { id: 1, name: 'Product A', purchasePrice: 50, salePrice: 80 },
  { id: 2, name: 'Product B', purchasePrice: 60, salePrice: 90 },
  // Add more products
]

const scrapedData = [
  { productName: 'Product A', sellerName: 'Seller X', salePrice: 75 },
  { productName: 'Product A', sellerName: 'Seller Y', salePrice: 70 },
  { productName: 'Product B', sellerName: 'Seller Z', salePrice: 85 },
  // Add more scraped data
]

// Function to calculate top, base, and average prices
function calculatePrices(data: ProductWithRelateds) {
  try {
    const salePrices = data.relatedProducts.map((item) =>
      parseInt(item.price as string, 10),
    )
    return {
      topPrice: Math.max(...salePrices),
      basePrice: Math.min(...salePrices),
      averagePrice:
        salePrices.reduce((sum, price) => sum + price, 0) / salePrices.length,
    }
  } catch (err) {
    console.log('analyze parsing error... (app)')
  }
}

// Function to update product prices based on strategy (e.g., setting to average price)
function updatePrices(product, averagePrice) {
  // Implement your pricing strategy here
  product.salePrice = averagePrice
}

// Calculate and update prices for each product
products.forEach((product) => {
  const { averagePrice } = calculatePrices(product, scrapedData)
  updatePrices(product, averagePrice)
})

console.log(products)
