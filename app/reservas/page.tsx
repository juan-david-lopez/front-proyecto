'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/back-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Dumbbell, Star, Filter, Search, ArrowRight, CheckCircle, XCircle, Timer, Award, Target, Plus, Loader } from 'lucide-react';
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
import { PaymentModal } from '@/components/reservation/payment-modal';
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
  const [selectedClassType, setSelectedClassType] = useState<GroupClassType | 'all-types'>('all-types');
  
  // Personal Training state
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [personalTrainingSlots, setPersonalTrainingSlots] = useState<AvailableSlot[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<number | undefined>();

  // Specialized Spaces state
  const [specializedSpaces, setSpecializedSpaces] = useState<AvailableSlot[]>([]);
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpecializedSpaceType | 'all-spaces'>('all-spaces');

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
      // Cargar TODAS las clases grupales disponibles del backend
      const classes = await reservationService.getAvailableGroupClasses();
      setGroupClasses(classes);
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
        selectedSpaceType === 'all-spaces' ? undefined : selectedSpaceType,
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

  // State para modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSlotForPayment, setSelectedSlotForPayment] = useState<AvailableSlot | null>(null);
  const [userMembershipType, setUserMembershipType] = useState<string>('');

  const handleReservation = async (slot: AvailableSlot) => {
    if (!user) {
      showError("Error", "Debes iniciar sesión para hacer reservas");
      return;
    }

    // Si es clase grupal, verificar membresía para saber si requiere pago
    if (slot.type === ReservationType.GROUP_CLASS) {
      try {
        // Obtener tipo de membresía del usuario
        const membershipType = (user.membershipType || 'BASIC').toUpperCase();
        setUserMembershipType(membershipType);

        if (membershipType === 'ELITE') {
          // ✅ Usuario ELITE: Se une GRATIS
          console.log('✅ Usuario ELITE - Inscripción gratuita a clase grupal');
          await createGroupClassReservation(slot, null);
        } else if (membershipType === 'PREMIUM' || membershipType === 'BASIC') {
          // 💳 Usuario PREMIUM/BASIC: Requiere PAGO
          console.log('💳 Usuario', membershipType, '- Requiere pago de $15,000 COP');
          setSelectedSlotForPayment(slot);
          setShowPaymentModal(true);
        }
      } catch (error) {
        console.error('Error al procesar reserva de clase grupal:', error);
        showError("Error", "No se pudo procesar tu solicitud. Inténtalo de nuevo.");
      }
    } else {
      // Para entrenamientos personales y espacios especializados, proceder sin pago
      await createGeneralReservation(slot);
    }
  };

  const createGroupClassReservation = async (slot: AvailableSlot, paymentMethodId: string | null) => {
    try {
      if (paymentMethodId) {
        // Con pago (PREMIUM/BASIC)
        const result = await reservationService.joinGroupClassWithPayment(
          slot.groupClass!.id,
          paymentMethodId
        );
        showSuccess(
          "¡Pago exitoso!", 
          `Pago de $15,000 COP procesado. ¡Ya estás inscrito en ${slot.groupClass?.name}!`
        );
        notifyReservationCreated(result);
      } else {
        // Sin pago (ELITE)
        const result = await reservationService.joinGroupClass(slot.groupClass!.id);
        showSuccess(
          "¡Inscripción exitosa!", 
          `¡Acceso gratuito! Ya estás inscrito en ${slot.groupClass?.name}`
        );
        notifyReservationCreated(result);
      }

      // Recargar datos
      if (activeTab === 'group-classes') {
        loadGroupClasses();
      }
      loadMyReservations();
    } catch (error: any) {
      console.error('Error en reserva de clase grupal:', error);
      showError("Error", error.message || "No se pudo completar la inscripción");
    }
  };

  const createGeneralReservation = async (slot: AvailableSlot) => {
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

  const handlePaymentSuccess = async () => {
    if (selectedSlotForPayment) {
      // El pago fue exitoso en el componente PaymentModal
      setShowPaymentModal(false);
      setSelectedSlotForPayment(null);
      // Los datos se recargarán cuando se cierre el modal
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
    <div className="min-h-screen bg-theme-primary">
      {/* Header Premium */}
      <div className="bg-theme-primary shadow-sm border-b border-theme">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-theme-primary">Sistema de Reservas FitZone</h1>
              <p className="text-theme-secondary mt-1">
                Reserva clases grupales, entrenamientos personales y espacios especializados
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Filtros Mejorados */}
        <Card className="card-theme border-theme shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-white">Filtros de Búsqueda</CardTitle>
                <CardDescription className="text-green-100">Personaliza tu experiencia de reserva</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Reserva
                </label>
                <Input
                  type="date"
                  value={state.selectedDate}
                  onChange={(e) => setState(prev => ({ ...prev, selectedDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ubicación del Gimnasio
                </label>
                <Select
                  value={state.selectedLocation?.toString() || ''}
                  onValueChange={(value) => setState(prev => ({ ...prev, selectedLocation: value === 'all-locations' ? undefined : Number(value) }))}
                >
                  <SelectTrigger className="border-green-300 focus:border-green-500">
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">Todas las ubicaciones</SelectItem>
                    {state.locations.map(location => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {location.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Estado de Disponibilidad
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50 flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Disponible
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Completo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="group-classes"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                Clases Grupales
              </TabsTrigger>
              <TabsTrigger 
                value="personal-training"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Dumbbell className="w-4 h-4" />
                Entrenamiento Personal
              </TabsTrigger>
              <TabsTrigger 
                value="specialized-spaces"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Target className="w-4 h-4" />
                Espacios Especializados
              </TabsTrigger>
              <TabsTrigger 
                value="my-reservations"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Star className="w-4 h-4" />
                Mis Reservas
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Group Classes Tab */}
          <TabsContent value="group-classes" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Clases Grupales Disponibles</CardTitle>
                      <CardDescription className="text-blue-100">Únete a nuestras clases colectivas</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedClassType}
                      onValueChange={(value) => setSelectedClassType(value === 'all-types' ? 'all-types' : value as GroupClassType)}
                    >
                      <SelectTrigger className="w-64 bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Tipo de clase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-types">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Todos los tipos
                          </div>
                        </SelectItem>
                        {Object.values(GroupClassType).map(type => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              {reservationService.getGroupClassTypeDisplayName(type)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {state.loading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Timer className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-lg">Cargando clases grupales...</p>
                    <p className="text-gray-500 text-sm">Buscando las mejores opciones para ti</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupClasses.length > 0 ? (
                      groupClasses.map((reservation) => (
                        <div key={`gc-${reservation.id}`} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            {/* Encabezado de la clase */}
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                                {reservation.groupClass?.name || 'Clase Grupal'}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Instructor: {reservation.instructor?.firstName} {reservation.instructor?.lastName}
                              </p>
                            </div>

                            {/* Detalles */}
                            <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                  {new Date(reservation.scheduledDate).toLocaleDateString('es-ES', { 
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                  {reservation.scheduledStartTime} - {reservation.scheduledEndTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                  Cupo disponible
                                </span>
                              </div>
                            </div>

                            {/* Precio (si aplica) */}
                            {reservation.requiresPayment && (
                              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                                  ${(15000).toLocaleString('es-CO')} COP
                                </p>
                              </div>
                            )}

                            {/* Botón de reserva */}
                            <button
                              onClick={() => handleReservationWithLoading(reservation.id)}
                              disabled={reservingSlot === reservation.id}
                              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              {reservingSlot === reservation.id ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  {reservation.requiresPayment ? 'Pagar y Unirse' : 'Unirse Gratis'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-12 h-12 text-blue-500" />
                        </div>
                        <p className="text-gray-600 text-lg mb-2">No hay clases grupales disponibles</p>
                        <p className="text-gray-500 text-sm">Para la fecha seleccionada. Intenta con otra fecha.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        {/* Personal Training Tab */}
        <TabsContent value="personal-training" className="space-y-6">
          <div className="flex gap-4">
            <Select
              value={selectedInstructor?.toString() || ''}
              onValueChange={(value) => setSelectedInstructor(value === 'all-instructors' ? undefined : Number(value))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-instructors">Todos los instructores</SelectItem>
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
              onValueChange={(value) => setSelectedSpaceType(value === 'all-spaces' ? 'all-spaces' : value as SpecializedSpaceType)}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Tipo de espacio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-spaces">Todos los espacios</SelectItem>
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

      {/* Modal de Pago para Clases Grupales */}
      {selectedSlotForPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedSlotForPayment(null);
          }}
          onSuccess={handlePaymentSuccess}
          groupClass={selectedSlotForPayment as any}
          groupClassId={selectedSlotForPayment.groupClass?.id || 0}
          price={15000}
        />
      )}
    </div>
  );
}