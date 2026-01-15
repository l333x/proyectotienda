const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
require('dotenv').config();

// --- IMPORTAR RUTAS ---
const authRoutes = require('./src/routes/authRoutes');
const shopRoutes = require('./src/routes/shopRoutes');

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
app.use('/tienda', shopRoutes);

// 1. Landing Page / Home -> AHORA REDIRIGE AL LOGIN (Seguridad primero)
app.get('/', (req, res) => {
    // Si entras a la raíz, te mando a identificarte.
    res.redirect('/auth/login');
});

// 2. NUEVO: Vista del Chat (La interfaz bonita)
app.get('/chat-ui', (req, res) => {
    res.render('chat'); // Esto carga el archivo views/chat.ejs
});

// 3. API del Chat (El cerebro que habla con Python)
app.post('/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        if (!mensaje) return res.status(400).json({ error: "Mensaje vacío" });

        console.log("💬 Enviando a Gemini:", mensaje);
        
        // Comunicación con Python
        const response = await axios.post(`${PYTHON_URL}/api/chat`, { mensaje });
        res.json(response.data);

    } catch (error) {
        console.error("❌ Error IA:", error.message);
        res.status(500).json({ 
            autor: "Sistema", 
            analisis: "El cerebro de IA está desconectado temporalmente." 
        });
    }
});

// 4. Ruta de prueba técnica
app.get('/prueba-ia', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_URL}/api/chat`, {
            mensaje: "Ping de prueba desde Node"
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor NODE listo en: http://localhost:${PORT}`);
});