const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    isConfirmed: {
        type: Boolean,
        required: true,
        default: false

    },
    secret: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    usrimg: {
        type: String,
        default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0 // admin=1  professionnel=2
    },
    description: {
        type: String,
        default: "Decrivez vous en quelque ligne !"
    },
    DateNaissance: {
        type: Date,
        default: "02/02/2000"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)