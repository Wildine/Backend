const jwt = require('jsonwebtoken');

// exports.isEtudiant = (req, res, next) => {
//     console.log(req.user); // Pour vérifier si req.user contient bien un rôle
//     if (req.user.role !== 'etudiant') {
//         return res.status(403).json({ message: "Acces reserve aux etudiants." });
//     }
//     next();
// };

exports.isEtudiant = (req, res, next) => {
    console.log('Utilisateur reçu pour vérification:', req.user);
    if (!req.user || req.user.role !== 'etudiant') {
        return res.status(403).json({ message: "Accès réservé aux étudiants." });
    }
    next();
};

exports.isEntreprise = (req, res, next) => {
    if (req.user.role !== 'entreprise') {
        return res.status(403).json({ message: "Acces reserve aux entreprises." });
    }
    next();
};

exports.isEncadrant = (req, res, next) => {
    if (req.user.role !== 'encadrant') {
        return res.status(403).json({ message: "Acces reserve aux encadrants." });
    }
    next();
};

exports.isDemandeEmploi = (req, res, next) => {
    if (req.user.role !== 'demande_emploi') {
        return res.status(403).json({ message: "Acces reserve aux chercheurs d'emploi." });
    }
    next();
};
