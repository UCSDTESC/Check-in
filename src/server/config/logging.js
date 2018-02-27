const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'combined.log'}),
    new transports.Console({
      format: format.combine(
        format.splat(),
        format.simple()
      )
    })
  ]
});

module.exports = logger;
