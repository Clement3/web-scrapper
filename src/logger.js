const { createLogger, format, Transport, transports } = require('winston')
const notify = require('./notify')

class SlackTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    const formatError = `💥 *${info.message}* at ${info.timestamp} 💥`

    try {
      await notify(formatError)
    } catch{}

    callback()
  }
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new SlackTransport({
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger
