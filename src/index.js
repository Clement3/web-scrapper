require('dotenv').config()

const cron = require('node-cron')
const logger = require('./logger')
const scrapper = require('./scrapper')
const notify = require('./notify')

const PRODUCT_URL = process.env.PRODUCT_URL

logger.info('The logger was successfully started.')

// Set scheduled to false on development to start directly the cron fn
const taskOptions = {
  scheduled: !process.env.NODE_ENV !== 'production'
}

// Scrap every 1 hours
const task = cron.schedule('0 0 1 * * *', async () => {
  try {
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
  } catch (err) {
    logger.error(new Error(err))
  }
}, taskOptions)

if (process.env.NODE_ENV !== 'production') {
  task.start()
}
