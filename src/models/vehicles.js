
const mongoose = require("mongoose");

const VehiclesSchema = new mongoose.Schema({
    key: {
        type: String,
        allowNull: false
    },
    name: {
        type: String,
        allowNull: false
    },
    fipeName: {
        type: String,
        allowNull: false
    },
    brand: {
        type: Number,
        allowNull: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Vehicle", VehiclesSchema);





