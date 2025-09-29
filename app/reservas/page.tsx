'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  Reservation,
  AvailableSlot,
  GroupClass,
  Instructor,
  SpecializedSpace,
  Location,
  ReservationType,
  GroupClassType,
  SpecializedSpaceType,
  ReservationStatus,
  CreateReservationRequest
} from '@/types/reservation';
import { reservationService } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityCard } from '@/components/reservation/availability-card';
import { MyReservationCard } from '@/components/reservation/my-reservation-card';
import { useReservationNotifications } from '@/hooks/use-reservation-notifications';

interface ReservationPageState {
  selectedDate: string;
  selectedLocation?: number;
  locations: Location[];
  loading: boolean;
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const { notifyReservationCreated, notifyReservationCancelled } = useReservationNotifications();
  const [activeTab, setActiveTab] = useState<string>('group-classes');
  
  const [state, setState] = useState<ReservationPageState>({
    selectedDate: new Date().toISOString().split('T')[0],
    locations: [],
    loading: false,
  });

  // Group Classes state
  const [groupClasses, setGroupClasses] = useState<AvailableSlot[]>([]);
  const [selectedClassType, setSelectedClassType] = useState<GroupClassType | ''>('');
  
  // Personal Training state
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [personalTrainingSlots, setPersonalTrainingSlots] = useState<AvailableSlot[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<number | undefined>();

  // Specialized Spaces state
  const [specializedSpaces, setSpecializedSpaces] = useState<AvailableSlot[]>([]);
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpecializedSpaceType | ''>('');

  // My reservations
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'group-classes') {
      loadGroupClasses();
    } else if (activeTab === 'personal-training') {
      loadPersonalTraining();
    } else if (activeTab === 'specialized-spaces') {
      loadSpecializedSpaces();
    } else if (activeTab === 'my-reservations') {
      loadMyReservations();
    }
  }, [activeTab, state.selectedDate, state.selectedLocation, selectedClassType, selectedInstructor, selectedSpaceType]);

  const loadInitialData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const locations = await reservationService.getLocations();
      setState(prev => ({ ...prev, locations, loading: false }));
    } catch (error) {
      console.error('Error loading initial data:', error);
      setState(prev => ({ ...prev, loading: false }));
      showError("Error", "No se pudieron cargar las ubicaciones");
    }
  };

  const loadGroupClasses = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const slots = await reservationService.getGroupClassesSchedule(
        state.selectedDate,
        state.selectedLocation,
        selectedClassType || undefined
      );
      setGroupClasses(slots);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error loading group classes:', error);
      setState(prev => ({ ...prev, loading: false }));
      showError("Error", "No se pudieron cargar las clases grupales");
    }
  };

  const loadPersonalTraining = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const [instructorsList, slots] = await Promise.all([
        reservationService.getInstructors(undefined, state.selectedLocation),
        reservationService.getPersonalTrainingAvailability(
          state.selectedDate,
          selectedInstructor,
          state.selectedLocation
        )
      ]);
      setInstructors(instructorsList);
      setPersonalTrainingSlots(slots);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error loading personal training:', error);
      setState(prev => ({ ...prev, loading: false }));
      showError("Error", "No se pudo cargar el entrenamiento personal");
    }
  };

  const loadSpecializedSpaces = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const slots = await reservationService.getSpecializedSpacesAvailability(
        state.selectedDate,
        selectedSpaceType || undefined,
        state.selectedLocation
      );
      setSpecializedSpaces(slots);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error loading specialized spaces:', error);
      setState(prev => ({ ...prev, loading: false }));
      showError("Error", "No se pudieron cargar los espacios especializados");
    }
  };

  const loadMyReservations = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const reservations = await reservationService.getMyReservations();
      setMyReservations(reservations);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error loading my reservations:', error);
      setState(prev => ({ ...prev, loading: false }));
      showError("Error", "No se pudieron cargar tus reservas");
    }
  };

  const handleReservation = async (slot: AvailableSlot) => {
    if (!user) {
      showError("Error", "Debes iniciar sesión para hacer reservas");
      return;
    }

    try {
      const reservationData: CreateReservationRequest = {
        type: slot.type,
        scheduledDate: state.selectedDate,
        scheduledStartTime: slot.startTime,
        scheduledEndTime: slot.endTime,
        groupClassId: slot.groupClass?.id,
        instructorId: slot.instructor?.id,
        specializedSpaceId: slot.specializedSpace?.id,
        locationId: slot.groupClass?.locationId || slot.specializedSpace?.locationId || 1,
        notes: '',
      };

      const newReservation = await reservationService.createReservation(reservationData);
      
      // Show success message and notification
      showSuccess("¡Reserva exitosa!", `Tu ${reservationService.getActivityTypeDisplayName(slot.type).toLowerCase()} ha sido reservada`);
      notifyReservationCreated(newReservation);

      // Reload current tab data
      if (activeTab === 'group-classes') {
        loadGroupClasses();
      } else if (activeTab === 'personal-training') {
        loadPersonalTraining();
      } else if (activeTab === 'specialized-spaces') {
        loadSpecializedSpaces();
      }
      
    } catch (error) {
      console.error('Error making reservation:', error);
      showError("Error", "No se pudo realizar la reserva. Inténtalo de nuevo.");
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      // Get reservation before canceling for notification
      const reservation = await reservationService.getReservationById(reservationId);
      await reservationService.cancelReservation(reservationId);
      
      // Show success message and notification
      showSuccess("Reserva cancelada", "Tu reserva ha sido cancelada exitosamente");
      notifyReservationCancelled(reservation);
      
      loadMyReservations();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      showError("Error", "No se pudo cancelar la reserva");
    }
  };



  // State for tracking reservation loading
  const [reservingSlot, setReservingSlot] = useState<number | null>(null);
  const [cancelingReservation, setCancelingReservation] = useState<number | null>(null);

  const handleReservationWithLoading = async (slot: AvailableSlot) => {
    const slotId = slot.groupClass?.id || slot.instructor?.id || slot.specializedSpace?.id || 0;
    setReservingSlot(slotId);
    try {
      await handleReservation(slot);
    } finally {
      setReservingSlot(null);
    }
  };

  const handleCancelWithLoading = async (reservationId: number) => {
    setCancelingReservation(reservationId);
    try {
      await handleCancelReservation(reservationId);
    } finally {
      setCancelingReservation(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Reservas</h1>
        <p className="text-muted-foreground mt-2">
          Reserva clases grupales, entrenamientos personales y espacios especializados
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha</label>
              <Input
                type="date"
                value={state.selectedDate}
                onChange={(e) => setState(prev => ({ ...prev, selectedDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ubicación</label>
              <Select
                value={state.selectedLocation?.toString() || ''}
                onValueChange={(value) => setState(prev => ({ ...prev, selectedLocation: value ? Number(value) : undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las ubicaciones</SelectItem>
                  {state.locations.map(location => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="group-classes">Clases Grupales</TabsTrigger>
          <TabsTrigger value="personal-training">Entrenamiento Personal</TabsTrigger>
          <TabsTrigger value="specialized-spaces">Espacios Especializados</TabsTrigger>
          <TabsTrigger value="my-reservations">Mis Reservas</TabsTrigger>
        </TabsList>

        {/* Group Classes Tab */}
        <TabsContent value="group-classes" className="space-y-6">
          <div className="flex gap-4">
            <Select
              value={selectedClassType}
              onValueChange={(value) => setSelectedClassType(value as GroupClassType | '')}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Tipo de clase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {Object.values(GroupClassType).map(type => (
                  <SelectItem key={type} value={type}>
                    {reservationService.getGroupClassTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {state.loading ? (
            <div className="text-center py-8">Cargando clases grupales...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupClasses.length > 0 ? (
                groupClasses.map((slot) => (
                  <AvailabilityCard 
                    key={`${slot.groupClass?.id || 'gc'}-${slot.startTime}`} 
                    slot={slot} 
                    onReserve={handleReservationWithLoading}
                    isReserving={reservingSlot === slot.groupClass?.id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No hay clases grupales disponibles para la fecha seleccionada
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Personal Training Tab */}
        <TabsContent value="personal-training" className="space-y-6">
          <div className="flex gap-4">
            <Select
              value={selectedInstructor?.toString() || ''}
              onValueChange={(value) => setSelectedInstructor(value ? Number(value) : undefined)}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los instructores</SelectItem>
                {instructors.map(instructor => (
                  <SelectItem key={instructor.id} value={instructor.id.toString()}>
                    {instructor.firstName} {instructor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state.loading ? (
            <div className="text-center py-8">Cargando entrenamientos personales...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalTrainingSlots.length > 0 ? (
                personalTrainingSlots.map((slot) => (
                  <AvailabilityCard 
                    key={`${slot.instructor?.id || 'pt'}-${slot.startTime}`} 
                    slot={slot} 
                    onReserve={handleReservationWithLoading}
                    isReserving={reservingSlot === slot.instructor?.id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No hay entrenamientos personales disponibles para la fecha seleccionada
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Specialized Spaces Tab */}
        <TabsContent value="specialized-spaces" className="space-y-6">
          <div className="flex gap-4">
            <Select
              value={selectedSpaceType}
              onValueChange={(value) => setSelectedSpaceType(value as SpecializedSpaceType | '')}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Tipo de espacio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los espacios</SelectItem>
                {Object.values(SpecializedSpaceType).map(type => (
                  <SelectItem key={type} value={type}>
                    {reservationService.getSpecializedSpaceTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state.loading ? (
            <div className="text-center py-8">Cargando espacios especializados...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedSpaces.length > 0 ? (
                specializedSpaces.map((slot) => (
                  <AvailabilityCard 
                    key={`${slot.specializedSpace?.id || 'ss'}-${slot.startTime}`} 
                    slot={slot} 
                    onReserve={handleReservationWithLoading}
                    isReserving={reservingSlot === slot.specializedSpace?.id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No hay espacios especializados disponibles para la fecha seleccionada
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* My Reservations Tab */}
        <TabsContent value="my-reservations" className="space-y-6">
          {state.loading ? (
            <div className="text-center py-8">Cargando tus reservas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myReservations.length > 0 ? (
                myReservations.map((reservation) => (
                  <MyReservationCard 
                    key={reservation.id} 
                    reservation={reservation} 
                    onCancel={handleCancelWithLoading}
                    isCanceling={cancelingReservation === reservation.id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No tienes reservas actualmente
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}