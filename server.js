const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
require('dotenv').config();

// Importar rutas de autenticación
const authRoutes = require('./src/routes/authRoutes'); // NUEVO

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

// --- RUTAS ---
app.use('/auth', authRoutes); // NUEVO: Todo lo que sea /auth va al archivo de rutas

app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'GamerVision - Home',
        mensaje: 'Bienvenido al sistema híbrido'
    });
});

// ... (El resto de tu código de prueba-ia sigue igual abajo) ...
app.get('/prueba-ia', async (req, res) => {
     // ... tu código existente ...
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