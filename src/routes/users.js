const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");
const log = require('../../logger.js');


const User = mongoose.model("User");


router.get("/users", async (req, res) => {

    log.logger.info('Iniciando a chamanda (GET) pelo recurso "/api/users"');


    await User.find()
        .then((result) => {

            const users = [];

            result.forEach(user => {

                let userAux = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }

                users.push(userAux);
            })


            res.status(200).json({ users });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

router.post("/users", async (req, res) => {
    log.logger.info('Iniciando a chamanda (POST) pelo recurso "/api/users"');

    const { email, username } = req.body.user;

    console.log(req.body.user);

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

router.post("/authenticate", async (req, res) => {
    log.logger.info('Iniciando a chamanda (POST) pelo recurso "/api/authenticate"');
    try {
        const { email, password } = req.body;

        console.log(email, password);

        const user = await User.findOne({ email });

        //console.log(user);

        if (!user) {
            return res.status(400).json({ error: "Ops! Usuário não encontrado" });
        }

        if (!(await user.compareHash(password))) {
            return res.status(400).json({ error: "Senha inválida." });
        }


        return res.json({
            user: {
                id: user._id,
                email: user.email
            },
            token: user.generateToken()
        });
    } catch (err) {
        return res.status(400).json({ error: "Falha na autenticação do usuário." });
    }
});

router.use(authMiddleware);

//Esta rota será utilizada somente por usuários autenticados
router.get("/users/me", async (req, res) => {
    log.logger.info('Iniciando a chamanda (GET) pelo recurso "/api/me"');
    try {

        const { userId } = req;

        const userAux = await User.findById(userId);

        const user = {
            id: userAux._id,
            firstName: userAux.firstName,
            lastName: userAux.firstName,
            email: userAux.email,
        }

        //console.log(user);

        return res.json({ user });
    } catch (err) {
        return res.status(400).json({ error: "Não é possível obter informações do usuário" });
    }
});

module.exports = router;
