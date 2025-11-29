// frontend/src/screens/EditCarScreen.js - NUEVO ARCHIVO
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { carService } from '../services/carService';

const EditCarScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params;
    
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        licensePlate: '',
        color: '',
        mileage: '',
        fuelType: 'gasolina'
    });
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const fuelTypes = [
        { label: 'Gasolina', value: 'gasolina' },
        { label: 'Diésel', value: 'diésel' },
        { label: 'Eléctrico', value: 'eléctrico' },
        { label: 'Híbrido', value: 'híbrido' },
        { label: 'Gas', value: 'gas' }
    ];

    useEffect(() => {
        if (car) {
            setFormData({
                brand: car.brand || '',
                model: car.model || '',
                year: car.year ? car.year.toString() : '',
                licensePlate: car.licensePlate || '',
                color: car.color || '',
                mileage: car.mileage ? car.mileage.toString() : '',
                fuelType: car.fuelType || 'gasolina'
            });
        }
    }, [car]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.brand.trim()) newErrors.brand = 'La marca es obligatoria';
        if (!formData.model.trim()) newErrors.model = 'El modelo es obligatorio';
        if (!formData.year) newErrors.year = 'El año es obligatorio';
        if (!formData.licensePlate.trim()) newErrors.licensePlate = 'La placa es obligatoria';
        
        if (formData.year) {
            const currentYear = new Date().getFullYear();
            const yearNum = parseInt(formData.year);
            if (yearNum < 1900 || yearNum > currentYear + 1) {
                newErrors.year = `El año debe estar entre 1900 y ${currentYear + 1}`;
            }
        }
        
        if (formData.mileage && formData.mileage < 0) {
            newErrors.mileage = 'El kilometraje no puede ser negativo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Por favor corrige los errores en el formulario');
            return;
        }

        setSaving(true);
        
        try {
            const carData = {
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                year: parseInt(formData.year),
                licensePlate: formData.licensePlate.trim(),
                color: formData.color.trim(),
                mileage: formData.mileage ? parseInt(formData.mileage) : 0,
                fuelType: formData.fuelType
            };

            await carService.updateCar(car._id, carData);
            
            Alert.alert(
                '¡Éxito!',
                'Vehículo actualizado correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
            
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Vehículo',
            `¿Estás seguro de que quieres eliminar ${car.brand} ${car.model}? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: confirmDelete 
                }
            ]
        );
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await carService.deleteCar(car._id);
            
            Alert.alert(
                '¡Eliminado!',
                'Vehículo eliminado correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Dashboard')
                    }
                ]
            );
            
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Editar Vehículo</Text>
            <Text style={styles.subtitle}>Modifica la información de tu vehículo</Text>

            {/* Campos del formulario (igual que AddCarScreen) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Marca *</Text>
                <TextInput
                    style={[styles.input, errors.brand && styles.inputError]}
                    placeholder="Ej: Toyota, Honda, Ford..."
                    value={formData.brand}
                    onChangeText={(value) => handleInputChange('brand', value)}
                    editable={!saving}
                />
                {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Modelo *</Text>
                <TextInput
                    style={[styles.input, errors.model && styles.inputError]}
                    placeholder="Ej: Corolla, Civic, F-150..."
                    value={formData.model}
                    onChangeText={(value) => handleInputChange('model', value)}
                    editable={!saving}
                />
                {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Año *</Text>
                <TextInput
                    style={[styles.input, errors.year && styles.inputError]}
                    placeholder="Ej: 2020"
                    value={formData.year}
                    onChangeText={(value) => handleInputChange('year', value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={4}
                    editable={!saving}
                />
                {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Placa *</Text>
                <TextInput
                    style={[styles.input, errors.licensePlate && styles.inputError]}
                    placeholder="Ej: ABC123"
                    value={formData.licensePlate}
                    onChangeText={(value) => handleInputChange('licensePlate', value.toUpperCase())}
                    autoCapitalize="characters"
                    editable={!saving}
                />
                {errors.licensePlate && <Text style={styles.errorText}>{errors.licensePlate}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Rojo, Azul, Negro..."
                    value={formData.color}
                    onChangeText={(value) => handleInputChange('color', value)}
                    editable={!saving}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Kilometraje</Text>
                <TextInput
                    style={[styles.input, errors.mileage && styles.inputError]}
                    placeholder="Ej: 15000"
                    value={formData.mileage}
                    onChangeText={(value) => handleInputChange('mileage', value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    editable={!saving}
                />
                {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Combustible</Text>
                <View style={styles.fuelTypeContainer}>
                    {fuelTypes.map((fuel) => (
                        <TouchableOpacity
                            key={fuel.value}
                            style={[
                                styles.fuelTypeButton,
                                formData.fuelType === fuel.value && styles.fuelTypeButtonSelected
                            ]}
                            onPress={() => handleInputChange('fuelType', fuel.value)}
                            disabled={saving}
                        >
                            <Text style={[
                                styles.fuelTypeText,
                                formData.fuelType === fuel.value && styles.fuelTypeTextSelected
                            ]}>
                                {fuel.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.deleteButton, saving && styles.buttonDisabled]}
                    onPress={handleDelete}
                    disabled={saving}
                >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cancelButton, saving && styles.buttonDisabled]}
                    onPress={() => navigation.goBack()}
                    disabled={saving}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.buttonDisabled]}
                    onPress={handleUpdate}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.submitButtonText}>Actualizar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A3B',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E3A3B',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#F8F8F8',
    },
    inputError: {
        borderColor: '#FF6B6B',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        marginTop: 5,
    },
    fuelTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    fuelTypeButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#F8F8F8',
    },
    fuelTypeButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    fuelTypeText: {
        fontSize: 14,
        color: '#666',
    },
    fuelTypeTextSelected: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 30,
        marginBottom: 20,
    },
    deleteButton: {
        flex: 1,
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#FF6B6B',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        flex: 2,
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

export default EditCarScreen;