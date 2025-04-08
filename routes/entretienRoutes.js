const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const entretienController = require('../controllers/entretienController');
const { isEntreprise, isEncadrant } = require('../middleware/roleMiddleware');

router.get('/', verifyToken, isEntreprise, entretienController.getAllEntretiens);

router.get('/:id', verifyToken, isEncadrant, entretienController.getEntretienById);

router.get('/candidature/:candidatureId', verifyToken, isEncadrant, entretienController.getEntretiensByCandidature);

router.post('/', verifyToken, isEntreprise, entretienController.createEntretien);

router.put('/:id', verifyToken, isEntreprise, entretienController.updateEntretien);

router.delete('/:id', verifyToken, isEntreprise, entretienController.deleteEntretien);

module.exports = router;