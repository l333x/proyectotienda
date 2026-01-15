const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostrar formulario de Login/Registro
router.get('/login', (req, res) => {
    res.render('auth', { titulo: 'Login / Registro GamerVision' });
});

// Procesar datos del formulario
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;