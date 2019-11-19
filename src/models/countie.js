const mongoose = require("mongoose");

const CountieSchema = new mongoose.Schema({
    key: {
        type: String,
    },
    name: {
        type: String,
    },
    state: {
        type: Number,
    },
    uf: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Countie", CountieSchema);






