const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Teclados', 'Mouse', 'Monitores', 'Componentes', 'Laptops', 'Audio']
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    imagen: {
        type: String, // Guardaremos la URL de la imagen
        default: 'https://via.placeholder.com/300?text=Sin+Imagen'
    },
    creado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Para saber qué admin creó este producto (Auditoría)
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);