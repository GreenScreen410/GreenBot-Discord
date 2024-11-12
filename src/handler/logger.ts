import winston from 'winston'
import WinstonDaily from 'winston-daily-rotate-file'
import process from 'process'

const { combine, timestamp, label, printf } = winston.format

const logDir = `${process.cwd()}/logs`

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: '그린Bot' }),
    logFormat
  ),

  transports: [
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: 30,
      zippedArchive: true
    }),

    new WinstonDaily({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/warn',
      filename: '%DATE%.warn.log',
      maxFiles: 30,
      zippedArchive: true
    }),

    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: '%DATE%.error.log',
      maxFiles: 30,
      zippedArchive: true
    })
  ],

  exceptionHandlers: [
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.exception.log',
      maxFiles: 30,
      zippedArchive: true
    })
  ],

  rejectionHandlers: [
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.rejection.log',
      maxFiles: 30,
      zippedArchive: true
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  )
}

export default logger
