const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// Ruta: /auditoria
router.get('/', auditController.verLogs);

module.exports = router;