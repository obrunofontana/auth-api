const nodemailer = require('nodemailer');
const path = require('path');
const { user, pass, service } = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    service,
    auth: {
        user,
        pass
    }
});

const options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: path.resolve('./src/resources/mail/views/email/'),
        defaultLayout: 'template',
        partialsDir: path.resolve('./src/resources/mail/views/partials/')
    },
    viewPath: path.resolve('./src/resources/mail/views/email/'),
    extName: '.hbs'
}

transport.use('compile', hbs(options));

module.exports = transport;