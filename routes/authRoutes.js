const express = require('express');
const authController = require('../controllers/authController');
// const userController = require('../controllers/userController');
const router = express.Router();

// router.get('/', authController.getAllUsers);

// Route pour l'inscription
router.post('/register', authController.registerUser);

// Route pour la connexion
router.post('/login', authController.loginUser);

module.exports = router;
