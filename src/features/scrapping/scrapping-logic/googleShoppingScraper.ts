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
  const products = await page.$$eval(
    selectors.productCardSelector,
    (elements) => {
      return elements.map((element) => {
        const name = element.querySelector('.tAxDx')?.textContent
        const price = element.querySelector('.a8Pemb.OFFNJ')?.textContent
        console.log({ name, price })
        return { name, price }
      })
    },
  )

  return products
}

export const googleShoppingScraper = async () => {
  const { url } = googleConfig
  const browser = await scraper.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)
  try {
    const data = await getProductData({ page, term: 'castrol 10 40 1lt' })
    console.log({ data })
  } catch (error) {
    console.error('Error scraping Google:', error)
  }
}

type SearchOnGoogle = {
  page: Page
  term: string
}
