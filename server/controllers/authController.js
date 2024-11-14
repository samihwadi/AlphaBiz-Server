const Profile = require('../models/UserModel')

// Register Admin
const adminRegister = (req, res) => {
    res.json({mssg: "Create registration function"})
}
//Register User
const userRegister = (req, res) => {
    res.json({mssg: "Create registration function"})
}
// Login User
const userLogin = (req, res) => {
    res.json({mssg: "Create login function"})
}

module.exports = { userLogin, userRegister, adminRegister }