const User = require('../models/UserModel')
const Admin = require('../models/AdminModel')
const { hashPassword, comparePassword} = require('../helpers/auth')
require('dotenv').config()
const jwt = require('jsonwebtoken')

// Generate Code Function
const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// JWT Function
const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // Expires after 7 days
        })
    })
    return token;
}

// Register Admin
const adminRegister = (req, res) => {
    res.json({mssg: "Create registration function"})
}
//Register User
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    checkName = name.trim()
    try {
        if(!name || (!/^[a-zA-Z\s]*$/.test(checkName))) {
            return res.json({
                error: 'Invalid Name'
            })
        }else if (!password || password.length < 8){
            return res.json({
                error: 'Password should be at least 8 characters'
            })
        } 
        const exist = await User.findOne({email});
        if(exist) {
            return res.json({
                error: "Email is already taken"
            })
        }
        const hashedPassword = await hashPassword(password);
        const verificationToken = generateVerificationCode();
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
        })
        return res.json({
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
    }
}
// Login User
const userLogin = (req, res) => {
    res.json({mssg: "Create login function"})
}

module.exports = { userLogin, userRegister, adminRegister }