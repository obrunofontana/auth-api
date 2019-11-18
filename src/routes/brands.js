const router = require("express").Router();
const mongoose = require("mongoose");
const log = require('../../logger.js');

const Brand = mongoose.model("Brand");

router.get("/brands", async (req, res) => {

    log.logger.info('Iniciando a chamanda (GET) pelo recurso "/api/users"');


    await Brand.find()
        .then((result) => {

            const brands = [];

            result.forEach(user => {

                let brandAux = {
                    id: user._id,
                    key: user.key,
                    name: user.name,
                    fipeName: user.fipeName
                }

                brands.push(brandAux);
            })

            res.status(200).json({ brands });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});
