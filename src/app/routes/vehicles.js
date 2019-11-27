const mongoose = require('mongoose');
const log = require('../../../logger.js');


module.exports = (app) => {

    const Vehicle = mongoose.model("Vehicle");

    app.route('/vehicles')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/vehicles"');

            await Vehicle.find()
                .then((result) => {

                    const vehicles = [];

                    result.forEach(vehicle => {

                        let vehicleAux = {
                            id: vehicle._id,
                            key: vehicle.key,
                            name: vehicle.name,
                            fipeName: vehicle.fipeName,
                            brand: vehicle.brand,
                            createdAt: vehicle.createdAt
                        };

                        vehicles.push(vehicleAux);

                        //Se necessário deletar a collection toda utilizar o fonte abaixo:
                        /*Vehicle.deleteOne({ _id: vehicle.id })
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


                    res.status(200).json({ vehicles });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });

        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/vehicles"');

            const { key } = req.body;

          //  console.log(req.body);

            try {
                if (await Vehicle.findOne({ key: key })) {
                    return res.status(400).json({ error: "Ops! Registro já existe" });
                }

                const model = await Vehicle.create(req.body);

                return res.json({ model });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao cadastrar novo registro" });
            }

        });
    //Filtro por ID
    app.route('/models/:id')
        .get((req, res) => {
            //console.log(req.params)
            Vehicle.findById({ _id: req.params.id })
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
            Vehicle.deleteOne({ _id: req.params.id })
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

    //Encontra todos os veiculos pela marca
    app.route('/vehicles/brands/:brand')
        .get((req, res) => {
            //console.log(req.params)
            Vehicle.find({ brand: req.params.brand })
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