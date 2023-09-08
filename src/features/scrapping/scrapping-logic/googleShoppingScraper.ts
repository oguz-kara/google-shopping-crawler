import { Page } from 'puppeteer'
import scraper from '@features/scrapping/scrapingService'
import { googleConfig } from '../config'

const getProductData = async ({ page, term }: SearchOnGoogle) => {
  const { selectors } = googleConfig
  await page.type(selectors.searchInputSelector, term)
  await page.keyboard.press('Enter')
  await page.waitForSelector(selectors.shoppingSelector)
  await page.click(selectors.shoppingSelector)

  await page.waitForSelector(selectors.productCardSelector)

  // Use page.$$ instead of page.$$eval to await the promises
  const productElements = await page.$$(selectors.productCardSelector)

  const products = []

  for (const element of productElements) {
    const name = await element.$eval(
      selectors.productNameSelector,
      (el) => el.textContent,
    )
    const price = await element.$eval(
      selectors.productPriceSelector,
      (el) => el.textContent,
    )
    console.log({ name, price })
    products.push({ name, price })
  }

  await page.close()

  return products
}

export const googleShoppingScraper = async () => {
  const products = ['castrol 3 40', 'motul 3 40', 'motul 10 40']
  const { url } = googleConfig
  const browser = await scraper.launch({ headless: false })
  const productList = []
  try {
    for (const product of products) {
      const page = await browser.newPage()
      await page.goto(url)
      const data = await getProductData({ page, term: product })
      productList.push({ product, data })
    }

    console.log({ productList })
    await browser.close()
  } catch (error) {
    console.error('Error scraping Google:', error)
  }
}

type SearchOnGoogle = {
  page: Page
  term: string
}
