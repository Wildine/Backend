const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isEncadrant } = require('../middleware/roleMiddleware');
const evaluationController = require('../controllers/evaluationController');

router.get('/', verifyToken, isEncadrant, evaluationController.getAllEvaluations);

router.post('/', verifyToken, isEncadrant, evaluationController.createEvaluation);

router.put('/:id', verifyToken, isEncadrant, evaluationController.updateEvaluation);

router.delete('/:id', verifyToken, isEncadrant, evaluationController.deleteEvaluation);

router.get('/stagiaire/:stagiaireId', verifyToken, isEncadrant, evaluationController.getEvaluationsByStagiaire);

router.get('/encadrant/:encadrantId', verifyToken, isEncadrant, evaluationController.getEvaluationsByEncadrant);

module.exports = router;
