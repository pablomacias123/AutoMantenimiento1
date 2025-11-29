// backend/routes/carRoutes.js - VERSIÓN CORREGIDA
import express from 'express';
import Car from '../models/Car.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Middleware de autenticación REAL con JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];
            
            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Agregar user al request
            req.user = { _id: decoded.id };
            next();
        } catch (error) {
            console.error('Token inválido:', error);
            return res.status(401).json({ message: 'Token no válido' });
        }
    } else {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }
};

// POST /api/cars: Crear nuevo vehículo
router.post('/', protect, async (req, res) => {
    try {
        console.log("📨 Creando vehículo:", req.body);
        
        // ✅ CORRECCIÓN: Usa los campos correctos de Car.js
        const { brand, model, year, licensePlate, color, mileage, fuelType } = req.body;

        // Validación de campos obligatorios
        if (!brand || !model || !year || !licensePlate) {
            return res.status(400).json({ 
                message: 'Faltan campos obligatorios: marca, modelo, año y placa' 
            });
        }

        const newCar = new Car({
            brand,
            model, 
            year,
            licensePlate: licensePlate.toUpperCase(),
            color,
            mileage: mileage || 0,
            fuelType: fuelType || 'gasolina',
            user: req.user._id // ✅ CORRECCIÓN: usa 'user' no 'userId'
        });

        const savedCar = await newCar.save();
        
        // Populate para devolver datos completos
        await savedCar.populate('user', 'username email');
        
        res.status(201).json(savedCar);

    } catch (error) {
        console.error("❌ Error al crear vehículo:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'La placa ya está registrada' });
        }
        
        res.status(500).json({ 
            message: 'Error en el servidor', 
            error: error.message 
        });
    }
});

// GET /api/cars: Obtener todos los vehículos del usuario
router.get('/', protect, async (req, res) => {
    try {
        const cars = await Car.find({ user: req.user._id })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
            
        res.json(cars);
    } catch (error) {
        console.error("❌ Error al obtener vehículos:", error);
        res.status(500).json({ 
            message: 'Error al obtener vehículos',
            error: error.message 
        });
    }
});

// GET /api/cars/:id - Obtener un vehículo específico
router.get('/:id', protect, async (req, res) => {
    try {
        const car = await Car.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        }).populate('user', 'username email');
        
        if (!car) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        
        res.json(car);
    } catch (error) {
        console.error("❌ Error al obtener vehículo:", error);
        res.status(500).json({ 
            message: 'Error al obtener vehículo',
            error: error.message 
        });
    }
});

// PUT /api/cars/:id - Actualizar vehículo
router.put('/:id', protect, async (req, res) => {
    try {
        const car = await Car.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'username email');
        
        if (!car) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        
        res.json(car);
    } catch (error) {
        console.error("❌ Error al actualizar vehículo:", error);
        res.status(500).json({ 
            message: 'Error al actualizar vehículo',
            error: error.message 
        });
    }
});

// DELETE /api/cars/:id - Eliminar vehículo
router.delete('/:id', protect, async (req, res) => {
    try {
        const car = await Car.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!car) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        
        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        console.error("❌ Error al eliminar vehículo:", error);
        res.status(500).json({ 
            message: 'Error al eliminar vehículo',
            error: error.message 
        });
    }
});

export default router;