const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Etudiant, Entreprise, Encadrant, DemandeEmploi } = require('../models');

require('dotenv').config();

// Fonction de generation du token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION,
            algorithm: process.env.JWT_ALGORITHM
        }
    );
};


// Inscription d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
    const { email, password, role, prenom, nom, universite, nom_entreprise } = req.body;

    try {
        // Verification si l'email est dejà utilise
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email dejà utilise" });
        }

        // Verification des champs obligatoires selon le rôle
        if (role === 'etudiant' && (!prenom || !nom || !universite)) {
            return res.status(400).json({ message: "Champs manquants pour le rôle Etudiant" });
        }
        if (role === 'entreprise' && !nom_entreprise) {
            return res.status(400).json({ message: "Nom de l'entreprise manquant pour le rôle Entreprise" });
        }
        if (role === 'encadrant' && (!prenom || !nom)) {
            return res.status(400).json({ message: "Champs manquants pour le rôle Encadrant" });
        }
        if (role === 'demandeur_emploi' && (!prenom || !nom)) {
            return res.status(400).json({ message: "Champs manquants pour le rôle Demandeur d'emploi" });
        }

        // Hashage du mot de passe avant stockage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creation de l'utilisateur principal
        const user = await User.create({ email, password: hashedPassword, role });

        // Creation de l'entite associee selon le rôle
        if (role === 'etudiant') {
            await Etudiant.create({ prenom, nom, universite, user_id: user.id });
        } else if (role === 'entreprise') {
            await Entreprise.create({ nom_entreprise, user_id: user.id });
        } else if (role === 'encadrant') {
            await Encadrant.create({ prenom, nom, user_id: user.id });
        } else if (role === 'demandeur_emploi') {
            await DemandeEmploi.create({ prenom, nom, user_id: user.id });
        }

        res.status(201).json({ message: "Utilisateur cree avec succes", user: { id: user.id, email: user.email, role: user.role } }); // Modification : retour uniquement des infos necessaires
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Connexion et generation du token JWT
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        // Verification du mot de passe hashe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        // Generation du token JWT avec une duree de validite de 24h
        const token = generateToken(user);
        res.json({ message: "Connexion reussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};