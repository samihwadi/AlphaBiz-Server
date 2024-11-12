const Profile = require('../models/profileModel')
//Register User
const register = (req, res) => {
    res.json({mssg: "Create registration function"})
}
// Login User
const login = (req, res) => {
    res.json({mssg: "Create login function"})
}

module.exports = { login, register }