// frontend/src/services/authContext.js 
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false); 

    
    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                console.log("🔄 Cargando token desde AsyncStorage...");
                const [storedToken, storedUser] = await Promise.all([
                    AsyncStorage.getItem('userToken'),
                    AsyncStorage.getItem('userData')
                ]);
                
                console.log("🔍 Token encontrado:", storedToken ? "SÍ" : "NO");
                console.log("🔍 Usuario encontrado:", storedUser ? "SÍ" : "NO");
                
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    console.log("✅ Sesión restaurada correctamente");
                } else {
                    console.log("ℹ️ No hay sesión guardada");
                }
            } catch (e) {
                console.error("❌ Error al cargar token:", e);
            } finally {
                setLoading(false);
            }
        };
        loadStoredToken();
    }, []);

    const login = async (email, password) => {
        setAuthLoading(true);
        try {
            console.log("🔑 Iniciando proceso de login...");
            const data = await authService.loginUser(email, password);
            
            console.log("💾 Guardando token en AsyncStorage...");
            
            
            await Promise.all([
                AsyncStorage.setItem('userToken', data.token),
                AsyncStorage.setItem('userData', JSON.stringify(data))
            ]);
            
            
            const savedToken = await AsyncStorage.getItem('userToken');
            console.log("✅ Token guardado correctamente:", savedToken ? "SÍ" : "NO");
            
            if (!savedToken) {
                throw new Error('Error al guardar el token en el dispositivo');
            }
            
            
            setUser(data);
            setToken(data.token);
            
            console.log("🎉 Login completado exitosamente");
            
            return data; 
        } catch (error) {
            console.error("❌ Error en login:", error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setAuthLoading(true);
        try {
            console.log("🔑 Iniciando proceso de registro...");
            const data = await authService.registerUser(username, email, password);
            
            console.log("💾 Guardando token en AsyncStorage...");
            
            
            await Promise.all([
                AsyncStorage.setItem('userToken', data.token),
                AsyncStorage.setItem('userData', JSON.stringify(data))
            ]);
            
            
            const savedToken = await AsyncStorage.getItem('userToken');
            console.log("✅ Token guardado correctamente:", savedToken ? "SÍ" : "NO");
            
            if (!savedToken) {
                throw new Error('Error al guardar el token en el dispositivo');
            }
            
            setUser(data);
            setToken(data.token);
            
            console.log("🎉 Registro completado exitosamente");
            
            return data;
        } catch (error) {
            console.error("❌ Error en registro:", error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        console.log("🚪 Cerrando sesión...");
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        setUser(null);
        setToken(null);
    };

    // Función para verificar el token actual
    const verifyToken = async () => {
        try {
            const currentToken = await AsyncStorage.getItem('userToken');
            return currentToken;
        } catch (error) {
            console.error("❌ Error al verificar token:", error);
            return null;
        }
    };

    const value = {
        user,
        token,
        loading,
        authLoading,
        login,
        register,
        logout,
        verifyToken,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};