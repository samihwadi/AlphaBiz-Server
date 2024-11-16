const express = require('express')
const router = express.Router()
const cors = require('cors')
const { userLogin, userRegister, adminRegister } = require('../controllers/authController')

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.post('/login/user', userLogin)
router.post('/register/user', userRegister)
router.post('/register/admin', adminRegister)

module.exports = router

