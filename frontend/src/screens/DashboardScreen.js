// frontend/src/screens/DashboardScreen.js - ACTUALIZAR LA FUNCIÓN handleLogout
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../services/authContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { carService } from '../services/carService';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadCars = async () => {
        try {
            console.log("🔄 Cargando vehículos...");
            const carsData = await carService.getCars();
            setCars(carsData);
            console.log(`✅ ${carsData.length} vehículos cargados`);
        } catch (error) {
            console.error("❌ Error cargando vehículos:", error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadCars();
    };

    useEffect(() => {
        const initializeDashboard = async () => {
            if (isFocused) {
                setTimeout(() => {
                    loadCars();
                }, 1000);
            }
        };
        
        initializeDashboard();
    }, [isFocused]);

    // ✅ ACTUALIZAR: Función de cierre de sesión mejorada
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { 
                    text: "Cancelar", 
                    style: "cancel" 
                },
                { 
                    text: "Sí, Cerrar Sesión", 
                    onPress: async () => {
                        try {
                            console.log("🚪 Cerrando sesión...");
                            
                            // Ejecutar logout (limpia AsyncStorage y estado)
                            await logout();
                            
                            console.log("✅ Sesión cerrada, redirigiendo a Login...");
                            
                            // ✅ Navegar a Login y resetear el stack de navegación
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                            
                        } catch (error) {
                            console.error("❌ Error durante logout:", error);
                            Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
                        }
                    }
                }
            ]
        );
    };

    const handleAddCar = () => {
        navigation.navigate('AddCar');
    };

    const handleEditCar = (car) => {
        navigation.navigate('EditCar', { car });
    };

    const handleCarPress = (car) => {
        Alert.alert(
            `${car.brand} ${car.model}`,
            `Placa: ${car.licensePlate}\nAño: ${car.year}\nKilometraje: ${car.mileage} km\nCombustible: ${car.fuelType}`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Editar", onPress: () => handleEditCar(car) }
            ]
        );
    };

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.welcome}>Bienvenido, {user?.username} 👋</Text>
            
            {/* Sección de Vehículos */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tus Vehículos</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCar}>
                        <Text style={styles.addButtonText}>+ Agregar</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <Text style={styles.loading}>Cargando vehículos...</Text>
                ) : cars.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No tienes vehículos registrados</Text>
                        <Text style={styles.emptySubtext}>
                            Agrega tu primer vehículo para comenzar a gestionar sus mantenimientos
                        </Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddCar}>
                            <Text style={styles.emptyButtonText}>Agregar Primer Vehículo</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    cars.map(car => (
                        <TouchableOpacity 
                            key={car._id} 
                            style={styles.carCard}
                            onPress={() => handleCarPress(car)}
                        >
                            <View style={styles.carHeader}>
                                <Text style={styles.carName}>{car.brand} {car.model}</Text>
                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={() => handleEditCar(car)}
                                >
                                    <Ionicons name="create-outline" size={20} color="#4CAF50" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.carDetails}>Año: {car.year} • {car.licensePlate}</Text>
                            <Text style={styles.carDetails}>Kilometraje: {car.mileage} km • {car.fuelType}</Text>
                            {car.color && <Text style={styles.carDetails}>Color: {car.color}</Text>}
                        </TouchableOpacity>
                    ))
                )}
            </View>

            {/* ✅ Botón de Cerrar Sesión MEJORADO */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="white" style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A3B',
        marginBottom: 10,
        textAlign: 'center',
    },
    welcome: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A3B',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loading: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginVertical: 20,
    },
    emptyState: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtext: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        marginBottom: 20,
    },
    emptyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    carCard: {
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    carHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    carName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E3A3B',
        flex: 1,
    },
    editButton: {
        padding: 5,
    },
    carDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    // ✅ ESTILOS MEJORADOS para el botón de logout
    logoutButton: {
        backgroundColor: '#FF6B6B',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DashboardScreen;