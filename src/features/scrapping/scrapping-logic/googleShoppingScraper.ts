import { ElementHandle, Page } from 'puppeteer'
import scraper from '@features/scrapping/scrapingService'
import { googleConfig } from '../config'
import { CellValue } from 'exceljs'

const launchBrowser = async () => {
  return await scraper.launch({ headless: true, args: ['en-US,en;q=0.9'] })
}

const getProductData = async ({ page, term }: SearchOnGoogle) => {
  const { selectors } = googleConfig
  await page.type(selectors.searchInputSelector, term as string)
  await page.keyboard.press('Enter')
  await page.waitForXPath(selectors.shoppingLinkXPathExpression)
  await page.click(selectors.shoppingSelector)
  const shoppingLink = await page.$x(selectors.shoppingLinkXPathExpression)

  if (shoppingLink.length > 0) {
    await (shoppingLink[0] as ElementHandle).click()
  }

  await page.waitForNavigation({ waitUntil: 'networkidle0' })

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

export const googleShoppingScraper = async (
  products: string[] | CellValue[],
) => {
  const { url } = googleConfig
  const browser = await launchBrowser()
  const scrapedProductList = []

  try {
    for (const product of products) {
      const page = await browser.newPage()
      await page.goto(url)
      const data = await getProductData({ page, term: product })
      scrapedProductList.push({ product, data })
    }

    console.log({ productList: scrapedProductList })
    await browser.close()
  } catch (error) {
    console.error('Error scraping Google:', error)
  }
}

type SearchOnGoogle = {
  page: Page
  term: string | CellValue
}
