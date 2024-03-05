const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  
    title:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    price:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true
    },  
    images:{
        type: Object,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    sold:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true //important
})


module.exports = mongoose.model("Products", productSchema)