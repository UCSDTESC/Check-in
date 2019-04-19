const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({stack: true}),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({stack: true}),
        format.splat(),
        format.simple()
      ),
      handleExceptions: true
    })
  ]
});

module.exports = logger;
