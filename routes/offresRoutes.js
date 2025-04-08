const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isEntreprise } = require('../middleware/roleMiddleware');
const offreController = require('../controllers/offreController');

router.get('/', verifyToken, isEntreprise, offreController.listeOffres);

router.get('/:id', verifyToken, isEntreprise, offreController.getOffre);

router.post('/', verifyToken, isEntreprise, offreController.addOffre);

router.put('/:id', verifyToken, isEntreprise, offreController.updateOffre);

router.delete('/:id', verifyToken, isEntreprise, offreController.deleteOffre);

module.exports = router;