const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    key: {
        type: String,
       
    },
    name: {
        type: String,
        
    },
    fipeName: {
        type: String,
    
    },
    order: {
        type: Number,
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("Brand", BrandSchema);
