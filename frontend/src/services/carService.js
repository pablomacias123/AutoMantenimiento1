    // frontend/src/services/carService.js 
    import axios from 'axios';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    const API_BASE_URL = 'http://192.168.1.7:5000/api';


    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log("🔑 Token obtenido en carService:", token ? `SÍ (${token.substring(0, 20)}...)` : "NO");
            return token;
        } catch (error) {
            console.error("❌ Error al obtener token:", error);
            return null;
        }
    };


    const carApi = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 15000,
    });


    carApi.interceptors.request.use(
        async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("✅ Token agregado a headers de la request");
            } else {
                console.log("❌ No se pudo agregar token - no disponible");
            }
            return config;
        },
        (error) => {
            console.error("❌ Error en interceptor de request:", error);
            return Promise.reject(error);
        }
    );


    carApi.interceptors.response.use(
        (response) => {
            console.log("✅ Response exitosa:", response.status);
            return response;
        },
        (error) => {
            console.error("❌ Error en response:", {
                status: error.response?.status,
                message: error.response?.data?.message,
                url: error.config?.url
            });
            return Promise.reject(error);
        }
    );

    export const carService = {
        
        async getCars() {
            try {
                console.log("📤 Iniciando obtención de vehículos...");
                const token = await getToken();
                if (!token) {
                    throw new Error('No hay token disponible. Por favor, inicia sesión nuevamente.');
                }

                const response = await carApi.get('/cars');
                console.log(`✅ ${response.data.length} vehículos obtenidos exitosamente`);
                return response.data;
            } catch (error) {
                console.error("❌ Error completo al obtener vehículos:", {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
                
                if (error.response?.status === 401) {
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                }
                
                throw new Error(error.response?.data?.message || 'Error al cargar vehículos');
            }
        },

        
        async createCar(carData) {
            try {
                console.log("📤 Iniciando creación de vehículo...");
                const token = await getToken();
                if (!token) {
                    throw new Error('No hay token disponible. Por favor, inicia sesión nuevamente.');
                }

                console.log("🚗 Datos del vehículo:", carData);
                const response = await carApi.post('/cars', carData);
                console.log("✅ Vehículo creado exitosamente:", response.data);
                return response.data;
            } catch (error) {
                console.error("❌ Error completo al crear vehículo:", {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
                
                if (error.response?.status === 401) {
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                }
                
                if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Datos del vehículo inválidos');
                }
                
                throw new Error(error.response?.data?.message || 'Error al crear vehículo');
            }
        },

        
        async updateCar(id, carData) {
    try {
      console.log("📤 Actualizando vehículo:", id);
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await carApi.put(`/cars/${id}`, carData);
      console.log("✅ Vehículo actualizado exitosamente");
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar vehículo:", error);
      throw new Error(error.response?.data?.message || 'Error al actualizar vehículo');
    }
  },

  // ✅ NUEVO: Eliminar vehículo
  async deleteCar(id) {
    try {
      console.log("📤 Eliminando vehículo:", id);
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await carApi.delete(`/cars/${id}`);
      console.log("✅ Vehículo eliminado exitosamente");
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar vehículo:", error);
      throw new Error(error.response?.data?.message || 'Error al eliminar vehículo');
    }
  }
};
    