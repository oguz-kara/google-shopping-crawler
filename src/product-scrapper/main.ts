import puppeteer, { Page } from 'puppeteer'
import { googleConfig } from './config'
import { scrapeGoogleProducts } from './scrapers/googleScraper'


class App {
    page: Page
    url: string

    constructor(page: Page, url: string) {
        this.page = page
        this.url = url
    }
}

const app = () => ({
  start: async () => {
    const { url } = googleConfig
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)
  },
  getProducts: async () => {
  },
})

export default app
