// authServices.js 
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.7:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export const authService = {
    async registerUser(username, email, password) {
        try {
            console.log("📤 Enviando registro:", { username, email, password });
            const response = await api.post('/auth/register', { username, email, password });
            console.log("✅ Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error en registro:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Fallo el registro en el servidor.');
        }
    },

    async loginUser(email, password) {
        try {
            console.log("📤 Enviando login:", { email });
            const response = await api.post('/auth/login', { email, password });
            console.log("✅ Respuesta del login:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error completo en login:", {
                message: error.message,
                response: error.response?.data,
                code: error.code
            });
            
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            
            throw new Error('Error en la conexión durante el login.');
        }
    }
};