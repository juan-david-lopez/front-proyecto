// services/reservationService.ts
import {
  Reservation,
  AvailableSlot,
  GroupClass,
  Instructor,
  SpecializedSpace,
  Location,
  CreateReservationRequest,
  UpdateReservationRequest,
  CancelReservationRequest,
  AvailabilityQuery,
  ReservationFilters,
  ReservationSummary,
  QuickStats,
  ReservationType,
  GroupClassType,
  SpecializedSpaceType,
  ReservationStatus,
  ApiResponse,
  PaginatedResponse,
} from '@/types/reservation';

class ReservationService {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api' 
        : 'https://desplieguefitzone.onrender.com/api';
    }
    return 'https://desplieguefitzone.onrender.com/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();
    
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Silenciar errores de conexión para evitar spam en consola
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Servidor no disponible, devolver datos mock en desarrollo
        console.warn(`Backend server not available for ${endpoint}. Using fallback data.`);
        return this.getMockData(endpoint) as T;
      }
      console.error(`Error in request to ${endpoint}:`, error);
      throw error;
    }
  }

  private getMockData(endpoint: string): any {
    // Devolver datos mock para endpoints comunes cuando el servidor no esté disponible
    if (endpoint.includes('/reservations/my')) {
      return [];
    }
    if (endpoint.includes('/reservations/upcoming')) {
      return [];
    }
    return null;
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // ---------------------------
  // AVAILABILITY QUERIES
  // ---------------------------

  /**
   * Get available slots for any type of reservation
   */
  async getAvailableSlots(query: AvailabilityQuery): Promise<AvailableSlot[]> {
    const params = new URLSearchParams();
    params.append('type', query.type);
    params.append('date', query.date);
    
    if (query.locationId) params.append('locationId', query.locationId.toString());
    if (query.instructorId) params.append('instructorId', query.instructorId.toString());
    if (query.groupClassType) params.append('groupClassType', query.groupClassType);
    if (query.spaceType) params.append('spaceType', query.spaceType);

    const response = await this.request<ApiResponse<AvailableSlot[]>>(`/reservations/availability?${params}`);
    return response.data || [];
  }

  /**
   * Get group classes schedule
   */
  async getGroupClassesSchedule(date: string, locationId?: number, classType?: GroupClassType): Promise<AvailableSlot[]> {
    return this.getAvailableSlots({
      type: ReservationType.GROUP_CLASS,
      date,
      locationId,
      groupClassType: classType,
    });
  }

  /**
   * Get personal training availability
   */
  async getPersonalTrainingAvailability(date: string, instructorId?: number, locationId?: number): Promise<AvailableSlot[]> {
    return this.getAvailableSlots({
      type: ReservationType.PERSONAL_TRAINING,
      date,
      instructorId,
      locationId,
    });
  }

  /**
   * Get specialized spaces availability
   */
  async getSpecializedSpacesAvailability(date: string, spaceType?: SpecializedSpaceType, locationId?: number): Promise<AvailableSlot[]> {
    return this.getAvailableSlots({
      type: ReservationType.SPECIALIZED_SPACE,
      date,
      spaceType,
      locationId,
    });
  }

  // ---------------------------
  // RESERVATION MANAGEMENT
  // ---------------------------

  /**
   * Create a new reservation
   */
  async createReservation(reservationData: CreateReservationRequest): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    return response.data!;
  }

  /**
   * Get user's reservations with filters
   */
  async getMyReservations(filters?: ReservationFilters): Promise<Reservation[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.locationId) params.append('locationId', filters.locationId.toString());
      if (filters.instructorId) params.append('instructorId', filters.instructorId.toString());
    }

    const response = await this.request<ApiResponse<Reservation[]>>(`/reservations/my?${params}`);
    return response.data || [];
  }

  /**
   * Get specific reservation by ID
   */
  async getReservationById(reservationId: number): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>(`/reservations/${reservationId}`);
    return response.data!;
  }

  /**
   * Update an existing reservation
   */
  async updateReservation(reservationId: number, updateData: UpdateReservationRequest): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>(`/reservations/${reservationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data!;
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(reservationId: number, cancelData?: CancelReservationRequest): Promise<void> {
    await this.request<ApiResponse>(`/reservations/${reservationId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(cancelData || {}),
    });
  }

  // ---------------------------
  // GROUP CLASSES
  // ---------------------------

  /**
   * Get all available group classes
   */
  async getGroupClasses(locationId?: number, classType?: GroupClassType): Promise<GroupClass[]> {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId.toString());
    if (classType) params.append('type', classType);

    const response = await this.request<ApiResponse<GroupClass[]>>(`/classes/group?${params}`);
    return response.data || [];
  }

  /**
   * Get group class details
   */
  async getGroupClassById(classId: number): Promise<GroupClass> {
    const response = await this.request<ApiResponse<GroupClass>>(`/classes/group/${classId}`);
    return response.data!;
  }

  // ---------------------------
  // INSTRUCTORS
  // ---------------------------

  /**
   * Get all available instructors
   */
  async getInstructors(speciality?: GroupClassType, locationId?: number): Promise<Instructor[]> {
    const params = new URLSearchParams();
    if (speciality) params.append('speciality', speciality);
    if (locationId) params.append('locationId', locationId.toString());

    const response = await this.request<ApiResponse<Instructor[]>>(`/instructors?${params}`);
    return response.data || [];
  }

  /**
   * Get instructor details
   */
  async getInstructorById(instructorId: number): Promise<Instructor> {
    const response = await this.request<ApiResponse<Instructor>>(`/instructors/${instructorId}`);
    return response.data!;
  }

  /**
   * Get instructor availability for personal training
   */
  async getInstructorAvailability(instructorId: number, date: string): Promise<AvailableSlot[]> {
    return this.getPersonalTrainingAvailability(date, instructorId);
  }

  // ---------------------------
  // SPECIALIZED SPACES
  // ---------------------------

  /**
   * Get all specialized spaces
   */
  async getSpecializedSpaces(locationId?: number, spaceType?: SpecializedSpaceType): Promise<SpecializedSpace[]> {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId.toString());
    if (spaceType) params.append('type', spaceType);

    const response = await this.request<ApiResponse<SpecializedSpace[]>>(`/spaces/specialized?${params}`);
    return response.data || [];
  }

  /**
   * Get specialized space details
   */
  async getSpecializedSpaceById(spaceId: number): Promise<SpecializedSpace> {
    const response = await this.request<ApiResponse<SpecializedSpace>>(`/spaces/specialized/${spaceId}`);
    return response.data!;
  }

  // ---------------------------
  // LOCATIONS
  // ---------------------------

  /**
   * Get all locations
   */
  async getLocations(): Promise<Location[]> {
    const response = await this.request<ApiResponse<Location[]>>('/locations');
    return response.data || [];
  }

  /**
   * Get location details
   */
  async getLocationById(locationId: number): Promise<Location> {
    const response = await this.request<ApiResponse<Location>>(`/locations/${locationId}`);
    return response.data!;
  }

  // ---------------------------
  // DASHBOARD & SUMMARIES
  // ---------------------------

  /**
   * Get reservation summary for dashboard
   */
  async getReservationSummary(): Promise<ReservationSummary> {
    const response = await this.request<ApiResponse<ReservationSummary>>('/reservations/summary');
    return response.data!;
  }

  /**
   * Get quick stats
   */
  async getQuickStats(): Promise<QuickStats> {
    const response = await this.request<ApiResponse<QuickStats>>('/reservations/stats');
    return response.data!;
  }

  /**
   * Get upcoming reservations (next 7 days)
   */
  async getUpcomingReservations(): Promise<Reservation[]> {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.getMyReservations({
      status: ReservationStatus.ACTIVE,
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
    });
  }

  // ---------------------------
  // UTILITY METHODS
  // ---------------------------

  /**
   * Check if user can reserve (based on membership)
   */
  async canMakeReservation(type: ReservationType): Promise<boolean> {
    try {
      const response = await this.request<ApiResponse<{ canReserve: boolean; reason?: string }>>(`/reservations/can-reserve?type=${type}`);
      return response.data?.canReserve || false;
    } catch (error) {
      console.error('Error checking reservation eligibility:', error);
      return false;
    }
  }

  /**
   * Get reservation limits based on membership
   */
  async getReservationLimits(): Promise<{
    groupClasses: number;
    personalTraining: number;
    specializedSpaces: number;
  }> {
    try {
      const response = await this.request<ApiResponse<any>>('/reservations/limits');
      return response.data || { groupClasses: 0, personalTraining: 0, specializedSpaces: 0 };
    } catch (error) {
      console.error('Error getting reservation limits:', error);
      return { groupClasses: 0, personalTraining: 0, specializedSpaces: 0 };
    }
  }

  /**
   * Format date for API calls
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Format time for API calls
   */
  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:mm
  }

  /**
   * Parse time string to minutes for calculations
   */
  parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Check if reservation can be cancelled (usually up to 2 hours before)
   */
  canCancelReservation(reservation: Reservation): boolean {
    const reservationDateTime = new Date(`${reservation.scheduledDate}T${reservation.scheduledStartTime}`);
    const now = new Date();
    const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilReservation >= 2 && reservation.status === ReservationStatus.ACTIVE;
  }

  /**
   * Get display name for activity types
   */
  getActivityTypeDisplayName(type: ReservationType): string {
    switch (type) {
      case ReservationType.GROUP_CLASS:
        return 'Clase Grupal';
      case ReservationType.PERSONAL_TRAINING:
        return 'Entrenamiento Personal';
      case ReservationType.SPECIALIZED_SPACE:
        return 'Espacio Especializado';
      default:
        return 'Reserva';
    }
  }

  /**
   * Get display name for group class types
   */
  getGroupClassTypeDisplayName(type: GroupClassType): string {
    const names = {
      [GroupClassType.YOGA]: 'Yoga',
      [GroupClassType.CROSSFIT]: 'CrossFit',
      [GroupClassType.AEROBICS]: 'Aeróbicos',
      [GroupClassType.SPINNING]: 'Spinning',
      [GroupClassType.PILATES]: 'Pilates',
      [GroupClassType.ZUMBA]: 'Zumba',
      [GroupClassType.FUNCTIONAL]: 'Entrenamiento Funcional',
      [GroupClassType.BOXING]: 'Boxeo',
    };
    return names[type] || type;
  }

  /**
   * Get display name for specialized space types
   */
  getSpecializedSpaceTypeDisplayName(type: SpecializedSpaceType): string {
    const names = {
      [SpecializedSpaceType.SAUNA]: 'Sauna',
      [SpecializedSpaceType.STEAM_ROOM]: 'Baño de Vapor',
      [SpecializedSpaceType.JACUZZI]: 'Jacuzzi',
      [SpecializedSpaceType.MASSAGE_ROOM]: 'Sala de Masajes',
      [SpecializedSpaceType.PRIVATE_TRAINING_ROOM]: 'Sala de Entrenamiento Privado',
      [SpecializedSpaceType.SPINNING_STUDIO]: 'Estudio de Spinning',
      [SpecializedSpaceType.YOGA_STUDIO]: 'Estudio de Yoga',
    };
    return names[type] || type;
  }
}

export const reservationService = new ReservationService();
export default reservationService;