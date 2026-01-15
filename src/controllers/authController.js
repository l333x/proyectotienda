const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const bcrypt = require('bcryptjs');
const logAudit = require('../utils/logger');

// --- REGISTRAR USUARIO ---
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.render('auth', { error: 'El correo ya está registrado.', titulo: 'Acceso' });
        }

        user = new User({ nombre, email, password });
        await user.save();

        await logAudit(user._id, user.email, 'REGISTRO', 'AUTH', 'Usuario registrado', req.ip);

        // Notificación de correo
        const mensajeHTML = `<h1>¡Bienvenido a GamerVision! 🎮</h1><p>Cuenta creada exitosamente para ${email}</p>`;
        sendEmail(email, 'Bienvenido a GamerVision', mensajeHTML).catch(console.error);
        
        res.render('auth', { success: 'Cuenta creada. Inicia sesión.', titulo: 'Acceso' });

    } catch (error) {
        console.error(error);
        res.render('auth', { error: 'Error en registro.', titulo: 'Acceso' });
    }
};

// --- LOGIN USUARIO ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.render('auth', { error: 'Credenciales inválidas.', titulo: 'Acceso' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('auth', { error: 'Credenciales inválidas.', titulo: 'Acceso' });

        // AUDITORÍA LOGIN
        await logAudit(user._id, user.email, 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', req.ip);

        // CORRECCIÓN BUCLE: Redirigir a TIENDA, no a la raíz
        res.redirect('/tienda'); 

    } catch (error) {
        console.error(error);
        res.render('auth', { error: 'Error al iniciar sesión.', titulo: 'Acceso' });
    }
};

// --- LOGOUT (CERRAR SESIÓN) ---
exports.logout = async (req, res) => {
    try {
        // Como no usamos cookies aún, pasamos el email por URL para auditar quién salió
        // Ejemplo: /auth/logout?email=juan@gmail.com
        const emailUsuario = req.query.email || 'Desconocido';
        
        // AUDITORÍA LOGOUT
        // Usamos un ID dummy (null) porque quizás no tenemos el ID a mano en el logout simple
        await logAudit(null, emailUsuario, 'LOGOUT', 'AUTH', 'Cierre de sesión voluntario', req.ip);

        console.log(`👋 Usuario salió: ${emailUsuario}`);
        
        // Redirigir al Login con mensaje
        res.render('auth', { success: 'Sesión cerrada correctamente.', titulo: 'Acceso' });

    } catch (error) {
        console.error(error);
        res.redirect('/auth/login');
    }
};