// hooks/use-membership-notifications.ts
import { useState, useEffect, useCallback } from 'react';
import { MembershipNotification, NotificationStats, NotificationType, NotificationCategory, NotificationPriority } from '@/types/notification';
import { membershipNotificationService } from '@/services/membershipNotificationService';
import { membershipManagementService } from '@/services/membershipManagementService';
import { userService } from '@/services/userService';

interface UseMembershipNotificationsReturn {
  notifications: MembershipNotification[];
  unreadCount: number;
  stats: NotificationStats;
  loading: boolean;
  markAsRead: (notificationIds: string[]) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  refresh: () => Promise<void>;
}

export function useMembershipNotifications(): UseMembershipNotificationsReturn {
  const [notifications, setNotifications] = useState<MembershipNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byCategory: {},
    byPriority: {}
  });
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const userData = userService.getCurrentUser();
      if (!userData || !userData.idUser) {
        setNotifications([]);
        return;
      }

      const userId = Number(userData.idUser);

      // Obtener detalles de membresía del backend
      const membershipDetails = await membershipManagementService.getMembershipDetails(userId);
      
      // Verificar si el usuario tiene membresía
      if (!membershipDetails.hasMembership) {
        // Crear notificaciones apropiadas según el estado
        const notifications: MembershipNotification[] = [];
        
        if (membershipDetails.needsLocation) {
          // Usuario necesita asignar ubicación principal
          notifications.push({
            id: `no-location-${Date.now()}`,
            userId: userId,
            type: NotificationType.SYSTEM_MAINTENANCE,
            category: NotificationCategory.SYSTEM,
            priority: NotificationPriority.HIGH,
            title: 'Asigna tu sede principal',
            message: 'Debes asignar una sede principal antes de adquirir una membresía',
            actionUrl: '/configuracion',
            actionLabel: 'Ir a Configuración',
            read: false,
            timestamp: new Date().toISOString()
          });
        } else {
          // Usuario puede comprar membresía
          notifications.push({
            id: `no-membership-${Date.now()}`,
            userId: userId,
            type: NotificationType.SPECIAL_OFFER,
            category: NotificationCategory.MEMBERSHIP,
            priority: NotificationPriority.MEDIUM,
            title: '¡Adquiere tu membresía!',
            message: 'No tienes una membresía activa. Explora nuestros planes y encuentra el perfecto para ti.',
            actionUrl: '/membresias',
            actionLabel: 'Ver Planes',
            read: false,
            timestamp: new Date().toISOString()
          });
        }
        
        setNotifications(notifications);
        setStats({
          total: notifications.length,
          unread: notifications.length,
          byCategory: {},
          byPriority: {}
        });
        setLoading(false);
        return;
      }

      // Si tiene membresía, intentar cargar notificaciones existentes
      try {
        const existingNotifications = await membershipNotificationService.getNotifications(userId);
        
        setNotifications(existingNotifications);

        // Calcular estadísticas localmente
        const unreadCount = existingNotifications.filter((n: any) => !n.read).length;
        setStats({
          total: existingNotifications.length,
          unread: unreadCount,
          byCategory: {},
          byPriority: {}
        });
      } catch (err) {
        console.error('Error loading existing notifications:', err);
        setNotifications([]);
      }

    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Verificar nuevas notificaciones cada 5 minutos
    const interval = setInterval(() => {
      loadNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = useCallback((notificationIds: string[]) => {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.idUser) return;

    const userId = Number(userData.idUser);
    
    // Marcar como leídas individualmente
    notificationIds.forEach(id => {
      membershipNotificationService.markAsRead(id);
    });
    
    // Actualizar estado local
    setNotifications(prev => 
      prev.map(n => 
        notificationIds.includes(n.id) ? { ...n, read: true } : n
      )
    );

    // Actualizar estadísticas
    setStats(prev => ({
      ...prev,
      unread: Math.max(0, prev.unread - notificationIds.length)
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.idUser) return;

    const userId = Number(userData.idUser);
    membershipNotificationService.markAllAsRead(userId);
    
    // Actualizar estado local
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );

    // Actualizar estadísticas
    setStats(prev => ({
      ...prev,
      unread: 0
    }));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.idUser) return;

    const userId = Number(userData.idUser);
    membershipNotificationService.deleteNotification(notificationId);
    
    // Actualizar estado local
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    // Actualizar estadísticas
    if (notification && !notification.read) {
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        unread: Math.max(0, prev.unread - 1)
      }));
    } else {
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
    }
  }, [notifications]);

  const clearAll = useCallback(() => {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.idUser) return;

    const userId = Number(userData.idUser);
    
    // Eliminar todas las notificaciones una por una
    notifications.forEach(notification => {
      membershipNotificationService.deleteNotification(notification.id);
    });
    
    setNotifications([]);
    setStats({
      total: 0,
      unread: 0,
      byCategory: {},
      byPriority: {}
    });
  }, [notifications]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount: stats.unread,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh
  };
}
