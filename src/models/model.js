
const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
    key: {
        type: String,
    },
    name: {
        type: String,
    },
    fipeCodigo: {
        type: String,
    },
    veiculo: {
        type: String,
    },
    fipeMarca: {
        type: String,

    },
    marcaId: {
        type: Number,

    },
    veiculoId: {
        type: Number,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Model", ModelSchema);




