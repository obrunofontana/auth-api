const mongoose = require('mongoose');
const log = require('../../../logger.js');

module.exports = (app) => {

    const State = mongoose.model("State");


    app.route('/states')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/states"');

            await State.find()
                .then((result) => {

                    const states = [];

                    result.forEach(state => {

                        let stateAux = {
                            id: state._id,
                            key: state.key,
                            sigla: state.sigla,
                            name: state.name,
                            created: state.createdAt
                        }

                        states.push(stateAux);
                        //Se necessário deletar a collection toda utilizar o fonte abaixo:
                        /*State.deleteOne({ _id: state._id })

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


                    res.status(200).json({ states });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });

        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/states"');

            const { sigla } = req.body;

            console.log(req.body);

            try {
                if (await State.findOne({ sigla: sigla })) {
                    return res.status(400).json({ error: "Ops! Registro já existe" });
                }

                const state = await State.create(req.body);

                return res.json({ state });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao cadastrar novo registro" });
            }

        });
    //Filtro por ID
    app.route('/states/:id')
        .get((req, res) => {
            //console.log(req.params)
            State.findOne({ key: req.params.id })
                .then(result => {
                    if (result) {
                        res.json({ result: {
                            id: result.key,
                            name: result.name,
                            sigla: result.sigla
                        } });
                    } else {
                        res.status(404).json('Not found');
                    }
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
        .delete((req, res) => {
            State.deleteOne({ _id: req.params.id })
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