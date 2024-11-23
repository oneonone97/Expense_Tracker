const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

// const authenticate = (req, res, next) => {

//     try {
//         const token = req.header('Authorization');
//         console.log(token);
//         const user = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
//         console.log('userID >>>> ', user.userId)
//         User.findByPk(user.userId).then(user => {

//             req.user = user; ///ver
//             next();
//         })

//       } catch(err) {
//         console.log(err);
//         return res.status(401).json({success: false})
//         // err
//       }

// }

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Retrieve Authorization header
  if (!authHeader) {
      return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
  if (!token) {
      return res.status(401).json({ message: 'JWT must be provided' });
  }

  try {
        const decoded = jwt.verify(token, 'secretkey');
        console.log('Decoded Token:', decoded); // Debug decoded payload
        next(); // Pass control to the next middleware or route handler
  } catch (err) {
      console.error('JWT verification failed:', err);
      res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = {
    authenticate
}