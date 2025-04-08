const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const candidatureController = require('../controllers/candidatureController');
const { isEtudiant } = require('../middleware/roleMiddleware');

// Route pour postuler à une offre
router.get('/', candidatureController.getCandidaturesByOffre);

router.get('/offre/:offreId', candidatureController.getCandidaturesByOffre);

router.get('/utilisateur/:userId', verifyToken, isEtudiant, candidatureController.getCandidaturesByUser);

router.post('/postuler', verifyToken, isEtudiant, candidatureController.postuler);

// router.put('/:candidatureId', candidatureController.updateStatutCandidature);

router.delete('/:candidatureId', verifyToken, isEtudiant, candidatureController.deleteCandidature);

module.exports = router;