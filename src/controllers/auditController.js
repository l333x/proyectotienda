const AuditLog = require('../models/AuditLog');

exports.verLogs = async (req, res) => {
    try {
        // Obtenemos los últimos 50 registros, ordenados del más nuevo al más viejo
        const logs = await AuditLog.find().sort({ fecha: -1 }).limit(50);
        
        res.render('audit_panel', { 
            logs: logs,
            titulo: 'Panel de Auditoría ISO'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener auditoría");
    }
};