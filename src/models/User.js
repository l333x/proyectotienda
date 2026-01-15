const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // No puede haber dos usuarios con el mismo correo
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['cliente', 'admin'], // Solo permitimos estos dos roles
        default: 'cliente'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

// --- ENCRIPTACIÓN AUTOMÁTICA ---
// Antes de guardar (save), encriptamos la contraseña
UserSchema.pre('save', async function(next) {
    // Si la contraseña no se modificó, no hacemos nada
    if (!this.isModified('password')) {
        next();
    }
    // Generamos la "sal" y encriptamos
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);