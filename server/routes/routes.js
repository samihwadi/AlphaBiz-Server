import express from 'express'
const router = express.Router()
import cors from 'cors'
import { userLogin, adminLogin, userRegister, adminRegister } from '../controllers/authController.js'

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.post('/login/user', userLogin)
router.post('/login/admin', adminLogin)
router.post('/register/user', userRegister)
router.post('/register/admin', adminRegister)

export default router

