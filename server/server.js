import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import mongoose from 'mongoose'
import routes from './routes/routes.js'

// Middleware
app.use(express.json())

// Routes
app.use('/api', routes)



mongoose.connect(process.env.MONGO_URL)
.then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })