const { User, Etudiant, Entreprise, Encadrant, DemandeEmploi, Candidature } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chargement des variables d'environnement
require('dotenv').config();

// Affichage de tous les utilisateurs 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la recuperation des utilisateurs.", error });
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
exports.postuler = async (req, res) => {
    const { userId } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà une postulation
        const existingPostulation = await Postulation.findOne({ where: { user_id: userId } });
        if (existingPostulation) {
            return res.status(400).json({ message: 'Vous avez déjà une postulation' });
        }

        // Créer la postulation
        const postulation = await Postulation.create({ user_id: userId });

        res.status(201).json({ message: 'Postulation envoyée avec succès', postulation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la postulation' });
    }
};

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
