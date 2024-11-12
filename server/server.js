require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes/routes')

// Middleware
app.use(express.json())

// Routes
app.use('/', routes)



mongoose.connect(process.env.MONGO_URL)
.then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })