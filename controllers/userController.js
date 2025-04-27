const { User, Etudiant, Entreprise, Encadrant, DemandeEmploi, Candidature, Offre } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

// Chargement des variables d'environnement
require('dotenv').config();

// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll({
//             include: [
//                 {
//                     model: Etudiant,
//                     attributes: ['prenom', 'nom']
//                 },
//                 {
//                     model: Encadrant,
//                     attributes: ['prenom', 'nom']
//                 },
//                 {
//                     model: DemandeEmploi,
//                     attributes: ['prenom', 'nom']
//                 },
//                 {
//                     model: Entreprise,
//                     attributes: ['nom_entreprise']
//                 }
//             ]
//         });
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error });
//     }
// };

// Affichage de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la recuperation des utilisateurs.", error });
    }
};

// Récupérer uniquement les entreprises
// exports.getAllEntreprises = async (req, res) => {
//     try {
//         const entreprises = await Entreprise.findAll();
//         res.json(entreprises);
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la récupération des entreprises.", error });
//     }
// };

// exports.getAllEntreprises = async (req, res) => {
//     try {
//         const entreprises = await Entreprise.findAll({
//         include: [Offre] // On n'a pas besoin de l'alias ici
//         });
//         res.json(entreprises);
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la récupération des entreprises.", error });
//     }
// };

exports.getAllEntreprises = async (req, res) => {
    try {
        const entreprises = await Entreprise.findAll({
        include: [{
        model: Offre,
        required: false // permet de faire une jointure même si l'entreprise n'a pas d'offres
        }],
        attributes: {
        include: [
            [Sequelize.fn('COUNT', Sequelize.col('offres.id')), 'nombreOffres'] // Compte le nombre d'offres pour chaque entreprise
        ]
        },
        group: ['Entreprise.id'] // Regroupe les résultats par entreprise pour avoir le nombre d'offres par entreprise
    });

    res.json(entreprises);
    } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des entreprises.", error });
    }
};

// Mise a jour d'un utilisateur deja existant
exports.updateUser= async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouve." });

        await user.update(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise a jour de l'utilisateur.", error }); 
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Trouver l'utilisateur a supprimer
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' });
        }

        // Supprimer l'utilisateur (les suppressions en cascade se produiront ici)
        await user.destroy();

        res.status(200).json({ message: "Utilisateur supprime avec succes" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
};

// Postuler (Créer une nouvelle postulation)
// exports.postuler = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         // Vérifier si l'utilisateur existe
//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         // Vérifier si l'utilisateur a déjà une postulation
//         const existingPostulation = await Postulation.findOne({ where: { user_id: userId } });
//         if (existingPostulation) {
//             return res.status(400).json({ message: 'Vous avez déjà une postulation' });
//         }

//         // Créer la postulation
//         const postulation = await Postulation.create({ user_id: userId });

//         res.status(201).json({ message: 'Postulation envoyée avec succès', postulation });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la postulation' });
//     }
// };

// Récupérer le statut d'une postulation
exports.getStatut = async (req, res) => {
    const { userId } = req.params;

    try {
        const candidature = await Candidature.findOne({ where: { user_id: userId } });

        if (!candidature) {
            return res.status(404).json({ message: 'Aucune postulation trouvée' });
        }

        res.status(200).json({ statut: candidature.statut });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du statut' });
    }
};

// exports.getUserConnected = async (req, res) => {
//     try {
//         const userId = req.user.id;  // L'ID de l'utilisateur récupéré via le middleware `verifyToken`

//         // Chercher l'utilisateur dans la base de données, avec les informations associées (étudiant, entreprise, etc.)
//         const user = await User.findByPk(userId, {
//             include: [
//                 {
//                     model: Etudiant,
//                     attributes: ['prenom', 'nom'],
//                     required: false,  // L'étudiant est optionnel
//                 },
//                 {
//                     model: Entreprise,
//                     attributes: ['nom_entreprise'],
//                     required: false,  // L'entreprise est optionnelle
//                 }
//             ]
//         });

//         if (!user) {
//             return res.status(404).json({ message: "Utilisateur non trouvé" });
//         }

//         // Déterminer les informations à renvoyer selon le type d'utilisateur
//         let prenom = null;
//         let nom = null;
//         let nomEntreprise = null;

//         // Si c'est un étudiant, récupérer le prénom et le nom
//         if (user.etudiant) {
//             prenom = user.etudiant.prenom;
//             nom = user.etudiant.nom;
//         }

//         // Si c'est une entreprise, récupérer le nom de l'entreprise
//         if (user.entreprise) {
//             nomEntreprise = user.entreprise.nom_entreprise;
//         }

//         // Retourner les informations de l'utilisateur connecté
//         res.json({
//             prenom,
//             nom,
//             nomEntreprise
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
//     }
// };

