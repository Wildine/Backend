const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const { isEntreprise, isEtudiant, isEncadrant, isDemandeEmploi } = require('../middleware/roleMiddleware');

// Route pour récupérer les statistiques du dashboard d'un utilisateur
router.get('/etudiant', verifyToken, isEtudiant, dashboardController.getDashboard);

router.get('/entreprise', verifyToken, isEntreprise, dashboardController.getDashboard);

router.get('/encadrant', verifyToken, isEncadrant, dashboardController.getDashboard);

router.get('/demandeEmploi', verifyToken, isDemandeEmploi, dashboardController.getDashboard);

module.exports = router;