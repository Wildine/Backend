const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin, isEntreprise, isEtudiant, isEncadrant, isDemandeEmploi } = require('../middleware/roleMiddleware');

router.get('/', verifyToken, userController.getAllUsers);

// router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// Route pour récupérer le statut d'un utilisateur (pas de sécurité ici)
router.get('/:userId', verifyToken, isEtudiant, userController.getStatut);

// router.get('/:userId/statut', verifyToken, isEtudiant, userController.getStatut);

// Route pour mettre à jour un utilisateur (sécurisée)
router.put('/:userId', verifyToken, isEtudiant, userController.updateUser);

// Route pour supprimer un utilisateur (sécurisée)
router.delete('/:userId', verifyToken, userController.deleteUser);

// router.delete('/:userId', verifyToken, isAdmin, userController.deleteUser);

// Route pour postuler (pas de sécurité ici, mais à ajouter si nécessaire)
router.post('/postuler', userController.postuler);

// Route pour récupérer le statut d'une postulation (pas de sécurité ici, mais à ajouter si nécessaire)
router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: "Bienvenue sur votre profil sécurisé.", user: req.user });
});

module.exports = router;
