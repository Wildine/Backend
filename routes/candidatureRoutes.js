const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const candidatureController = require('../controllers/candidatureController');
const { isEtudiant, isEntreprise, isEncadrant } = require('../middleware/roleMiddleware');

// Route pour postuler à une offre
router.get('/:offreId', candidatureController.getCandidaturesByOffre);

router.get('/offre/:offreId', candidatureController.getCandidaturesByOffre);

router.get('/utilisateur/:userId', candidatureController.getCandidaturesByUser);

router.get('/entreprise/:entrepriseId/candidatures', candidatureController.getCandidaturesParEntreprise);

router.get('/entreprise/:entrepriseId', verifyToken, isEntreprise, candidatureController.getCandidaturesByEntreprise);

router.get('/entreprise/encadrants', candidatureController.getEncadrantsByEntreprise);

router.get('/acceptees/:entrepriseId', candidatureController.getCandidaturesAccepteesByEntreprise);

router.get('/rejetes/:entrepriseId', candidatureController.getCandidaturesRejeteesByEntreprise);

router.get('/utilisateur/:userId', verifyToken, isEntreprise, candidatureController.getCandidaturesByUser);

// router.get('/table/:entrepriseId', candidatureController.getCandidaturesTable);
// router.get('/utilisateur/:userId', verifyToken, isEtudiant, candidatureController.getCandidaturesByUser);

// router.post('/postuler', candidatureController.postuler);
router.post('/postuler', verifyToken, isEtudiant, candidatureController.postuler);

// router.post('/postuler/etudiant', verifyToken, isEtudiant, candidatureController.postuler);

// router.post('/postuler/demandeur', verifyToken, isDemandeEmploi, candidatureController.postuler);

// router.get('/candidatures/:entrepriseId', candidatureController.getCandidaturesEntreprise);

router.put('/:candidatureId', candidatureController.updateStatutCandidature);

router.delete('/:candidatureId', verifyToken, isEtudiant, candidatureController.deleteCandidature);

module.exports = router;