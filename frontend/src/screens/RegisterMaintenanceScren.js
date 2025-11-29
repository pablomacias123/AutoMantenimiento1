import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaintenanceController } from '../controllers/MaintenanceController'; 

const RegisterMaintenanceScreen = () => {
    
    const route = useRoute();
    const { carId } = route.params || { carId: '60c72b2f9f1b2c001c3b5d2e' }; 

    const [serviceType, setServiceType] = useState('');
    const [mileage, setMileage] = useState('');
    const [date, setDate] = useState('Hoy'); 
    const [cost, setCost] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleGuardar = async () => {
        if (!serviceType || !mileage || !cost) {
            Alert.alert("Error", "Por favor completa el Tipo de Servicio, Kilometraje y Costo.");
            return;
        }

        setLoading(true);
        
        const maintenanceData = {
            serviceType,
            mileage: Number(mileage),
            date, 
            cost: Number(cost),
            
        };

        try {
            // Llama al Controlador 
            const result = await MaintenanceController.handleSaveMaintenance(carId, maintenanceData);
            
            if (result.success) {
                Alert.alert("Éxito", "Mantenimiento registrado y notificaciones actualizadas.");
                navigation.goBack(); 
            } else {
                Alert.alert("Error", result.message || "Fallo al guardar el mantenimiento.");
            }
        } catch (error) {
            Alert.alert("Error", "Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Registrar Mantenimiento</Text>
            <Text style={styles.subHeader}>Cubre 24hrs</Text>

            {/* Campo Tipo de Servicio */}
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Tipo de Servicio</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Cambio de Aceite, Frenos"
                    value={serviceType}
                    onChangeText={setServiceType}
                />
            </View>

            {/* Campo Kilometraje */}
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Kilometraje</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Kilomerate (km)"
                    value={mileage}
                    onChangeText={setMileage}
                    keyboardType="numeric"
                />
            </View>
            
            {/* Campo Fecha (Simplificado) */}
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Fecha</Text>
                <TouchableOpacity style={styles.input} onPress={() => Alert.alert("Función", "Aquí se abriría el DatePicker.")}>
                    <Text>{date}</Text>
                </TouchableOpacity>
            </View>

            {/* Campo Costo (CLP) */}
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Costo (CLP)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Costo"
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="numeric"
                />
            </View>

            {/* Adjuntar Factura/Foto (Placeholder) */}
            <TouchableOpacity style={styles.attachmentButton}>
                <Text style={styles.attachmentText}>📷 Adjuntar Factura/Foto</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
            ) : (
                <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: '#F8F8F8' },
    header: { fontSize: 28, fontWeight: 'bold', color: '#1E3A3B', marginBottom: 5 },
    subHeader: { fontSize: 16, color: 'gray', marginBottom: 30 },
    fieldContainer: { marginBottom: 15 },
    fieldLabel: { fontSize: 16, fontWeight: '500', marginBottom: 5, color: '#1E3A3B' },
    input: {
        height: 50, backgroundColor: 'white', borderRadius: 10,
        paddingHorizontal: 15, justifyContent: 'center', fontSize: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 1, elevation: 2,
    },
    attachmentButton: {
        backgroundColor: '#E8E8E8', borderRadius: 10, padding: 15,
        alignItems: 'center', marginVertical: 20,
    },
    attachmentText: { color: '#1E3A3B', fontWeight: 'bold' },
    saveButton: {
        backgroundColor: '#66BB6A', borderRadius: 25, padding: 15,
        alignItems: 'center', marginTop: 30,
    },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    loadingIndicator: { marginVertical: 30 }
});

export default RegisterMaintenanceScreen;