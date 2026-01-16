const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const bcrypt = require('bcryptjs');
const logAudit = require('../utils/logger');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (user) return res.render('auth', { error: 'El correo ya está registrado.' });

        user = new User({ nombre, email, password });
        await user.save();
        
        // Auditoría
        await logAudit(user._id, user.email, 'REGISTRO', 'AUTH', 'Usuario registrado', req.ip);

        // Correo
        const mensajeHTML = `<h1>¡Bienvenido a GamerVision! 🎮</h1><p>Hola ${nombre}, tu cuenta ha sido creada.</p>`;
        sendEmail(email, 'Bienvenido a GamerVision', mensajeHTML).catch(console.error);
        
        // Exito -> Mostrar mensaje en la misma pantalla de auth
        res.render('auth', { success: 'Cuenta creada. Inicia sesión para entrar.' });

    } catch (error) {
        res.render('auth', { error: 'Error en registro.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.render('auth', { error: 'Credenciales inválidas.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('auth', { error: 'Credenciales inválidas.' });

        await logAudit(user._id, user.email, 'LOGIN', 'AUTH', 'Login exitoso', req.ip);

        // REDIRECCIÓN: Al Index (/home) como pediste
        res.redirect('/home');

    } catch (error) {
        res.render('auth', { error: 'Error al iniciar sesión.' });
    }
};

exports.logout = async (req, res) => {
    try {
        const emailUsuario = req.query.email || 'Desconocido';
        await logAudit(null, emailUsuario, 'LOGOUT', 'AUTH', 'Cierre de sesión', req.ip);
        res.render('auth', { success: 'Sesión cerrada correctamente.' });
    } catch (error) {
        res.redirect('/auth/login');
    }
};