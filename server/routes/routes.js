const express = require('express')
const router = express.Router()
const cors = require('cors')
const { userLogin, userRegister, adminRegister } = require('../controllers/authController')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.get('/login/user', userLogin)
router.get('/register', userRegister)
router.get('/register/admin', adminRegister)

module.exports = router

