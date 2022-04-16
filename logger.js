const winston = require('winston');
const {format} = require("winston");

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format : winston.format.combine(
                winston.format.label(),
                winston.format.timestamp({format: 'YYYY-MM-DD hh:mm:ss'}),
                winston.format.colorize(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
            )}),
        new winston.transports.File({ filename: './log/error.log', level: 'error' }),
        new winston.transports.File({ filename: './log/combined.log' }),
    ],
});

module.exports = logger