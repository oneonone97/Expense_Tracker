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

//
// Signup Backend
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user to the database
        await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Failed to register user" });
    }
};

//
// Login Backend 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Failed to login" });
    }
};


module.exports = { signup, login };
