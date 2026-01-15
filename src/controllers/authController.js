const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const bcrypt = require('bcryptjs');
const logAudit = require('../utils/logger'); // Importamos el Logger de Auditoría

// --- REGISTRAR USUARIO ---
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Verificar si ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.render('auth', { error: 'El correo ya está registrado.', titulo: 'Acceso' });
        }

        // 2. Crear nuevo usuario (La encriptación pasa automática en el Modelo)
        user = new User({ nombre, email, password });
        await user.save();

        // 3. AUDITORÍA (Norma ISO): Registramos que se creó un usuario
        // Usamos req.ip para saber desde dónde se registró
        await logAudit(user._id, user.email, 'REGISTRO', 'AUTH', 'Usuario registrado exitosamente', req.ip);

        // 4. Enviar Notificación al Correo
        const mensajeHTML = `
            <h1>¡Bienvenido a GamerVision! 🎮</h1>
            <p>Hola ${nombre}, tu cuenta ha sido creada exitosamente.</p>
            <p><strong>Usuario:</strong> ${email}</p>
            <p>Recuerda que monitoreamos la seguridad bajo normas ISO.</p>
        `;
        await sendEmail(email, 'Bienvenido a GamerVision', mensajeHTML);
        
        console.log(`👤 Usuario creado: ${email}`);

        // 5. Redirigir al login con éxito
        res.render('auth', { success: 'Cuenta creada. Por favor inicia sesión.', titulo: 'Acceso' });

    } catch (error) {
        console.error(error);
        res.render('auth', { error: 'Error en el servidor al registrar.', titulo: 'Acceso' });
    }
};

// --- LOGIN USUARIO ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth', { error: 'Credenciales inválidas.', titulo: 'Acceso' });
        }

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // AUDITORÍA: Podríamos registrar intentos fallidos también si quisieras ser muy estricto
            return res.render('auth', { error: 'Credenciales inválidas.', titulo: 'Acceso' });
        }

        // 3. AUDITORÍA (Norma ISO): Registramos el login exitoso
        await logAudit(user._id, user.email, 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', req.ip);

        // ¡ÉXITO!
        console.log(`🔓 Login exitoso: ${email}`);
        res.redirect('/'); 

    } catch (error) {
        console.error(error);
        res.render('auth', { error: 'Error al iniciar sesión.', titulo: 'Acceso' });
    }
};