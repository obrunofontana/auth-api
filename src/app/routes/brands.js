const mongoose = require('mongoose');
const log = require('../../../logger.js');

module.exports = (app) => {

    const Brand = mongoose.model("Brand");

    app.route('/brands')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/brands"');

            await Brand.find()
                .then((result) => {

                    const brands = [];

                    result.forEach(brand => {

                        let brandAux = {
                            id: brand._id,
                            key: brand.key,
                            name: brand.name,
                            fipeName: brand.fipeName,
                            created: brand.createdAt
                        }

                        brands.push(brandAux);

                        //Se necessário deletar a collection toda utilizar o fonte abaixo:
                        /* Brand.deleteOne({ _id: brand.id })
                             .then(result => {
                                 if (result) {
                                     res.json(result);
                                 } else {
                                     res.status(404).json('Not found');
                                 }
                             })
                             .catch(error => {
                                 res.status(500).json(error);
                             })*/
                    });

                    res.status(200).json({ brands });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });



        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/brands"');

            const { key } = req.body;

            console.log(req.body);

            try {
                if (await Brand.findOne({ key: key })) {
                    return res.status(400).json({ error: "Ops! Registro já existe" });
                }

                const brand = await Brand.create(req.body);

                return res.json({ brand });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao cadastrar novo registro" });
            }

        });
    //Filtro por ID
    app.route('/brands/:id')
        .get((req, res) => {
            //console.log(req.params)
            Brand.findById({ _id: req.params.id })
                .then(result => {
                    if (result) {
                        res.json({ result });
                    } else {
                        res.status(404).json('Not found');
                    }
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
        .delete((req, res) => {
            Brand.deleteOne({ _id: req.params.id })
                .then(result => {
                    if (result) {
                        res.json(result);
                    } else {
                        res.status(404).json('Not found');
                    }
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
};