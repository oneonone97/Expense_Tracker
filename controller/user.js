const { where } = require('sequelize');
const User = require('../models/users');
const bcrypt = require('bcrypt');

function isstringisvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false
    }
}

// Signup Backend
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('email',email);
    if (isstringisvalid(name) || isstringisvalid(email) || isstringisvalid(password)) {
        return res.status(400).json({ error: "Bad Parameters" });
    }

    try {
        await User.create({ name, email, password });
        res.status(201).json({ message: 'Successfully created new user' });
    } catch (err) {
        console.error('Error during user creation:', err);
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};

// Login Backend 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (isstringisvalid(email) || isstringisvalid(password)) {
            return res.status(400).json({ error: "Email or password is missing" });
        }

        console.log(password);

        // Find user by email
        const user = await User.findAll({ where: { email } });

        if (user.length>0) {
            // Compare password
            if (user[0].password === password) {
                return res.status(200).json({ success: true, message: "User logged in successfully" });
            } else {
                return res.status(401).json({ success: false, message: "Password is incorrect" });
            }
        } else {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: err, success: false });
    }
};


module.exports = { signup, login };
