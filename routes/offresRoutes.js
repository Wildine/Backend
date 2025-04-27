const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isEntreprise } = require('../middleware/roleMiddleware');
const offreController = require('../controllers/offreController');

router.get('/', offreController.listeOffres);

// router.get('/', verifyToken, isEntreprise, offreController.listeOffres);

router.get('/:id', offreController.getOffre);

// router.get('/offres', offreController.listeOffresParEntreprise);

router.get('/offres', offreController.listeOffres);

// router.get('/:entrepriseId', offreController.listeOffresParEntreprise);

router.get('/entreprise/:entrepriseId', offreController.listeOffresParEntreprise);

// router.post('/', offreController.addOffre);
router.post('/', verifyToken, isEntreprise, offreController.addOffre);

router.put('/:id', verifyToken, isEntreprise, offreController.updateOffre);

router.delete('/:id', verifyToken, isEntreprise, offreController.deleteOffre);

module.exports = router;