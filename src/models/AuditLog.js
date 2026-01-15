const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Conecta con la tabla de Usuarios
        required: true
    },
    email_usuario: {
        type: String, // Guardamos el email por si borran el usuario, que quede registro
        required: true
    },
    accion: {
        type: String,
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'CREAR_PRODUCTO', 'EDITAR_PRODUCTO', 'COMPRA', 'SEGURIDAD']
    },
    modulo: {
        type: String, // Ej: "Autenticación", "Inventario", "Ventas"
        required: true
    },
    detalles: {
        type: String, // Descripción humana de lo que pasó
        required: true
    },
    ip: {
        type: String, // Dirección IP desde donde se hizo (Requisito de seguridad)
        default: '0.0.0.0'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);