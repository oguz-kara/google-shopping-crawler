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

export const levenshteinSimilarity = (str1: string, str2: string) => {
  // Calculate the Levenshtein distance using the library
  const dis = distance(str1.toLowerCase(), str2.toLowerCase())

  // Convert the distance to a similarity score between 0 and 1
  const maxLength = Math.max(str1.length, str2.length)
  const similarityScore = 1 - dis / maxLength

  return similarityScore
}

const filterAlphanumericStrings = (inputList: string[]) => {
  return inputList.filter(
    (str) => /^[a-zA-Z0-9]+$/.test(str) || !/^[^\w\s]+$/.test(str),
  )
}

export const checkSimilarityWithWords = (input: string, scraped: string) => {
  // split strings to words
  const inputWordList = filterAlphanumericStrings(input.split(' ')),
    scrapedWordList = filterAlphanumericStrings(scraped.split(' ')),
    initialValue = 0
  const totalMatchWords = inputWordList.reduce((counter, currentInputWord) => {
    const foundedWord = scrapedWordList.find((scrapedWord) => {
      if (!Number.isNaN(scrapedWord) && !Number.isNaN(currentInputWord))
        return scrapedWord === currentInputWord
      return levenshteinSimilarity(currentInputWord, scrapedWord) >= 0.7
    })
    if (!foundedWord) {
      return counter
    }
    return counter + 1
  }, initialValue)
  return totalMatchWords / inputWordList.length
}
