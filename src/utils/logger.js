const AuditLog = require('../models/AuditLog');

/**
 * Función centralizada para registrar auditoría (Norma ISO)
 * @param {string} userId - ID de MongoDB del usuario
 * @param {string} userEmail - Correo del usuario (para redundancia)
 * @param {string} action - Qué hizo (LOGIN, COMPRA, UPDATE)
 * @param {string} module - En qué parte del sistema (AUTH, TIENDA)
 * @param {string} details - Explicación humana
 * @param {string} ip - Dirección IP del usuario
 */
const logAudit = async (userId, userEmail, action, module, details, ip) => {
    try {
        // Limpiamos la IP si viene en formato IPv6 híbrido (::ffff:127.0.0.1)
        const cleanIp = ip ? ip.replace('::ffff:', '') : '0.0.0.0';

        await AuditLog.create({
            usuario: userId,
            email_usuario: userEmail,
            accion: action,
            modulo: module,
            detalles: details,
            ip: cleanIp
        });
        
        // Mensaje en consola para que sepas que funciona
        console.log(`📝 [AUDITORÍA] ${action} registrada: ${userEmail}`);
    } catch (error) {
        // Si falla el log, NO detenemos el servidor, solo avisamos en consola
        console.error("⚠️ Falló el registro de auditoría:", error.message);
    }
};

module.exports = logAudit;