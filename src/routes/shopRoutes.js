const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Ruta principal de la tienda: http://localhost:3000/tienda
router.get('/', shopController.obtenerTienda);

// Ruta mágica para crear productos falsos: http://localhost:3000/tienda/crear-datos
router.get('/crear-datos', shopController.crearDatosPrueba);

module.exports = router;