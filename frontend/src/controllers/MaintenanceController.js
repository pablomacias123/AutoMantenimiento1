import { api } from '../services/api'; 
import { Alert } from 'react-native';


export const MaintenanceController = {

    async registerMaintenance(carId, serviceData) {
        
        const { serviceType, mileage, cost, date } = serviceData;

        // 1. Validación de entrada 
        if (!serviceType || !mileage || !carId) {
            throw new Error("Faltan datos requeridos (Tipo de servicio, Kilometraje o ID de Vehículo).");
        }

        try {
            // 2. Llama al API: POST 
            const response = await api.post('/maintenance', {
                carId,
                serviceType,
                mileage: Number(mileage),
                cost: Number(cost),
                date,
                
            });
            
            return response.data;

        } catch (error) {
            // 3. Manejo de errores de la API
            Alert.alert(
                "Error de Registro",
                error.response?.data?.message || "No se pudo conectar con el servidor para registrar el mantenimiento."
            );
            throw error;
        }
    },
    
    
};
