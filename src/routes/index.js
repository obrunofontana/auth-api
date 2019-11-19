const log = require('../../logger.js');

module.exports = (app) => {

    app.get('/', (req, res) => {

        log.logger.info('CRUD Express API Rodizcar funcionando');

        res.json({ "status": "CRUD Express API Rodizcar funcionando!" });

    });

};