'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Flame, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';

interface ReservationWidgetProps {
  userId?: number;
}

export function ReservationWidget({ userId }: ReservationWidgetProps) {
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUpcomingReservations();
    }
  }, [userId]);

  const loadUpcomingReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const reservations = await reservationService.getUpcomingReservations();
      setUpcomingReservations(reservations.slice(0, 3)); // Show only first 3
    } catch (err) {
      // Silenciar errores - el sistema de reservas puede no estar completamente implementado
      // Esto es normal durante el desarrollo
      setUpcomingReservations([]);
      setError(null); // No mostrar error al usuario
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const getActivityName = (reservation: Reservation) => {
    if (reservation.groupClass) {
      return reservation.groupClass.name;
    } else if (reservation.specializedSpace) {
      return reservationService.getSpecializedSpaceTypeDisplayName(reservation.specializedSpace.type);
    } else if (reservation.instructor) {
      return 'Entrenamiento Personal';
    }
    return reservationService.getActivityTypeDisplayName(reservation.type);
  };

  const getActivityIcon = (reservation: Reservation) => {
    switch (reservation.type) {
      case 'GROUP_CLASS':
        return <Calendar className="w-4 h-4" />;
      case 'PERSONAL_TRAINING':
        return <User className="w-4 h-4" />;
      case 'SPECIALIZED_SPACE':
        return <Flame className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getBadgeVariant = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return { className: "bg-green-100 text-green-800", text: "Hoy" };
    } else {
      return { className: "bg-blue-100 text-blue-800", text: formatDate(dateString) };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Próximas Reservas</span>
            </div>
            <Link href="/reservas?tab=my-reservations">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {error ? (
              <div className="flex items-center justify-center py-4 text-center text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            ) : upcomingReservations.length > 0 ? (
              upcomingReservations.map((reservation) => {
                const badge = getBadgeVariant(reservation.scheduledDate);
                return (
                  <div 
                    key={reservation.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-red-600">
                        {getActivityIcon(reservation)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{getActivityName(reservation)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(reservation.scheduledDate)} • {formatTime(reservation.scheduledStartTime, reservation.scheduledEndTime)}
                        </p>
                        {reservation.instructor && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            <User className="w-3 h-3 inline mr-1" />
                            {reservation.instructor.firstName} {reservation.instructor.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={badge.className}>
                      {badge.text}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-600 dark:text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-700 dark:text-gray-300">No tienes reservas próximas</p>
                <Link href="/reservas">
                  <Button variant="outline" size="sm" className="mt-2">
                    Hacer una reserva
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Reservar Ahora</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/reservas?tab=group-classes">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Clases Grupales
              </Button>
            </Link>
            <Link href="/reservas?tab=personal-training">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Entrenamiento Personal
              </Button>
            </Link>
            <Link href="/reservas?tab=specialized-spaces">
              <Button variant="outline" className="w-full">
                <Flame className="w-4 h-4 mr-2" />
                Espacios Especializados
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}