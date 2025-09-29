'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, User, Dumbbell, Heart } from 'lucide-react';
import { AvailableSlot, ReservationType } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';

interface AvailabilityCardProps {
  slot: AvailableSlot;
  onReserve: (slot: AvailableSlot) => void;
  isReserving?: boolean;
}

export function AvailabilityCard({ slot, onReserve, isReserving = false }: AvailabilityCardProps) {
  const maxCapacity = slot.groupClass?.maxCapacity || slot.specializedSpace?.capacity || 1;
  const currentCapacity = maxCapacity - (slot.remainingSpots || 0);
  const isFullyBooked = !slot.isAvailable || (slot.remainingSpots !== undefined && slot.remainingSpots <= 0);
  
  const getTypeIcon = () => {
    switch (slot.type) {
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
    switch (slot.type) {
      case ReservationType.GROUP_CLASS:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case ReservationType.PERSONAL_TRAINING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ReservationType.SPECIALIZED_SPACE:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
      isFullyBooked ? 'opacity-75 border-l-gray-400' : 'border-l-red-500'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`flex items-center gap-1 ${getTypeColor()}`}>
                {getTypeIcon()}
                {reservationService.getActivityTypeDisplayName(slot.type)}
              </Badge>
            </div>
            <CardTitle className="text-lg text-gray-900">
              {slot.groupClass?.name || slot.specializedSpace?.name || 'Entrenamiento Personal'}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {slot.startTime} - {slot.endTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Ubicación disponible
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={isFullyBooked ? "destructive" : "outline"}
              className="flex items-center gap-1"
            >
              <Users className="w-3 h-3" />
              {currentCapacity}/{maxCapacity}
            </Badge>
            {slot.price && (
              <span className="text-sm font-semibold text-green-600">
                ${slot.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {slot.instructor && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Instructor:</span> {slot.instructor.firstName} {slot.instructor.lastName}
            </div>
          )}
          
          {(slot.groupClass?.description || slot.specializedSpace?.description) && (
            <p className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r-lg">
              {slot.groupClass?.description || slot.specializedSpace?.description}
            </p>
          )}
          
          
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => onReserve(slot)}
              disabled={isFullyBooked || isReserving}
              className={`w-full transition-colors ${
                isFullyBooked
                  ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              size="lg"
            >
              {isReserving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Reservando...
                </div>
              ) : isFullyBooked ? (
                'Cupo Completo'
              ) : (
                'Reservar Ahora'
              )}
            </Button>
            
            {!isFullyBooked && currentCapacity > maxCapacity * 0.8 && (
              <p className="text-xs text-center text-amber-600 font-medium">
                ⚠️ Pocos cupos disponibles
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}