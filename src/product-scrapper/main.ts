import puppeteer from 'puppeteer'

const start = async () => {
  return await puppeteer.launch({ headless: true })
}

