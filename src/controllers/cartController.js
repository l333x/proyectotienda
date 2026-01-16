const Product = require('../models/Product');

// Carrito temporal en memoria (se reinicia al apagar el servidor)
let carritoTemporal = [];

// --- VER CARRITO ---
exports.verCarrito = async (req, res) => {
    try {
        res.render('cart', { carrito: carritoTemporal });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el carrito');
    }
};

// --- AGREGAR AL CARRITO ---
exports.agregarProducto = async (req, res) => {
    try {
        const { productoId } = req.body;
        const producto = await Product.findById(productoId);

        if (!producto) return res.redirect('/tienda');

        // Buscar si ya existe para sumar cantidad
        const itemExistente = carritoTemporal.find(item => item.producto._id.toString() === productoId);

        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carritoTemporal.push({
                producto: producto,
                cantidad: 1
            });
        }

        console.log(`🛒 Agregado: ${producto.nombre}`);
        res.redirect('/carrito'); // Vamos al carrito para ver el cambio

    } catch (error) {
        console.error(error);
        res.redirect('/tienda');
    }
};

// --- ELIMINAR DEL CARRITO ---
exports.eliminarProducto = async (req, res) => {
    const { productoId } = req.body;
    carritoTemporal = carritoTemporal.filter(item => item.producto._id.toString() !== productoId);
    res.redirect('/carrito');
};

// --- ACTUALIZAR CANTIDAD ---
exports.actualizarCantidad = async (req, res) => {
    const { productoId, accion } = req.body;
    const item = carritoTemporal.find(i => i.producto._id.toString() === productoId);

    if (item) {
        if (accion === 'sumar') {
            item.cantidad++;
        } else if (accion === 'restar') {
            item.cantidad--;
            if (item.cantidad < 1) {
                // Si baja de 1, eliminar
                carritoTemporal = carritoTemporal.filter(i => i.producto._id.toString() !== productoId);
            }
        }
    }
    res.redirect('/carrito');
};