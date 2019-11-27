const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const log = require('../../../logger.js');

module.exports = async (req, res, next) => {

    //console.log('Toke do body -> ' + req.headers.authorization)
    //console.log('rota: ', req.path)

    //Só necessário token nas rotas que forem colocadas no if, demais rotas, não são necessárias
    if (req.path == '/me') {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ error: "No token provided" });
        }

        const [scheme, token] = authHeader.split(" ");

        try {
            const decoded = await promisify(jwt.verify)(token, "secret");

            req.userId = decoded.id;

            return next();
        } catch (err) {
            return res.status(401).send({ error: "Token invalid" });
        }

    }
    return next();

};
