// RegisterScreen.js 
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    ScrollView 
} from 'react-native';
import { useAuth } from '../services/authContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register(username, email, password);
            alert('¡Registro exitoso! Serás redirigido al Dashboard.');
            navigation.navigate('Dashboard');
        } catch (err) {
            console.error("Error en registro:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
       
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crea Tu Cuenta</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Nombre de Usuario" 
                value={username} 
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Correo Electrónico" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Contraseña (mín. 6 caracteres)" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={true} 
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Confirmar Contraseña" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={true} 
            />

            <View style={styles.checkboxRow}>
                <TouchableOpacity style={styles.checkbox} onPress={() => {}} />
                {}
                <Text style={styles.termsText}>
                    Acepto los <Text style={{fontWeight: 'bold'}}>Términos y privacidad</Text>
                </Text>
            </View>

            {}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {loading ? (
                <ActivityIndicator size="large" color="#1E3A3B" style={{marginTop: 20}} />
            ) : (
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 15}}>
                <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: 'white', 
        padding: 30,
        justifyContent: 'center'
    },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1E3A3B', marginBottom: 40, textAlign: 'center' },
    input: {
        width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 25,
        paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#F8F8F8', fontSize: 16,
    },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#1E3A3B', marginRight: 10 },
    termsText: { fontSize: 14, color: '#A9A9A9' },
    registerButton: {
        width: '100%', height: 50, backgroundColor: '#4CAF50', borderRadius: 25,
        justifyContent: 'center', alignItems: 'center', marginTop: 10,
    },
    registerButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    linkText: { color: '#1E3A3B', fontSize: 14, textAlign: 'center' },
    errorText: { color: 'red', marginBottom: 10, textAlign: 'center' }
});

export default RegisterScreen;