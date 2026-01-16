const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

// Lista de 25 Productos Gamer Reales
const productosNuevos = [
    // --- LAPTOPS ---
    { nombre: "ASUS ROG Strix G16", descripcion: "i9-13980HX, RTX 4070, 16GB DDR5, 1TB SSD", precio: 1899.00, categoria: "Laptops", stock: 5, imagen: "https://m.media-amazon.com/images/I/715VI6W9+JL._AC_SX679_.jpg" },
    { nombre: "MSI Katana 15 B13V", descripcion: "i7-13620H, RTX 4060, 16GB RAM, 1TB NVMe", precio: 1499.00, categoria: "Laptops", stock: 8, imagen: "https://m.media-amazon.com/images/I/71cngLX2xuL._AC_SX679_.jpg" },
    { nombre: "Acer Nitro 5 AN515", descripcion: "Ryzen 7 6800H, RTX 3070Ti, 165Hz QHD", precio: 1250.00, categoria: "Laptops", stock: 10, imagen: "https://m.media-amazon.com/images/I/81Ics1r2xLL._AC_SX679_.jpg" },
    { nombre: "Lenovo Legion Pro 5", descripcion: "i7-13700HX, RTX 4060, 32GB RAM, Pantalla 240Hz", precio: 1650.00, categoria: "Laptops", stock: 4, imagen: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg" },
    
    // --- TARJETAS DE VIDEO ---
    { nombre: "ASUS Dual RTX 4070 OC", descripcion: "12GB GDDR6X, DLSS 3.0, Doble ventilador Axial-tech", precio: 699.00, categoria: "Componentes", stock: 12, imagen: "https://m.media-amazon.com/images/I/7120GgUkj3L._AC_SX679_.jpg" },
    { nombre: "MSI Gaming X Trio RTX 4090", descripcion: "24GB GDDR6X, La bestia definitiva para 8K gaming", precio: 2199.00, categoria: "Componentes", stock: 2, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "Zotac Gaming RTX 3060", descripcion: "12GB GDDR6, Twin Edge OC, Perfecta para 1080p", precio: 320.00, categoria: "Componentes", stock: 20, imagen: "https://m.media-amazon.com/images/I/71cngLX2xuL._AC_SX679_.jpg" },
    { nombre: "Gigabyte RX 7800 XT", descripcion: "16GB GDDR6, Gaming OC, RDNA 3 Architecture", precio: 540.00, categoria: "Componentes", stock: 6, imagen: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg" },

    // --- PROCESADORES ---
    { nombre: "AMD Ryzen 7 5700X", descripcion: "8 Núcleos, 16 Hilos, hasta 4.6GHz, Socket AM4", precio: 185.00, categoria: "Componentes", stock: 25, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "Intel Core i5-13600K", descripcion: "14 Núcleos (6P+8E), Desbloqueado para Overclock", precio: 319.00, categoria: "Componentes", stock: 15, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "AMD Ryzen 9 7950X3D", descripcion: "El rey del gaming con 3D V-Cache, 16 Núcleos", precio: 650.00, categoria: "Componentes", stock: 3, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },

    // --- MONITORES ---
    { nombre: "Gigabyte G27FC A", descripcion: "27\" Curvo 1500R, 165Hz, 1ms, Panel VA FHD", precio: 199.00, categoria: "Monitores", stock: 8, imagen: "https://m.media-amazon.com/images/I/81Ics1r2xLL._AC_SX679_.jpg" },
    { nombre: "Samsung Odyssey G5", descripcion: "32\" QHD 144Hz, HDR10, Curvatura 1000R inmersiva", precio: 350.00, categoria: "Monitores", stock: 5, imagen: "https://m.media-amazon.com/images/I/81Ics1r2xLL._AC_SX679_.jpg" },
    { nombre: "LG UltraGear 24GN650", descripcion: "24\" IPS, 144Hz, 1ms GtG, Compatible con G-Sync", precio: 180.00, categoria: "Monitores", stock: 15, imagen: "https://m.media-amazon.com/images/I/81Ics1r2xLL._AC_SX679_.jpg" },

    // --- PERIFÉRICOS ---
    { nombre: "Logitech G502 Hero", descripcion: "Sensor HERO 25K, 11 botones programables, RGB", precio: 45.00, categoria: "Periféricos", stock: 50, imagen: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg" },
    { nombre: "Razer DeathAdder V3", descripcion: "Ultraligero 59g, Focus Pro 30K, 8000Hz Polling", precio: 69.99, categoria: "Periféricos", stock: 20, imagen: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg" },
    { nombre: "Redragon Kumara K552", descripcion: "Mecánico TKL, Switches Blue, RGB Rainbow, Español", precio: 39.00, categoria: "Periféricos", stock: 40, imagen: "https://m.media-amazon.com/images/I/71cngLX2xuL._AC_SX679_.jpg" },
    { nombre: "Corsair K70 RGB PRO", descripcion: "Mecánico Cherry MX Red, Marco de aluminio, AXON", precio: 159.00, categoria: "Periféricos", stock: 10, imagen: "https://m.media-amazon.com/images/I/71cngLX2xuL._AC_SX679_.jpg" },
    { nombre: "HyperX Cloud II", descripcion: "Sonido envolvente 7.1, espuma viscoelástica, Rojo", precio: 75.00, categoria: "Periféricos", stock: 30, imagen: "https://m.media-amazon.com/images/I/7120GgUkj3L._AC_SX679_.jpg" },
    { nombre: "Logitech G733 Lightspeed", descripcion: "Inalámbrico, ultraligero, RGB frontal, Azul", precio: 129.00, categoria: "Periféricos", stock: 12, imagen: "https://m.media-amazon.com/images/I/7120GgUkj3L._AC_SX679_.jpg" },

    // --- OTROS ---
    { nombre: "Case Cougar Archon 2", descripcion: "Mid Tower, Vidrio Templado, 3 Fans ARGB incluidos", precio: 75.00, categoria: "Componentes", stock: 10, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "Fuente Corsair RM850x", descripcion: "850W 80+ Gold, Full Modular, Condensadores Japoneses", precio: 135.00, categoria: "Componentes", stock: 8, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "SSD Samsung 980 PRO 1TB", descripcion: "NVMe Gen4, hasta 7000 MB/s, Compatible con PS5", precio: 99.00, categoria: "Componentes", stock: 30, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "RAM Corsair Vengeance 32GB", descripcion: "DDR5 6000MHz, Kit 2x16GB, Perfil XMP 3.0", precio: 120.00, categoria: "Componentes", stock: 15, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" },
    { nombre: "Cooler Master Hyper 212", descripcion: "Disipador de aire, Halo Black, RGB Fan", precio: 45.00, categoria: "Componentes", stock: 20, imagen: "https://m.media-amazon.com/images/I/61VLj-x+T4L._AC_SX679_.jpg" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🍃 Conectado a MongoDB');
        
        // Limpiar productos viejos (Opcional, comenta si no quieres borrar)
        await Product.deleteMany({});
        console.log('🧹 Productos anteriores eliminados');

        // Insertar nuevos
        await Product.insertMany(productosNuevos);
        console.log(`✅ ${productosNuevos.length} Productos Gamer agregados exitosamente`);
        
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedDB();