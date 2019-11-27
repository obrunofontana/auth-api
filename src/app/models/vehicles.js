
const mongoose = require("mongoose");

const VehiclesSchema = new mongoose.Schema({
    key: {
        type: String,
       
    },
    name: {
        type: String,
    },
    fipeName: {
        type: String,
       
    },
    brand: {
        type: Number,
   
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Vehicle", VehiclesSchema);





