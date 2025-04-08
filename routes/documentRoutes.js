const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const documentController = require('../controllers/documentController');

router.post('/generate', verifyToken, documentController.generateDocument);

router.get('/:documentId/download', verifyToken, documentController.downloadDocument);

module.exports = router;
