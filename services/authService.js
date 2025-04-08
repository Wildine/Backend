const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRATION, 
            algorithm: process.env.JWT_ALGORITHM 
        }
    );
};

// Fonction pour comparer les mots de passe
const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    generateToken,
    comparePasswords
};
