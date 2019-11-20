const puppeteer = require('puppeteer')

const scrapper = async (url, cb) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true })
  const page = await browser.newPage()

  await page.goto(url)
  await page.waitFor(2000)

  await cb(page)

  await browser.close()
}

module.exports = scrapper
