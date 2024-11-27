const jwt = require('jsonwebtoken');
const User = require('../models/users.js');


const authenticate = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers['authorization'];

        // Check if the token is present and correctly formatted
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token missing or malformed.' });
        }

        // Extract the token part from 'Bearer <token>'
        const actualToken = token.split(' ')[1]; 

        // Verify the token
        const decodedToken = jwt.verify(actualToken, 'secret'); // Ensure secret matches the signing key

        console.log('User ID from token >>>> ', decodedToken.id); // Ensure this matches your token payload structure

        // Fetch the user from the database using the ID from the token
        const user = await User.findByPk(decodedToken.id); // Use await for better error handling

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware function or route handler
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
};



module.exports = {
    authenticate
}