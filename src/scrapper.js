const puppeteer = require('puppeteer')

const scrapper = async (url, cb) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto(url)
  await page.waitFor(2000)

  await cb(page)

  await browser.close()
}

module.exports = scrapper
