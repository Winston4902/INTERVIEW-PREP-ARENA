const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    // Check if the request has an authorization header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token
            
            // Verify the token using the secret in your .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user and attach them to the request (ignoring the password field)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };