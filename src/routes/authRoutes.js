const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('auth', { titulo: 'Login / Registro GamerVision' });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

// NUEVA RUTA: Cerrar Sesión
router.get('/logout', authController.logout);

module.exports = router;