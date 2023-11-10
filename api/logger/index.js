const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    transports: [
        new transports.File({
            level: 'warn',
            filename: 'logsWarnings.log'
        }),
        new transports.File({
            level: 'error',
            filename: 'logsErrors.log'
        })
    ],
    format:  format.combine(
        format.timestamp(),
        format.json()
    )
})

module.exports = logger