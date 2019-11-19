const mongoose = require('mongoose');
const log = require('../../logger.js');


module.exports = (app) => {

    const Model = mongoose.model("Model");

    app.route('/models')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/models"');

            await Model.find()
                .then((result) => {

                    const models = [];

                    result.forEach(model => {

                        let modelAux = {
                            id: model._id,
                            key: model.key,
                            name: model.name,
                            fipeCodigo: model.fipeCodigo,
                            veiculo: model.veiculo,
                            fipeMarca: model.fipeMarca,
                            marcaId: model.marcaId,
                            veiculoId: model.veiculoId,
                            createdAt: model.createdAt
                        }

                        models.push(modelAux);
                        //Se necessário deletar a collection toda utilizar o fonte abaixo:
                        /* Model.deleteOne({ _id: model._id })

                            .then(result => {
                                if (result) {
                                    res.json(result);
                                } else {
                                    res.status(404).json('Not found');
                                }
                            })
                            .catch(error => {
                                res.status(500).json(error);
                            });*/
                    });


                    res.status(200).json({ models });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });

        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/models"');

            const { key } = req.body;

            //console.log(req.body);

            try {
                if (await Model.findOne({ key: key })) {
                    return res.status(400).json({ error: "Ops! Registro já existe" });
                }

                const model = await Model.create(req.body);

                return res.json({ model });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao cadastrar novo registro" });
            }

        });
    //Filtro por ID
    app.route('/models/:id')
        .get((req, res) => {
            //console.log(req.params)
            Model.findById({ _id: req.params.id })
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
            Model.deleteOne({ _id: req.params.id })
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

    //Encontra todos os modeloes pela marca e id do veiculo
    app.route('/models/vehicles/:veiculoId')
        .get((req, res) => {
            //console.log(req.params)
            Model.find({ veiculoId: req.params.veiculoId })
                .then(result => {
                    // console.log(result);
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