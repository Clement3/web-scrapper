require('dotenv').config()

const cron = require('node-cron')
const scrapper = require('./scrapper')
const notify = require('./notify')

const PRODUCT_URL = process.env.PRODUCT_URL

// Scrap every 1 hours
cron.schedule('* * 1 * * *', async () => {
  await scrapper(PRODUCT_URL, async (page) => {

    // Custom Template for this scrap
    await page.click('button.a-inputs-fakeselect')
    await page.waitFor(1000)

    await page.evaluate(() => {
      let buttons = document.querySelectorAll('[data-test=grades-modal-grade]')

      let selectedButtonLength = buttons.length - 1

      buttons[selectedButtonLength].click()
    })

    // Get Data
    const result = await page.evaluate(() => {
      let price = document.querySelector('.price').innerText
      let title = document.querySelector('h1').innerText
      return { title, price }
    })

    const hasGoodPrice = parseInt(result.price, 10) < 650 ? '`<!channel> 🔥' : ''

    await notify(`${hasGoodPrice} *${result.price}* is the last Price for the *${result.title}* on ${PRODUCT_URL}`)
  })
})
