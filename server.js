const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./src/config/enviroments");
const cors = require("cors");

const port = 3000;

// Conecta no MongoDB
mongoose.connect(config.db,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

// Carrega o model de Usuário
require("./src/models/user");


app.use(bodyParser.json());

//Permite requeisições Cross-Origin Request
app.use(cors());

// Inicia as rotas da API
app.use("/api", require("./src/routes/users"));


app.listen(port, () => {
  console.info('Servidor Express API: Rodando em http://localhost:' + port);
});

