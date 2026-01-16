const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ver el carrito (GET /carrito)
router.get('/', cartController.verCarrito);

// Agregar (POST /carrito/agregar)
router.post('/agregar', cartController.agregarProducto);

// Eliminar (POST /carrito/eliminar)
router.post('/eliminar', cartController.eliminarProducto);

// Actualizar cantidad (POST /carrito/actualizar)
router.post('/actualizar', cartController.actualizarCantidad);

module.exports = router;