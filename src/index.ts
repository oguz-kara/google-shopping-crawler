import products from '@fake_data'
import puppeteer from 'puppeteer'
import { CLIENT_RENEG_LIMIT } from 'tls'
;(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://google.com')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  // Type into search box

  //   products.forEach(async (item) => {
  //     await browser.newPage()
  //     await page.goto('https://google.com')
  //     await page.type('#APjFqb', item)
  //     await new Promise(r => setTimeout(r, 4000));
  //   })
  const shoppingSelector = 'div.hdtb-mitem:nth-child(2) > a:nth-child(1)'
  const productNameSelector = '.tAxDx'
  const productPriceSelector = '.a8Pemb.OFFNJ'

  await page.type('#APjFqb', 'castrol 10 40')
  await page.keyboard.press('Enter')
  await page.waitForSelector(shoppingSelector)
  await page.click(shoppingSelector)
  await page.waitForSelector(productNameSelector)
  const productNameEls = await page.$$(productNameSelector)
  await page.waitForSelector(productPriceSelector)
  const productPriceEls = await page.$$(productPriceSelector)

  productNameEls.forEach(async (element, index) => {
    const name = await page.evaluate((el) => el.textContent, element)
    const price = await page.evaluate(
      (el) => el.textContent,
      productPriceEls[index],
    )
    console.log({ name, price })
  })

  console.log(products)
})()
