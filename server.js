const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
require('dotenv').config();

// --- IMPORTAR RUTAS ---
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes'); // <--- 1. IMPORTAMOS LA RUTA DE TIENDA

// Conectar BD
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- DEFINIR RUTAS (ENDPOINTS) ---
app.use('/auth', authRoutes);
app.use('/tienda', shopRoutes); // <--- 2. ACTIVAMOS LA RUTA /tienda

app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'GamerVision - Home',
        mensaje: 'Bienvenido al sistema híbrido'
    });
});

// Ruta de prueba IA
app.get('/prueba-ia', async (req, res) => {
    try {
        console.log("📡 Conectando con el cerebro de Python...");
        const response = await axios.post(`${PYTHON_URL}/api/chat`, {
            mensaje: "Hola Python, soy Node.js reportándome."
        });
        res.json({
            estado: 'ÉXITO',
            mensaje_original: "Hola Python, soy Node.js reportándome.",
            respuesta_python: response.data
        });
    } catch (error) {
        console.error("❌ Error conectando con Python:", error.message);
        res.status(500).json({ estado: 'ERROR', detalle: 'El servicio de Python no responde.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor NODE listo en: http://localhost:${PORT}`);
});