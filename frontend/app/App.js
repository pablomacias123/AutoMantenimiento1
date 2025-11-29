// App.js - ACTUALIZAR
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { AuthProvider } from '../src/services/authContext'; 

import LoginScreen from '../src/screens/LoginScreen';
import DashboardScreen from '../src/screens/DashboardScreen'; 
import RegisterScreen from '../src/screens/RegisterScren'; 
import RegisterMaintenanceScreen from '../src/screens/RegisterMaintenanceScren'; 
import AlertsScreen from '../src/screens/AlertsScreen'; 
import AddCarScreen from '../src/screens/AddCarScreen';
import EditCarScreen from '../src/screens/EditCarScreen'; // ✅ NUEVA IMPORTACIÓN

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Mi Garaje' }} 
      />
      <Stack.Screen 
        name="AddCar" 
        component={AddCarScreen} 
        options={{ title: 'Agregar Vehículo' }} 
      />
      <Stack.Screen 
        name="EditCar" 
        component={EditCarScreen} 
        options={{ title: 'Editar Vehículo' }} 
      />
      <Stack.Screen 
        name="RegisterMaintenance" 
        component={RegisterMaintenanceScreen} 
        options={{ title: 'Registrar Mantenimiento' }} 
      />
      <Stack.Screen 
        name="Alerts" 
        component={AlertsScreen} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
}