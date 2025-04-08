const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/roleMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
const statistiqueController = require('../controllers/statistiqueController');

router.get('/global', statistiqueController.getGlobalStats);
// router.get('/global', verifyToken, isAdmin, statistiqueController.getGlobalStats);

module.exports = router;