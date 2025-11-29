import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';


import authRoutes from './routes/authRoutes.js'; 

import carRoutes from './routes/carRoutes.js';


dotenv.config();


const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Conectado a MongoDB`);
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connectDB(); // Llamada a la función de conexión

const app = express();

// Middlewares
app.use(express.json()); // Permite aceptar datos JSON en el cuerpo 
app.use(cors()); // Permite el acceso desde el frontend

// ************ CORRECCIÓN CLAVE: USAR RUTAS ************
// Definir la ruta base para la autenticación
app.use('/api/auth', authRoutes); 

app.use('/api/cars', carRoutes);

app.get('/', (req, res) => {
    res.send('API de AutoMantenimiento está corriendo...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});