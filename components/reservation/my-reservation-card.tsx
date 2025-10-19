'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Dumbbell, Heart, CheckCircle2, XCircle, AlertCircle, Edit } from 'lucide-react';
import { Reservation, ReservationStatus, ReservationType } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';

interface MyReservationCardProps {
  reservation: Reservation;
  onCancel?: (reservationId: number) => void;
  onModify?: (reservation: Reservation) => void;
  isCanceling?: boolean;
}

export function MyReservationCard({ 
  reservation, 
  onCancel, 
  onModify,
  isCanceling = false 
}: MyReservationCardProps) {
  
  const canCancel = reservation.status === ReservationStatus.ACTIVE && 
                   reservationService.canCancelReservation(reservation);
  
  const canModify = reservation.status === ReservationStatus.ACTIVE && canCancel;

  const getStatusBadge = () => {
    switch (reservation.status) {
      case ReservationStatus.ACTIVE:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Activa
          </Badge>
        );
      case ReservationStatus.CANCELLED:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      case ReservationStatus.COMPLETED:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case ReservationStatus.NO_SHOW:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            No asistió
          </Badge>
        );
      default:
        return <Badge variant="outline">{reservation.status}</Badge>;
    }
  };

  const getTypeIcon = () => {
    switch (reservation.type) {
      case ReservationType.GROUP_CLASS:
        return <Heart className="w-4 h-4" />;
      case ReservationType.PERSONAL_TRAINING:
        return <User className="w-4 h-4" />;
      case ReservationType.SPECIALIZED_SPACE:
        return <Dumbbell className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (reservation.type) {
      case ReservationType.GROUP_CLASS:
        return 'border-l-pink-500';
      case ReservationType.PERSONAL_TRAINING:
        return 'border-l-blue-500';
      case ReservationType.SPECIALIZED_SPACE:
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getActivityName = () => {
    if (reservation.groupClass) {
      return `${reservation.groupClass.name}`;
    } else if (reservation.specializedSpace) {
      return `${reservationService.getSpecializedSpaceTypeDisplayName(reservation.specializedSpace.type)}`;
    } else if (reservation.instructor) {
      return 'Entrenamiento Personal';
    }
    return reservationService.getActivityTypeDisplayName(reservation.type);
  };

  const getActivitySubtitle = () => {
    if (reservation.groupClass) {
      return reservationService.getGroupClassTypeDisplayName(reservation.groupClass.type);
    } else if (reservation.specializedSpace) {
      return reservation.specializedSpace.name;
    }
    return null;
  };

  const isUpcoming = () => {
    const reservationDateTime = new Date(`${reservation.scheduledDate}T${reservation.scheduledStartTime}`);
    return reservationDateTime > new Date() && reservation.status === ReservationStatus.ACTIVE;
  };

  const isPast = () => {
    const reservationDateTime = new Date(`${reservation.scheduledDate}T${reservation.scheduledStartTime}`);
    return reservationDateTime < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getTypeColor()} ${
      isUpcoming() ? 'bg-gradient-to-r from-green-50 to-white' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeIcon()}
                {reservationService.getActivityTypeDisplayName(reservation.type)}
              </Badge>
              {isUpcoming() && (
                <Badge className="bg-green-100 text-green-800">
                  Próxima
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg text-gray-900">
              {getActivityName()}
            </CardTitle>
            
            {getActivitySubtitle() && (
              <p className="text-sm text-gray-600 mt-1">
                {getActivitySubtitle()}
              </p>
            )}
            
            <CardDescription className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(reservation.scheduledDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {reservation.scheduledStartTime} - {reservation.scheduledEndTime}
              </span>
            </CardDescription>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            {reservation.price && (
              <span className="text-sm font-semibold text-green-600">
                ${reservation.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {reservation.instructor && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Instructor:</span> 
              {reservation.instructor.firstName} {reservation.instructor.lastName}
            </div>
          )}
          
          {reservation.locationId && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Ubicación:</span> 
              ID: {reservation.locationId}
            </div>
          )}
          
          {reservation.notes && (
            <div className="text-sm text-gray-600 bg-yellow-50 border-l-4 border-yellow-200 p-3 rounded-r-lg">
              <strong>Notas:</strong> {reservation.notes}
            </div>
          )}
          
          {reservation.cancelReason && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
              <strong>Motivo de cancelación:</strong> {reservation.cancelReason}
            </div>
          )}
          
          {/* Actions */}
          {reservation.status === ReservationStatus.ACTIVE && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {canModify && onModify && (
                <Button
                  onClick={() => onModify(reservation)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modificar
                </Button>
              )}
              
              {canCancel && onCancel && (
                <Button
                  onClick={() => onCancel(reservation.id)}
                  disabled={isCanceling}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  {isCanceling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelando...
                    </div>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
          
          {/* Information for non-cancellable reservations */}
          {reservation.status === ReservationStatus.ACTIVE && !canCancel && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
              ⚠️ Las reservas solo pueden cancelarse con al menos 2 horas de anticipación
            </div>
          )}
          
          {/* Upcoming reservation reminder */}
          {isUpcoming() && (
            <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2">
              🔔 Recuerda llegar 15 minutos antes de tu cita
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}