const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./src/config/enviroments");
const cors = require("cors");
const consign = require('consign');

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
//require("./src/models/user");
//require("./src/models/brand");


app.use(bodyParser.json());

//Permite requeisições Cross-Origin Request
app.use(cors());

consign()
  .include('src/models/')
  .then('src/middlewares/')
  .then('src/routes/')
  .into(app);

// Inicia as rotas da API
//app.use("/api", require("./src/routes/users"));
//app.use("/api", require("./src/routes/brands"));

//


app.listen(port, () => {
  console.info('Servidor Express API: Rodando em http://localhost:' + port);
});

