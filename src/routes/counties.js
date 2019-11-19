const mongoose = require('mongoose');
const log = require('../../logger.js');

module.exports = (app) => {

    const Countie = mongoose.model("Countie");

    app.route('/counties')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/counties"');

            await Countie.find()
                .then((result) => {

                    const counties = [];

                    result.forEach(countie => {

                        let countieAux = {
                            id: countie._id,
                            key: countie.key,
                            name: countie.name,
                            fipeName: countie.fipeName,
                            created: countie.createdAt
                        }

                        counties.push(countieAux);
                    })


                    res.status(200).json({ counties });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });

        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/brands"');

            const { key } = req.body;

            //console.log(req.body);

            try {
                if (await Countie.findOne({ key: key })) {
                    return res.status(400).json({ error: "Ops! Registro já existe" });
                }

                const brand = await Countie.create(req.body);

                return res.json({ brand });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao cadastrar novo registro" });
            }

        });
    //Filtro por ID
    app.route('/counties/:id')
        .get((req, res) => {
            //console.log(req.params)
            Countie.findById({ _id: req.params.id })
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
            Countie.deleteOne({ _id: req.params.id })
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

    //Encontra todos os municipios pelo id do estado
    app.route('/counties/state/:state')
        .get((req, res) => {
            //console.log(req.params)
            Countie.find({ state: req.params.state })
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
};