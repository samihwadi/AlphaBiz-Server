import mongoose from 'mongoose'
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
const Admin = mongoose.model('Admin', AdminSchema)
export default Admin