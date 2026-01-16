const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
require('dotenv').config();

// --- IMPORTAR RUTAS ---
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const cartRoutes = require('./src/routes/cartRoutes'); 
const auditRoutes = require('./src/routes/auditRoutes'); // <--- NUEVO: Importar Auditoría

// Conectar Base de Datos
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

// --- RUTAS PRINCIPALES ---

// 1. Ruta Raíz: Redirige SIEMPRE al Login (Requisito)
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// 2. Ruta Inicio (Landing Page): A donde llegas después de loguearte
app.get('/home', (req, res) => {
    res.render('index');
});

// 3. Rutas de Módulos
app.use('/auth', authRoutes);
app.use('/tienda', shopRoutes);
app.use('/carrito', cartRoutes);
app.use('/auditoria', auditRoutes); // <--- NUEVO: Activar ruta /auditoria

// 4. API del Chatbot (Para que VisionBot funcione en Index y Shop)
app.post('/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        // Conexión con Python
        const response = await axios.post(`${PYTHON_URL}/api/chat`, { mensaje });
        res.json(response.data);
    } catch (error) {
        console.error("Error Chat:", error.message);
        res.status(500).json({ autor: "Sistema", analisis: "Error de conexión con la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor GamerVision listo en: http://localhost:${PORT}`);
});