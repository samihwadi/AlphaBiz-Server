import User from '../models/UserModel.js'
import Admin from '../models/AdminModel.js'
import { hashPassword, comparePassword } from '../helpers/auth.js'
import { sendEmailOTP } from '../helpers/email.js'
import jwt from 'jsonwebtoken'

// Generate Code Function
const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// JWT Function
const generateToken = (res, userID, userName, userEmail) => {
    const token = jwt.sign({ userID, userName, userEmail }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
    return token;
};

// Register Admin
export const adminRegister = async (req, res) => {
    const { name, email, password, age, gender, contactNumber } = req.body;
    const checkName = name.trim();

    try {
        if (!name || (!/^[a-zA-Z\s]*$/.test(checkName))) {
            return res.json({
                error: 'Invalid Name'
            });
        } else if (!password || password.length < 8) {
            return res.json({
                error: 'Password should be at least 8 characters'
            });
        } else if (!/^(\(\d{3}\)\s?\d{3}-\d{4}|\d{10})$/.test(contactNumber)) {
            return res.json({
                error: 'Not a valid Canadian phone number format! Eg: 1234567890 or (123) 456-7890'
            });
        } else if (gender && !['male', 'female'].includes(gender)) {
            return res.json({
                error: 'Gender must be either "male" or "female"'
            });
        } else if (age && (isNaN(age) || age < 0 || age > 120)) {
            return res.json({
                error: 'Invalid age provided'
            });
        }

        const exist = await Admin.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is already taken'
            });
        }

        const hashedPassword = await hashPassword(password);
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            contactNumber,
            createdAt: new Date()
        });

        return res.json({
            message: 'Admin created successfully',
            admin: {
                ...admin._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(error);
        return res.json({ error: 'An error occurred during registration' });
    }
};

//Register User
export const userRegister = async (req, res) => {
    const { name, email, password, age, gender, contactNumber } = req.body;
    const checkName = name.trim();

    try {
        if (!name || (!/^[a-zA-Z\s]*$/.test(checkName))) {
            return res.json({
                error: 'Invalid Name'
            });
        } else if (!password || password.length < 8) {
            return res.json({
                error: 'Password should be at least 8 characters'
            });
        } else if (!/^(\(\d{3}\)\s?\d{3}-\d{4}|\d{10})$/.test(contactNumber)) {
            return res.json({
                error: 'Not a valid Canadian phone number format! Eg: 1234567890 or (123) 456-7890'
            });
        } else if (gender && !['male', 'female'].includes(gender)) {
            return res.json({
                error: 'Gender must be either "male" or "female"'
            });
        } else if (age && (isNaN(age) || age < 0 || age > 120)) {
            return res.json({
                error: 'Invalid age provided'
            });
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is already taken'
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            contactNumber,
            createdAt: new Date()
        });

        return res.json({
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(error);
        return res.json({ error: 'An error occurred during registration' });
    }
};

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
            user.verified = false
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
        } 
        const token = generateToken(res, admin._id, admin.name, admin.email);
        res.status(200).json({
            message: 'Admin logged in successfully'
        })

    } catch (error) {
        console.log(error)
    }
}

// Verifying OTP
export const verifyUser = async (req, res) => {
    const { otpCode } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: otpCode,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired verification code'
            })
        } else {
            user.verified = true
            user.verificationToken = undefined
            user.verificationTokenExpiresAt = undefined
            await user.save()
            // Assign JWT token to the user
            const token = generateToken(res, user._id, user.name, user.email);
        }
        res.status(200).json({
            message: 'User verified successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Logout 
export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        message: "Logged out successfully"
    })
}

// Getting User Profile
export const getProfile = async (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}

