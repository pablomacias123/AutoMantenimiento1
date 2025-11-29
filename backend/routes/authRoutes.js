// authRoutes.js - CORRIGE LA PARTE DEL LOGIN
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ 
            message: 'Por favor ingrese nombre de usuario, email y contraseña.' 
        });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const user = await User.create({ username, email, password });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: error.message 
        });
    }
});

// @route   POST /api/auth/login
// @desc    Autentica un usuario y obtiene un token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("📨 Login attempt:", { email }); // ← DEBUG

    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor ingrese email y contraseña.' });
    }

    try {
        // ✅ CORRECCIÓN: Usa .select('+password') para incluir la contraseña
        const user = await User.findOne({ email }).select('+password');
        
        console.log("🔍 Usuario encontrado:", user ? "Sí" : "No"); // ← DEBUG

        if (user && (await user.matchPassword(password))) {
            console.log("✅ Contraseña correcta"); // ← DEBUG
            
            res.json({
                _id: user._id,
                username: user.username, // ← Asegúrate de incluir username
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            console.log("❌ Credenciales inválidas"); // ← DEBUG
            res.status(401).json({ message: 'Credenciales inválidas.' });
        }
    } catch (error) {
        console.error("❌ Error completo en login:", error); // ← DEBUG detallado
        res.status(500).json({ 
            message: 'Error en el servidor durante el login.',
            error: error.message 
        });
    }
});

export default router;