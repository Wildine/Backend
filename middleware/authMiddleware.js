const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];

    if (!token) {
        console.log('Aucun token');
        return res.status(403).json({ message: "Accès interdit. Token requis." });
    }

    jwt.verify(token, process.env.JWT_SECRET, { algorithms: [process.env.JWT_ALGORITHM] }, (err, decoded) => {
        if (err) {
            console.log('Token invalide', err);
            return res.status(401).json({ message: "Token invalide ou expiré." });
        }

        console.log('Token validé, payload:', decoded);
        req.user = decoded;
        next();
    });
};