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
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Admin = mongoose.model('Admin', AdminSchema)
export default Admin