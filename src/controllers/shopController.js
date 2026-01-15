const Product = require('../models/Product');

// --- VER CATÁLOGO ---
exports.obtenerTienda = async (req, res) => {
    try {
        // Traemos todos los productos de la BD
        const productos = await Product.find();
        
        res.render('shop', { 
            titulo: 'Catálogo - GamerVision',
            productos: productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
};

// --- VER DETALLE (Para el futuro) ---
exports.detalleProducto = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        res.render('product_detail', { producto });
    } catch (error) {
        res.redirect('/tienda');
    }
};

// --- FUNCIÓN MÁGICA: LLENAR TIENDA (SEED) ---
// Ejecuta esto una sola vez para tener datos
exports.crearDatosPrueba = async (req, res) => {
    try {
        const hayProductos = await Product.countDocuments();
        if (hayProductos > 0) {
            return res.send('¡Ya hay productos! No es necesario crear más.');
        }

        const datosFalsos = [
            {
                nombre: "Teclado Mecánico RGB Redragon",
                descripcion: "Switches azules, retroiluminación chroma y respuesta ultra rápida.",
                precio: 45.99,
                categoria: "Teclados",
                stock: 20,
                imagen: "https://m.media-amazon.com/images/I/71cngLX2xuL._AC_SX679_.jpg"
            },
            {
                nombre: "Mouse Logitech G502 Hero",
                descripcion: "Sensor HERO 25K, pesos ajustables y 11 botones programables.",
                precio: 39.50,
                categoria: "Mouse",
                stock: 15,
                imagen: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg"
            },
            {
                nombre: "Monitor ASUS TUF Gaming 27\"",
                descripcion: "165Hz, 1ms respuesta, panel IPS. La mejor visión para shooters.",
                precio: 280.00,
                categoria: "Monitores",
                stock: 5,
                imagen: "https://m.media-amazon.com/images/I/81Ics1r2xLL._AC_SX679_.jpg"
            },
            {
                nombre: "NVIDIA RTX 4060 Ti",
                descripcion: "8GB VRAM, DLSS 3.0. Potencia bruta para renderizado e IA.",
                precio: 499.99,
                categoria: "Componentes",
                stock: 3,
                imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg"
            },
            {
                nombre: "Headset HyperX Cloud II",
                descripcion: "Sonido envolvente 7.1 virtual, espuma de memoria y micrófono con cancelación.",
                precio: 75.00,
                categoria: "Audio",
                stock: 10,
                imagen: "https://m.media-amazon.com/images/I/7120GgUkj3L._AC_SX679_.jpg"
            }
        ];

        await Product.insertMany(datosFalsos);
        res.send('✅ ¡5 Productos Gamer creados exitosamente! Ve a /tienda');

    } catch (error) {
        console.error(error);
        res.send('Error creando datos de prueba');
    }
};