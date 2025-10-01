// hooks/use-membership-notifications.ts
import { useState, useEffect, useCallback } from 'react';
import { MembershipNotification, NotificationStats } from '@/types/notification';
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

      // Cargar notificaciones existentes
      const existingNotifications = membershipNotificationService.getNotifications(userId);
      
      // Generar nuevas notificaciones basadas en el estado de la membresía
      const membershipData = await membershipManagementService.getMembershipDetails(userId);
      const newNotifications = membershipNotificationService.generateNotificationsForMembership(
        userId, 
        membershipData
      );

      // Guardar nuevas notificaciones
      newNotifications.forEach(notification => {
        membershipNotificationService.saveNotification(notification);
      });

      // Obtener todas las notificaciones actualizadas
      const allNotifications = membershipNotificationService.getNotifications(userId);
      setNotifications(allNotifications);

      // Obtener estadísticas
      const notificationStats = membershipNotificationService.getStats(userId);
      setStats(notificationStats);

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
    membershipNotificationService.markAsRead({ userId, notificationIds });
    
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
    membershipNotificationService.deleteNotifications({ 
      userId, 
      notificationIds: [notificationId] 
    });
    
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
    membershipNotificationService.clearAll(userId);
    
    setNotifications([]);
    setStats({
      total: 0,
      unread: 0,
      byCategory: {},
      byPriority: {}
    });
  }, []);

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
