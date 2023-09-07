import { Page } from 'puppeteer'
import { googleConfig } from '@product-scrapper/config'
import IProduct from '@interfaces/IProduct'

export async function scrapeGoogleProducts(page: Page, product: IProduct) {
  try {
    const { url, selectors } = googleConfig

    await page.goto(url)
    await page.type(selectors.searchInputSelector, product.name)
    await page.keyboard.press('Enter')
    await page.waitForSelector(selectors.shoppingSelector)
    await page.click(selectors.shoppingSelector)
    await page.waitForSelector(selectors.productNameSelector)
    await page.waitForSelector(selectors.productPriceSelector)
    const productNameEls = await page.$$(selectors.productNameSelector)
    const productPriceEls = await page.$$(selectors.productPriceSelector)

    const result = productNameEls.map(async (element, index) => {
      const name = await page.evaluate((el) => el.textContent, element)
      const price = await page.evaluate(
        (el) => el.textContent,
        productPriceEls[index],
      )

      return { name, price }
    })
    return result
  } catch (error) {
    console.error('Error scraping Google:', error)
  }
}
