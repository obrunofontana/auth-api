
const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
    sigla: {
        type: String,
    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("State", StateSchema);





