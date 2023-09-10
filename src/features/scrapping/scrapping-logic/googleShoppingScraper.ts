import { ProductData } from '../types'
import { ElementHandle, Page } from 'puppeteer'
import scraper from '@features/scrapping/scrapingService'
import { googleConfig } from '../config'
import { RowData, ScrapedProduct } from '@features/excel/types'
// ! change this path later because modules can't use imports of each others.
import { Product } from '@features/excel/types'

const isClickableElement = async (elementHandle: ElementHandle) => {
  if (!elementHandle) {
    return false // If the element handle is null or undefined, it's not a valid element.
  }

  const isClickable = await elementHandle.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    // Check if the element has a non-zero width and height, indicating it is visible.
    return rect.width > 0 && rect.height > 0
  }, elementHandle)

  return isClickable
}

const launchPuppeteerBrowser = async () => {
  return await scraper.launch({
    headless: false,
    args: ['--blink-settings=imagesEnabled=false'],
  })
}

const scrapeAdsProducts = async (page: Page) => {
  const { selectors } = googleConfig
  const productElements = await page.$$(selectors.adsProductCard)

  const products: ScrapedProduct[] = []

  for (const element of productElements) {
    const name = await element.$eval(
      selectors.adsProductName,
      (el) => el.textContent,
    )
    const price = await element.$eval(
      selectors.adsProductPrice,
      (el) => el.textContent,
    )
    const provider = await element.$eval(
      selectors.adsProductProvider,
      (el) => el.textContent,
    )
    const link = await element.$eval(selectors.adsProductLink, (el) =>
      el.getAttribute('href'),
    )
    const image = await element.$eval(selectors.adsProductsImage, (el) =>
      el.getAttribute('src'),
    )

    products.push({
      name,
      price,
      provider,
      link,
      image,
    })
  }
  return products
}

const scrapeRelatedProducts = async (page: Page) => {
  const { selectors } = googleConfig

  try {
    await page.waitForXPath(selectors.relatedProductsLinkXPathExpression, {
      timeout: 3500,
    })
    const relatedProductsLinks = await page.$x(
      selectors.relatedProductsLinkXPathExpression,
    )

    if (relatedProductsLinks.length > 0) {
      const handle = relatedProductsLinks[0] as ElementHandle
      const isClickable = await isClickableElement(handle)
      if (isClickable) {
        await handle.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        const productElements = await page.$$(selectors.relatedProductCard)
        const products: ScrapedProduct[] = []

        await page.waitForSelector(selectors.relatedProductName)
        const name = await page.$eval(
          selectors.relatedProductName,
          (el) => el.textContent,
        )
        await page.waitForSelector(selectors.relatedProductImage)
        const image = await page.$eval(selectors.relatedProductImage, (el) =>
          el.getAttribute('src'),
        )

        for (const element of productElements) {
          const price = await element.$eval(
            selectors.relatedProductPrice,
            (el) => el.textContent,
          )
          const provider = await element.$eval(
            selectors.relatedProductProvider,
            (el) => el.textContent,
          )
          const link = await element.$eval(selectors.relatedProductLink, (el) =>
            el.getAttribute('href'),
          )

          products.push({ price, provider, link, image, name })
        }

        return products
      }
      return []
    }
  } catch (err) {
    console.error('Error during scraping related products:', err)
  }
}

const scrapeRegularProducts = async (page: Page) => {
  const { selectors } = googleConfig

  // Use page.$$ instead of page.$$eval to await the promises
  const productElements = await page.$$(selectors.regularProductCard)

  const products = []

  for (const element of productElements) {
    const name = await element.$eval(
      selectors.regularProductName,
      (el) => el.textContent,
    )
    const price = await element.$eval(
      selectors.regularProductPrice,
      (el) => el.textContent,
    )
    const provider = await element.$eval(
      selectors.regularProductProvider,
      (el) => el.textContent,
    )
    const link = await element.$eval(
      selectors.regularProductLink,
      (el) => el.textContent,
    )
    const image = await element.$eval(
      selectors.regularProductsImage,
      (el) => el.textContent,
    )
    const result = { name, price, provider, link, image }
    products.push(result)
  }

  return products
}

export const scrapeGoogleShoppingProducts = async (
  products: Product[] | RowData[],
) => {
  const { url, selectors } = googleConfig
  const browser = await launchPuppeteerBrowser()
  const result: ProductData[] = []

  try {
    for (const product of products) {
      const page = await browser.newPage()
      await page.goto(url)
      await page.type(selectors.searchInput, product.B as string)
      await page.keyboard.press('Enter')
      await page.waitForXPath(selectors.shoppingLinkXPathExpression)
      await page.click(selectors.shopping)
      const shoppingLink = await page.$x(selectors.shoppingLinkXPathExpression)
      if (shoppingLink.length > 0) {
        await (shoppingLink[0] as ElementHandle).click()
      }
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      const scrapedRegularProductData = await scrapeRegularProducts(page)
      console.log({ ln: scrapedRegularProductData.length })
      if (scrapedRegularProductData.length === 0) {
        page.close()
        continue
      }
      const scrapedAdsProductData = await scrapeAdsProducts(page)
      const scrapedRelatedProductsData = await scrapeRelatedProducts(page)

      const data: ProductData = {
        baseProduct: product,
        ads: scrapedAdsProductData,
        regular: scrapedRegularProductData as ScrapedProduct[],
        related: scrapedRelatedProductsData as ScrapedProduct[],
      }

      result.push(data)
      await page.close()
    }

    await browser.close()
    return result
  } catch (error) {
    console.error('Error scraping Google:', error)
  }
}
