import express from 'express'
const router = express.Router()
import cors from 'cors'
import { userLogin, adminLogin, userRegister, adminRegister, verifyUser } from '../controllers/authController.js'

// Middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

router.post('/login/user', userLogin)
router.post('/login/admin', adminLogin)
router.post('/register/user', userRegister)
router.post('/register/admin', adminRegister)
router.post('/verify-user', verifyUser)

export default router

