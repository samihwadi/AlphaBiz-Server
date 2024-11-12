const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: String
})

module.exports = mongoose.model('Profile', profileSchema)