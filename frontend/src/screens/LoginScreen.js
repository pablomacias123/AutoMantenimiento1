// frontend/src/screens/LoginScreen.js 
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useAuth } from '../services/authContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, authLoading } = useAuth();
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor ingresa email y contraseña.');
            return;
        }

        // Validación básica de email
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido.');
            return;
        }

        setError('');

        try {
            await login(email, password);
            await new Promise(resolve => setTimeout(resolve, 500));
            navigation.navigate('Dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header con Logo */}
                    <View style={styles.header}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="car-sport" size={60} color="#FFC300" />
                        </View>
                        <Text style={styles.appTitle}>AutoMantenimiento</Text>
                        <Text style={styles.subtitle}>
                            Controla el mantenimiento de tus vehículos
                        </Text>
                    </View>

                    {/* Formulario */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Iniciar Sesión</Text>
                        
                        {/* Campo Email */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#1E3A3B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Electrónico"
                                placeholderTextColor="#7A8C8C"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Campo Contraseña */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#1E3A3B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#7A8C8C"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity 
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#1E3A3B" 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Mensaje de Error */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Botón de Login */}
                        <TouchableOpacity 
                            style={[
                                styles.loginButton,
                                authLoading && styles.loginButtonDisabled
                            ]} 
                            onPress={handleLogin}
                            disabled={authLoading}
                        >
                            {authLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>Ingresar</Text>
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Link Olvidé Contraseña */}
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer - Link a Registro */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            ¿No tienes una cuenta?
                        </Text>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Register')}
                            style={styles.registerLinkContainer}
                        >
                            <Text style={styles.registerLink}> Regístrate aquí</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#D1E8E2',
    },
    container: {
        flex: 1,
        backgroundColor: '#D1E8E2',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1E3A3B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E3A3B',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#1E3A3B',
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: 22,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A3B',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
        borderRadius: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0F2E1',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    inputIcon: {
        padding: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingRight: 16,
        fontSize: 16,
        color: '#1E3A3B',
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
        fontWeight: '500',
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        borderRadius: 15,
        marginBottom: 16,
        shadowColor: '#4CAF50',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    forgotPassword: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    forgotPasswordText: {
        color: '#1E3A3B',
        fontSize: 14,
        opacity: 0.7,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    footerText: {
        color: '#1E3A3B',
        fontSize: 16,
        opacity: 0.8,
    },
    registerLinkContainer: {
        marginLeft: 4,
    },
    registerLink: {
        color: '#1E3A3B',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;