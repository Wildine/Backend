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
    const { email, password, role, prenom, nom, universite, nom_entreprise, description, secteur } = req.body;

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
        if (role === 'entreprise' && (!nom_entreprise || !description || !secteur) ) {
            return res.status(400).json({ message: "Nom de l'entreprise manquant pour le rôle Entreprise" });
        }
        if (role === 'encadrant' && (!prenom || !nom)) {
            return res.status(400).json({ message: "Champs manquants pour le rôle Encadrant" });
        }
        if (role === 'demande_emploi' && (!prenom || !nom)) {
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
            await Entreprise.create({ nom_entreprise, description, secteur, user_id: user.id });
        } else if (role === 'encadrant') {
            await Encadrant.create({ prenom, nom, user_id: user.id });
        } else if (role === 'demande_emploi') {
            await DemandeEmploi.create({ prenom, nom, user_id: user.id });
        }

        res.status(201).json({ message: "Utilisateur cree avec succes", user: { id: user.id, email: user.email, role: user.role } }); // Modification : retour uniquement des infos necessaires
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// exports.registerUser = async (req, res) => {
//     const { email, password, role, prenom, nom, universite, nom_entreprise, description, secteur } = req.body;

//     try {
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email déjà utilisé" });
//         }

//         if (role === 'etudiant' && (!prenom || !nom || !universite)) {
//             return res.status(400).json({ message: "Champs manquants pour le rôle Étudiant" });
//         }
//         if (role === 'entreprise' && (!nom_entreprise || !description || !secteur)) {
//             return res.status(400).json({ message: "Champs manquants pour le rôle Entreprise" });
//         }
//         if ((role === 'encadrant' || role === 'demande_emploi') && (!prenom || !nom)) {
//             return res.status(400).json({ message: `Champs manquants pour le rôle ${role === 'encadrant' ? 'Encadrant' : 'Demandeur d\'emploi'}` });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ email, password: hashedPassword, role });

//         // let nomAffiche = '';

//         // if (role === 'etudiant') {
//         //     await Etudiant.create({ prenom, nom, universite, user_id: user.id });
//         //     nomAffiche = nom;
//         // } else if (role === 'entreprise') {
//         //     await Entreprise.create({ nom_entreprise, description, secteur, user_id: user.id });
//         //     nomAffiche = nom_entreprise;
//         // } else if (role === 'encadrant') {
//         //     await Encadrant.create({ prenom, nom, user_id: user.id });
//         //     nomAffiche = nom;
//         // } else if (role === 'demande_emploi') {
//         //     await DemandeEmploi.create({ prenom, nom, user_id: user.id });
//         //     nomAffiche = nom;
//         // }

//         // res.status(201).json({
//         //     message: "Utilisateur créé avec succès",
//         //     user: {
//         //         id: user.id,
//         //         email: user.email,
//         //         role: user.role,
//         //         nom: nomAffiche
//         //     }
//         // });

//         let nomAffiche = '', prenomAffiche = '';

//         if (role === 'etudiant') {
//             await Etudiant.create({ prenom, nom, universite, user_id: user.id });
//             nomAffiche = nom;
//             prenomAffiche = prenom;
//         } else if (role === 'entreprise') {
//             await Entreprise.create({ nom_entreprise, description, secteur, user_id: user.id });
//             nomAffiche = nom_entreprise;
//         } else if (role === 'encadrant' || role === 'demande_emploi') {
//             await (role === 'encadrant' ? Encadrant : DemandeEmploi).create({ prenom, nom, user_id: user.id });
//             nomAffiche = nom;
//             prenomAffiche = prenom;
//         }

//         res.status(201).json({
//             message: "Utilisateur créé avec succès",
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role,
//                 nom: nomAffiche,
//                 prenom: prenomAffiche || undefined
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Erreur serveur", error });
//     }
// };


// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ where: { email }, include: { model: Entreprise } });
//         if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

//         const token = generateToken(user);

//         // Renvoyer l'ID de l'entreprise (si existant) dans la réponse
//         res.json({
//             message: "Connexion réussie",
//             token,
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role,
//                 prenom: user.prenom,
//                 nom: user.nom,
//                 entrepriseId: user.entreprise ? user.entreprise.id : null
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Erreur serveur", error });
//     }
// };

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        let extraData = {};
        if (user.role === 'etudiant') {
            const etudiant = await Etudiant.findOne({ where: { user_id: user.id } });
            extraData = { prenom: etudiant?.prenom, nom: etudiant?.nom };
        } else if (user.role === 'entreprise') {
            const entreprise = await Entreprise.findOne({ where: { user_id: user.id } });
            extraData = { nom: entreprise?.nom_entreprise, entrepriseId: entreprise?.id };
        } else if (user.role === 'encadrant') {
            const encadrant = await Encadrant.findOne({ where: { user_id: user.id } });
            extraData = { prenom: encadrant?.prenom, nom: encadrant?.nom };
        } else if (user.role === 'demande_emploi') {
            const demandeur = await DemandeEmploi.findOne({ where: { user_id: user.id } });
            extraData = { prenom: demandeur?.prenom, nom: demandeur?.nom };
        }

        const token = generateToken(user);

        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                ...extraData
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};