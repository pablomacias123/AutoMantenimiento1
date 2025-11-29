// backend/models/Car.js
import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: [true, 'La marca es obligatoria'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'El modelo es obligatorio'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'El año es obligatorio'],
        min: [1900, 'El año debe ser mayor a 1900'],
        max: [new Date().getFullYear() + 1, 'El año no puede ser futuro']
    },
    licensePlate: {
        type: String,
        required: [true, 'La placa es obligatoria'],
        unique: true,
        trim: true,
        uppercase: true
    },
    color: {
        type: String,
        trim: true
    },
    mileage: {
        type: Number,
        default: 0,
        min: 0
    },
    fuelType: {
        type: String,
        enum: ['gasolina', 'diésel', 'eléctrico', 'híbrido', 'gas'],
        default: 'gasolina'
    }
}, {
    timestamps: true
});

export default mongoose.model('Car', CarSchema);