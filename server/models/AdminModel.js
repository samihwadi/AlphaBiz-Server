const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', AdminSchema)