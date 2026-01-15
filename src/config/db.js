const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Intenta conectar usando la clave del archivo .env
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Estas opciones aseguran compatibilidad con versiones nuevas
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`🍃 MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error conectando a MongoDB: ${error.message}`);
        process.exit(1); // Detiene el servidor si no hay base de datos
    }
};

module.exports = connectDB;