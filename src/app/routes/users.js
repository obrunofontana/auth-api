const mongoose = require('mongoose');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const log = require('../../../logger.js');
const authMail = require('../../config/mail.json');


module.exports = (app) => {

    const User = mongoose.model("User");

    app.route('/users')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamada (GET) pelo recurso "/users"');

            await User.find()
                .then((result) => {

                    const users = [];

                    result.forEach(user => {

                        let userAux = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            photo: user.photo,
                            zipCode: user.zipCode,
                            state: user.state,
                            city: user.city,
                            address: user.address,
                            destinationAddress: user.destinationAddress,
                            vehicles: user.vehicles,
                            created: user.createdAt,
                            passwordResetToken: user.passwordResetToken
                        };

                        users.push(userAux);
                        //Se necessário deletar a collection toda utilizar o fonte abaixo:
                        /*User.deleteOne({ _id: user._id })

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
                    })


                    res.status(200).json({ users });
                })
                .catch((error) => {
                    res.status(500).json(error);
                });

        })
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/users"');

            const { email, username } = req.body.user;

            //console.log(req.body.user);

            try {
                if (await User.findOne({ email })) {
                    return res.status(400).json({ error: "Ops! Usuário já existe!" });
                }

                const user = await User.create(req.body.user);

                return res.json({ user });
            } catch (err) {
                return res.status(400).json({ error: "Ops! Falha ao registrar usuário." });
            }

        });
    //Filtro por ID
    app.route('/users/:id')
        .get((req, res) => {
            //console.log(req.params)
            User.findById({ _id: req.params.id })
                .then(result => {

                    let userAux = {
                        id: result._id,
                        name: result.name,
                        email: result.email,
                        password: result.password,
                        photo: result.photo,
                        zipCode: result.zipCode,
                        state: result.state,
                        city: result.city,
                        address: result.address,
                        destinationAddress: result.destinationAddress,
                        vehicles: result.vehicles,
                        created: result.createdAt
                    }
                    result = userAux;


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
            User.deleteOne({ _id: req.params.id })
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
        .patch((req, res) => {
            console.log(req.body);
            User.updateOne({ _id: req.params.id }, {
                $set: {
                    zipCode: req.body.zipCode,
                    state: req.body.state,
                    city: req.body.city,
                    address: req.body.address,
                    destinationAddress: req.body.destinationAddress,
                    vehicles: req.body.vehicles
                }
            }, { new: true })
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
        });

    //Retorno o usuário de acordo com o email
    app.route('/users/email/:email')
        .get((req, res) => {
            console.log(req.params)
            User.findOne({ email: req.params.email })
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
        });

    //Rotas de autenticação

    app.route('/authenticate')
        .post(async (req, res) => {

            log.logger.info('Iniciando a chamanda (POST) pelo recurso "/authenticate"');
            try {
                const { email, password } = req.body;

                console.log(email, password);

                const user = await User.findOne({ email });

                console.log(user);

                if (!user) {
                    return res.status(400).json({ error: "Ops! Usuário não encontrado" });
                }

                if (!(await user.compareHash(password))) {
                    return res.status(400).json({ error: "Senha inválida." });
                }


                return res.json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo: user.photo,
                        zipCode: user.zipCode,
                        state: user.state,
                        city: user.city,
                        address: user.address,
                        destinationAddress: user.destinationAddress,
                        vehicles: user.vehicles,
                        created: user.createdAt
                    },
                    token: user.generateToken()
                });
            } catch (err) {
                return res.status(400).json({ error: "Falha na autenticação do usuário." });
            }

        });

    app.route('/me')
        .get(async (req, res) => {

            log.logger.info('Iniciando a chamanda (GET) pelo recurso "/me"');
            try {

                const { userId } = req;

                const userAux = await User.findById(userId);

                const user = {
                    id: userAux._id,
                    name: userAux.name,
                    email: userAux.email,
                    photo: userAux.photo,
                    zipCode: userAux.zipCode,
                    state: userAux.state,
                    city: userAux.city,
                    address: userAux.address,
                    destinationAddress: userAux.destinationAddress,
                    vehicles: userAux.vehicles,
                    created: userAux.createdAt
                }

                //console.log(user);

                return res.json({ user });
            } catch (err) {
                return res.status(400).json({ error: "Não é possível obter informações do usuário" });
            }

        });

    //Recuperação de senha

    app.route('/forgot_password')
        .post(async (req, res) => {

            const { email } = req.body
            try {
                const user = await User.findOne({ email })

                if (!user) {
                    return res.status(400).json({ error: 'User not found' })
                }

                const token = crypto.randomBytes(20).toString('hex')
                const now = new Date()
                now.setHours(now.getHours() + 1)

                await User.findByIdAndUpdate(user.id, {
                    $set: {
                        passwordResetToken: token,
                        passwordResetExpires: now
                    }
                })


                let mailOptions = {
                    from: 'noreply.rodizcar@gmail.com',
                    to: email,
                    template: 'forgot_password',
                    subject: 'Redefinição de senha, Rodizcar',
                    context: { token },
                }

                mailer.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log('Message %s sent: %s', info);
                        return res.status(400).json({ error: err })
                    }
                    return res.status(200).send({ info: info });
                });


            } catch (error) {
                console.log(error)
                return res.status(400).json(error)
            }



        });
    app.route('/reset_password')
        .post(async (req, res) => {

            const { email, token, password } = req.body
            try {
                const user = await User.findOne({ email })
                    .select('+passwordResetToken +passwordResetExpires')

                if (!user) {
                    return res.status(400).json({ error: 'User not found' })
                }

                if (token !== user.passwordResetToken) {
                    return res.status(400).json({ error: 'Token invalid' })
                }

                const now = new Date()

                if (now > user.passwordResetExpires) {
                    return res.status(400).json({ error: 'Token expired, generate a new one' })
                }

                user.password = password
                await user.save()

                return res.status(200).send({ result: 'Info: Senha alterado com sucesso!' });

            } catch (error) {
                res.status(400).json(error)
            }
        });

};