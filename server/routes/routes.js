const express = require('express')
const router = express.Router()
const cors = require('cors')
const { login } = require('../controllers/authController')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.get('/login', login)

module.exports = router

