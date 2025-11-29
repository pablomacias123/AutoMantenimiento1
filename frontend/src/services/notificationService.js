// frontend/src/services/notificationService.js - NUEVO ARCHIVO
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Solicitar permisos
  async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('¡Necesitas habilitar las notificaciones para recibir recordatorios!');
        return false;
      }
      
      // Para Android, configurar canal
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      return true;
    } else {
      alert('Debes usar un dispositivo físico para las notificaciones');
      return false;
    }
  },

  // Programar notificación
  async scheduleNotification(title, body, trigger) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
  },

  // Programar recordatorio de mantenimiento
  async scheduleMaintenanceReminder(car, maintenanceType, daysFromNow = 7) {
    const trigger = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    
    await this.scheduleNotification(
      `🔧 Recordatorio de Mantenimiento`,
      `Tu ${car.brand} ${car.model} necesita ${maintenanceType} en ${daysFromNow} días`,
      { date: trigger }
    );
  },

  // Programar recordatorio basado en kilometraje
  async scheduleMileageReminder(car, targetMileage, maintenanceType) {
    const currentMileage = car.mileage || 0;
    const remainingKm = targetMileage - currentMileage;
    
    if (remainingKm <= 1000) {
      await this.scheduleNotification(
        `📊 Próximo Mantenimiento`,
        `Tu ${car.brand} ${car.model} necesita ${maintenanceType} en ${remainingKm} km`,
        { 
          seconds: 86400 // 1 día
        }
      );
    }
  },

  // Cancelar todas las notificaciones
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // Obtener notificaciones pendientes
  async getScheduledNotifications() {
    return await Notifications.getScheduledNotificationsAsync();
  }
};