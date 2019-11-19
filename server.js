const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./src/config/enviroments');
const cors = require('cors');
const consign = require('consign')
const authMiddleware = require('./src/middlewares/auth');
const router = express.Router();

const port = 3000;

//Declarar a aplicação
const app = express();

// Conecta no MongoDB
mongoose.connect(config.db,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

app.use(router.use(authMiddleware));

app.use(bodyParser.json());

//Permite requeisições Cross-Origin Request
app.use(cors());

consign()
  .include('src/middlewares/')
  .then('src/models/')
  .then('src/routes/')
  .into(app);


app.listen(port, () => {
  console.info('Servidor Express API: Rodando em http://localhost:' + port);
});

