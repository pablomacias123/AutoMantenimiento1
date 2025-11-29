// frontend/src/screens/AddCarScreen.js
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { carService } from '../services/carService';

const AddCarScreen = () => {
    const navigation = useNavigation();
    
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
    const [errors, setErrors] = useState({});

    const fuelTypes = [
        { label: 'Gasolina', value: 'gasolina' },
        { label: 'Diésel', value: 'diésel' },
        { label: 'Eléctrico', value: 'eléctrico' },
        { label: 'Híbrido', value: 'híbrido' },
        { label: 'Gas', value: 'gas' }
    ];

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Por favor corrige los errores en el formulario');
            return;
        }

        setLoading(true);
        
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

            await carService.createCar(carData);
            
            Alert.alert(
                '¡Éxito!',
                'Vehículo agregado correctamente',
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
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Agregar Vehículo</Text>
            <Text style={styles.subtitle}>Completa la información de tu vehículo</Text>

            {/* Marca */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Marca *</Text>
                <TextInput
                    style={[styles.input, errors.brand && styles.inputError]}
                    placeholder="Ej: Toyota, Honda, Ford..."
                    value={formData.brand}
                    onChangeText={(value) => handleInputChange('brand', value)}
                    editable={!loading}
                />
                {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            {/* Modelo */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Modelo *</Text>
                <TextInput
                    style={[styles.input, errors.model && styles.inputError]}
                    placeholder="Ej: Corolla, Civic, F-150..."
                    value={formData.model}
                    onChangeText={(value) => handleInputChange('model', value)}
                    editable={!loading}
                />
                {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            {/* Año */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Año *</Text>
                <TextInput
                    style={[styles.input, errors.year && styles.inputError]}
                    placeholder="Ej: 2020"
                    value={formData.year}
                    onChangeText={(value) => handleInputChange('year', value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={4}
                    editable={!loading}
                />
                {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            {/* Placa */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Placa *</Text>
                <TextInput
                    style={[styles.input, errors.licensePlate && styles.inputError]}
                    placeholder="Ej: ABC123"
                    value={formData.licensePlate}
                    onChangeText={(value) => handleInputChange('licensePlate', value.toUpperCase())}
                    autoCapitalize="characters"
                    editable={!loading}
                />
                {errors.licensePlate && <Text style={styles.errorText}>{errors.licensePlate}</Text>}
            </View>

            {/* Color */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Rojo, Azul, Negro..."
                    value={formData.color}
                    onChangeText={(value) => handleInputChange('color', value)}
                    editable={!loading}
                />
            </View>

            {/* Kilometraje */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Kilometraje</Text>
                <TextInput
                    style={[styles.input, errors.mileage && styles.inputError]}
                    placeholder="Ej: 15000"
                    value={formData.mileage}
                    onChangeText={(value) => handleInputChange('mileage', value.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    editable={!loading}
                />
                {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
            </View>

            {/* Tipo de Combustible */}
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
                            disabled={loading}
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

            {/* Botones */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.cancelButton, loading && styles.buttonDisabled]}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.submitButtonText}>Agregar Vehículo</Text>
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
        gap: 15,
        marginTop: 30,
        marginBottom: 20,
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

export default AddCarScreen;