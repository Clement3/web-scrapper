const { WebClient } = require('@slack/web-api')

const API_KEY = process.env.SLACK_TOKEN
const SLACK_CHANNEL = process.env.SLACK_CHANNEL

const webClient = new WebClient(API_KEY)

const notify = async (message) => {
    await notifySlack(message)
}

const notifySlack = async (message) => {
    try {
        await webClient.chat.postMessage({ channel: SLACK_CHANNEL, text: message })
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = notify
