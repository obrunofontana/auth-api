const nodemailer = require('nodemailer');
const path = require('path');
const { host, port, user, pass } = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});


transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail'), //Caminho onde meus templates de email ficaram salvos
    extName: '.html', //Extensão que irei utilizar
}))

module.exports = transport;