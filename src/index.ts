import app from '@product-scrapper/main';

const scrapper = app()
scrapper.start()

import puppeteer from 'puppeteer'
;(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })
})()

