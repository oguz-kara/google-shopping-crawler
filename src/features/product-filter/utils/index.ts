import { distance } from 'fastest-levenshtein'

export const extractProductQuantityFromName = (productName: string) => {
  const regexPattern =
    /(\d+(?:\.\d+)?)\s*(?:litre|lt|kilogram|kg|LİTRE|l|ml|miligram)s?/i
  const match = productName.match(regexPattern)
  if (match) {
    return {
      text: match[0],
      number: match[1],
    }
  } else {
    console.log('Pattern not matched')
    return {
      text: '',
      number: 0,
    }
  }
}

export const extractProductQuantityFromNameAll = (productNames: string[]) => {
  const result = productNames.map((product) => {
    return extractProductQuantityFromName(product)
  })
  return result
}

export const isMatchingThresholdReached = (main: string, scraped: string) => {
  const threshold = 0.7,
    words = main.split(' ')
  const passedProducts = words.filter((item) =>
    scraped.toLowerCase().includes(item.toLowerCase()),
  )

  return threshold <= passedProducts.length / words.length
}

export const isAmountMatch = (product1: string, product2: string) => {
  const result1 = extractProductQuantityFromName(product1)
  const result2 = extractProductQuantityFromName(product2)

  if (result1.number === 0 || result2.number === 0) return false

  return result1.number === result2.number
}

export const isProper = (a: string, b: string) => {
  const threshold = 35
  return distance(a, b) < threshold
}
