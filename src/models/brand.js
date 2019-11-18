const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
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
    order: {
        type: Number,
        allowNull: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Brand", BrandSchema);
