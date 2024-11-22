import express from 'express'
const router = express.Router()
import cors from 'cors'
import { userLogin, adminLogin, userRegister, adminRegister, verifyUser, logout, getProfile } from '../controllers/authController.js'

// Middleware
router.use(cors({
    credentials: true,
    origin: 'https://alpha-biz-jessicamorcos-projects.vercel.app'
}))

router.post('/login/user', userLogin)
router.post('/login/admin', adminLogin)
router.post('/register/user', userRegister)
router.post('/register/admin', adminRegister)
router.post('/verify-user', verifyUser)
router.post('/logout', logout)
router.get('/profile', getProfile)


export default router

