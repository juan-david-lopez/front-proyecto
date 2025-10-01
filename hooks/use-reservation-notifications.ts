// hooks/use-reservation-notifications.ts
import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';

export interface ReservationNotification {
  id: string;
  type: 'reminder' | 'confirmation' | 'cancellation' | 'update';
  title: string;
  message: string;
  reservation?: Reservation;
  timestamp: Date;
  read: boolean;
}

export function useReservationNotifications() {
  const [notifications, setNotifications] = useState<ReservationNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { info } = useToast();

  useEffect(() => {
    loadNotifications();
    setupNotificationChecks();
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = () => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('reservation-notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  };

  const saveNotifications = (newNotifications: ReservationNotification[]) => {
    localStorage.setItem('reservation-notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (notification: Omit<ReservationNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: ReservationNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    const updated = [newNotification, ...notifications];
    saveNotifications(updated);

    // Show toast notification
    info(notification.title, notification.message);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const setupNotificationChecks = () => {
    // Check for upcoming reservations every 5 minutes
    const checkUpcoming = async () => {
      try {
        const upcoming = await reservationService.getUpcomingReservations();
        const now = new Date();
        
        upcoming.forEach(reservation => {
          const reservationTime = new Date(`${reservation.scheduledDate}T${reservation.scheduledStartTime}`);
          const hoursUntil = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          // Reminder 24 hours before
          if (hoursUntil <= 24 && hoursUntil > 23.5) {
            addNotification({
              type: 'reminder',
              title: '¡Recordatorio de Reserva!',
              message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} es mañana a las ${reservation.scheduledStartTime}`,
              reservation,
            });
          }
          
          // Reminder 2 hours before
          if (hoursUntil <= 2 && hoursUntil > 1.5) {
            addNotification({
              type: 'reminder',
              title: '¡Reserva Próxima!',
              message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} empieza en 2 horas. No olvides llegar 15 minutos antes.`,
              reservation,
            });
          }
          
          // Reminder 30 minutes before
          if (hoursUntil <= 0.5 && hoursUntil > 0.25) {
            addNotification({
              type: 'reminder',
              title: '¡Es hora de ir!',
              message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} empieza en 30 minutos.`,
              reservation,
            });
          }
        });
      } catch (error) {
        // Silenciar errores de conexión para evitar spam en consola
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Servidor no disponible, no hacer nada
          return;
        }
        console.error('Error checking upcoming reservations:', error);
      }
    };

    checkUpcoming(); // Initial check
    const interval = setInterval(checkUpcoming, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  };

  const notifyReservationCreated = (reservation: Reservation) => {
    addNotification({
      type: 'confirmation',
      title: '¡Reserva Confirmada!',
      message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} ha sido reservada para el ${reservation.scheduledDate} a las ${reservation.scheduledStartTime}`,
      reservation,
    });
  };

  const notifyReservationCancelled = (reservation: Reservation) => {
    addNotification({
      type: 'cancellation',
      title: 'Reserva Cancelada',
      message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} del ${reservation.scheduledDate} ha sido cancelada`,
      reservation,
    });
  };

  const notifyReservationUpdated = (reservation: Reservation) => {
    addNotification({
      type: 'update',
      title: 'Reserva Actualizada',
      message: `Tu ${reservationService.getActivityTypeDisplayName(reservation.type).toLowerCase()} ha sido actualizada`,
      reservation,
    });
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    notifyReservationCreated,
    notifyReservationCancelled,
    notifyReservationUpdated,
  };
}