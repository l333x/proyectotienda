const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Definir Modelos (Necesitamos saber qué bajar)
// Nota: Importamos los esquemas que ya definiste
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const AuditLog = require('./src/models/AuditLog');

const backupDB = async () => {
    try {
        console.log("📦 Iniciando Backup de GamerVision...");
        
        // 1. Conectar a Mongo
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a BD");

        // 2. Obtener datos
        const users = await User.find().lean();
        const products = await Product.find().lean();
        const audits = await AuditLog.find().lean();

        const fullBackup = {
            fecha: new Date(),
            total_usuarios: users.length,
            total_productos: products.length,
            data: {
                users,
                products,
                audits
            }
        };

        // 3. Crear carpeta backups si no existe
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        // 4. Guardar archivo con fecha
        const fechaStr = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const fileName = path.join(backupDir, `backup_${fechaStr}.json`);
        
        fs.writeFileSync(fileName, JSON.stringify(fullBackup, null, 2));
        
        console.log(`💾 Backup guardado exitosamente en:\n   ${fileName}`);
        
        process.exit(0);

    } catch (error) {
        console.error("❌ Error en Backup:", error);
        process.exit(1);
    }
};

backupDB();
