const winston = require('winston');
const moment = require('moment');

const { combine, printf } = winston.format;

//#2
const customFormat = printf(info => {
    return moment(info.timestamp).format("YYYY-MM-DD HH:mm:ss") + ' [' + info.level.toUpperCase() + ']: ' + info.message;
});


module.exports = {

   logger: winston.createLogger({
        levels: winston.config.npm.levels,
        //#2
        format: combine(
            customFormat
        ),

        //#1
        transports: [
            //#1
            new winston.transports.Console(),

            //#3
            new winston.transports.File({ filename: 'console.log', level: 'info' })
        ]
    })
    
}