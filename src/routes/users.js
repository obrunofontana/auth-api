const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");
const log = require('../../logger.js');


const User = mongoose.model("User");


router.get("/users", async (req, res) => {

    log.logger.info('Iniciando a chamanda (GET) pelo recurso "/api/users"');


    await User.find()
        .then((result) => {
            res.status(200).json({ users: result });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

router.post("/register", async (req, res) => {
    log.logger.info('Iniciando a chamanda (POST) pelo recurso "/api/register"');
    const { email, username } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "Ops! Usuário já existe!" });
        }

        const user = await User.create(req.body);

        return res.json({ user });
    } catch (err) {
        return res.status(400).json({ error: "Ops! Falha ao registrar usuário." });
    }
});

router.post("/authenticate", async (req, res) => {
    log.logger.info('Iniciando a chamanda (POST) pelo recurso "/api/authenticate"');
    try {
        const { email, password } = req.body;

        //console.log(email, password);

        const user = await User.findOne({ email });

        //console.log(user);

        if (!user) {
            return res.status(400).json({ error: "Ops! Usuário não encontrado" });
        }

        if (!(await user.compareHash(password))) {
            return res.status(400).json({ error: "Senha inválida." });
        }

        return res.json({
            user,
            token: user.generateToken()
        });
    } catch (err) {
        return res.status(400).json({ error: "Falha na autenticação do usuário." });
    }
});

router.use(authMiddleware);

//Esta rota será utilizada somente por usuários autenticados
router.get("/me", async (req, res) => {
    log.logger.info('Iniciando a chamanda (GET) pelo recurso "/api/me"');
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        return res.json({ user });
    } catch (err) {
        return res.status(400).json({ error: "Não é possível obter informações do usuário" });
    }
});

module.exports = router;
