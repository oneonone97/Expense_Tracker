require('dotenv').config();
const { where } = require('sequelize');
const User = require('../models/users.js');
const bcrypt = require('bcrypt');
// JWT
const jwt = require('jsonwebtoken');


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



function generateAccessToken(userId, name) {
    if (!userId || !name) {
        throw new Error('userId and name must be provided to generate a token');
    }

   const secret = process.env.TOKEN_SECRET;

   console.log("TOKEN_SECRET:", secret);

   if(!secret){
    throw new Error('Token secret not define in enviroment variables')
   }

    return jwt.sign(
        { id: userId, userName: name }, 
        secret,
    );
}

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
// access token
const userId = user.id; // Ensure this field exists in the user model
const name = user.name; // Optional: other fields to include in the payload
const token = generateAccessToken(userId, name);

    res.status(200).json({
    message: 'Login successful',
    token,
    user: { name: user.name, email: user.email },
    });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Failed to login" });
    }
};


module.exports = { signup, login };


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
// Sohan
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsIm5hbWUiOiJTb2hhbiIsImlhdCI6MTczMjM2MzU4OSwiZXhwIjoxNzMyMzY3MTg5fQ.Y7DxLWquzAZM3TGMZDyQwYKqMXtAT-aitYWwq8WydJM