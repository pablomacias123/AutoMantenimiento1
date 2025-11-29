//Estas son las apis
import axios from 'axios';

const API_BASE_URL = 'http://TU_IP_LOCAL:5000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  },
});

export const carService = {
  
  getCars: async () => {
    try {
      const response = await api.get('/cars');
      return response.data; 
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  },
  
  
  addCar: async (carData) => {
    
    const response = await api.post('/cars', carData);
    return response.data;
  }
};