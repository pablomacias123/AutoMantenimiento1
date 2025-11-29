// frontend/src/screens/AlertsScreen.js - ACTUALIZAR
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { notificationService } from '../services/notificationService';
import { carService } from '../services/carService';

const AlertsScreen = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState([]);

    useEffect(() => {
        loadData();
        initializeNotifications();
    }, []);

    const initializeNotifications = async () => {
        await notificationService.requestPermissions();
    };

    const loadData = async () => {
        try {
            const carsData = await carService.getCars();
            setCars(carsData);
            generateAlerts(carsData);
        } catch (error) {
            console.error("Error cargando datos:", error);
            Alert.alert("Error", "No se pudieron cargar los vehículos");
        } finally {
            setLoading(false);
        }
    };

    const generateAlerts = (carsData) => {
        const generatedAlerts = [];
        
        carsData.forEach(car => {
            // Alerta de cambio de aceite (cada 5000 km)
            if (car.mileage && car.mileage % 5000 >= 4500) {
                generatedAlerts.push({
                    id: `oil-${car._id}`,
                    type: 'warning',
                    title: 'Próximo Cambio de Aceite',
                    message: `${car.brand} ${car.model} - Vence en ${5000 - (car.mileage % 5000)} km`,
                    action: 'Programar',
                    carId: car._id
                });
            }

            // Alerta de revisión general (cada 10000 km)
            if (car.mileage && car.mileage % 10000 >= 9500) {
                generatedAlerts.push({
                    id: `review-${car._id}`,
                    type: 'error',
                    title: 'Revisión General Próxima',
                    message: `${car.brand} ${car.model} - Vence en ${10000 - (car.mileage % 10000)} km`,
                    action: 'Revisar',
                    carId: car._id
                });
            }

            // Alerta de neumáticos (cada 15000 km)
            if (car.mileage && car.mileage % 15000 >= 14500) {
                generatedAlerts.push({
                    id: `tires-${car._id}`,
                    type: 'info',
                    title: 'Rotación de Neumáticos',
                    message: `${car.brand} ${car.model} - Próxima en ${15000 - (car.mileage % 15000)} km`,
                    action: 'Rotar',
                    carId: car._id
                });
            }
        });

        // Si no hay alertas, mostrar mensaje
        if (generatedAlerts.length === 0) {
            generatedAlerts.push({
                id: 'no-alerts',
                type: 'info',
                title: 'Sin Alertas',
                message: 'No hay mantenimientos pendientes por el momento',
                action: 'OK'
            });
        }

        setAlerts(generatedAlerts);
    };

    const handleAction = async (alert) => {
        if (alert.action === 'Programar') {
            // Programar notificación para cambio de aceite
            const car = cars.find(c => c._id === alert.carId);
            if (car) {
                await notificationService.scheduleMaintenanceReminder(car, 'cambio de aceite', 3);
                Alert.alert('✅ Recordatorio programado', 'Te notificaremos en 3 días');
            }
        } else if (alert.action === 'Revisar') {
            Alert.alert('📅 Revisión', '¿Quieres agendar una revisión en tu taller de confianza?');
        } else if (alert.action === 'Rotar') {
            Alert.alert('🛞 Neumáticos', 'Recuerda rotar los neumáticos cada 15,000 km');
        }
    };

    const AlertItem = ({ alert }) => {
        const colorMap = {
            warning: '#FFC107',
            error: '#D32F2F',
            info: '#2196F3',
        };
        
        const iconMap = {
            warning: '⚠️',
            error: '🔴',
            info: '🔔',
        };

        return (
            <View style={[styles.alertCard, { borderLeftColor: colorMap[alert.type] }]}>
                <View style={styles.alertIcon}>
                    <Text style={{ fontSize: 24 }}>{iconMap[alert.type]}</Text>
                </View>
                <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.alertActionButton}
                    onPress={() => handleAction(alert)}
                >
                    <Text style={styles.actionText}>{alert.action}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#1E3A3B" style={styles.loadingContainer} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Alertas y Recordatorios</Text>
            <Text style={styles.subtitle}>Mantenimientos pendientes para tus vehículos</Text>
            
            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AlertItem alert={item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff', 
        padding: 15 
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center' 
    },
    header: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#1E3A3B', 
        marginBottom: 5 
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    alertCard: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white',
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 10, 
        borderLeftWidth: 5, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        elevation: 2,
    },
    alertIcon: { 
        marginRight: 15 
    },
    alertContent: { 
        flex: 1 
    },
    alertTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#1E3A3B' 
    },
    alertMessage: { 
        fontSize: 13, 
        color: 'gray', 
        marginTop: 3 
    },
    alertActionButton: { 
        marginLeft: 10, 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        backgroundColor: '#E8E8E8', 
        borderRadius: 5 
    },
    actionText: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        color: '#1E3A3B' 
    },
});

export default AlertsScreen;