import User from '../models/UserModel.js'
import Admin from '../models/AdminModel.js'
import { hashPassword, comparePassword } from '../helpers/auth.js'
import { sendEmailOTP } from '../helpers/email.js'
import jwt from 'jsonwebtoken'

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
export const adminRegister = async (req, res) => {
    const { name, email, password} = req.body;
    const checkName = name.trim()
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
        const exist = await Admin.findOne({email});
        if(exist) {
            return res.json({
                error: "Email is already taken"
            })
        }
        const hashedPassword = await hashPassword(password);
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        })
        return res.json({
            message: "Admin created successfully",
            admin: {
                ...admin._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
    }
}
//Register User
export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    const checkName = name.trim()
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
        const user = await User.create({
            name,
            email,
            password: hashedPassword
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
export const userLogin = async (req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    try {
        // Check if user exists
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }
        // Check if passwords match
        const match = await comparePassword(password, user.password)
        if (match) {
            const verificationToken = generateVerificationCode();
            user.verificationToken = verificationToken;
            user.verificationTokenExpiresAt = Date.now() + 900000; // 15 minutes
            await user.save()
            // Send email OTP
            try {
                await sendEmailOTP(user.email, verificationToken);
                return res.json({
                    message: 'Login successful, OTP sent to your email.'
                });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                return res.status(500).json({
                    error: 'Failed to send email OTP. Please try again.'
                });
            }
        } else {
            res.json({
                error: 'Incorrect Password'
            })
        }
    } catch (error) {
        console.log(error)
    }
}
// Login Admin
export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    const admin = await Admin.findOne({email})
    try {
        // Check if Admin exists
        if (!admin) {
            return res.json({
                error: 'Admin does not exist'
            })
        }
        // Check if passwords match
        const match = await comparePassword(password, admin.password)
        if (!match) {
            return res.json({
                error: 'Incorrect Password'
            })
        } else {
            return res.status(200).json({
                message: 'Login Successful'
            })
        }
    } catch (error) {
        console.log(error)
    }
}
