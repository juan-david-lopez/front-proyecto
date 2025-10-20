// types/reservation.ts

export enum ReservationType {
  GROUP_CLASS = "GROUP_CLASS",
  PERSONAL_TRAINING = "PERSONAL_TRAINING",
  SPECIALIZED_SPACE = "SPECIALIZED_SPACE"
}

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW"
}

export enum GroupClassType {
  YOGA = "YOGA",
  CROSSFIT = "CROSSFIT",
  AEROBICS = "AEROBICS",
  SPINNING = "SPINNING",
  PILATES = "PILATES",
  ZUMBA = "ZUMBA",
  FUNCTIONAL = "FUNCTIONAL",
  BOXING = "BOXING"
}

export enum SpecializedSpaceType {
  SAUNA = "SAUNA",
  STEAM_ROOM = "STEAM_ROOM",
  JACUZZI = "JACUZZI",
  MASSAGE_ROOM = "MASSAGE_ROOM",
  PRIVATE_TRAINING_ROOM = "PRIVATE_TRAINING_ROOM",
  SPINNING_STUDIO = "SPINNING_STUDIO",
  YOGA_STUDIO = "YOGA_STUDIO"
}

// Instructor interface
export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialties: GroupClassType[];
  rating?: number;
  experience: number; // years
  avatar?: string;
  isAvailable: boolean;
}

// Group Class interface
export interface GroupClass {
  id: number;
  name: string;
  type: GroupClassType;
  description: string;
  instructorId: number;
  instructor?: Instructor;
  locationId: number;
  maxCapacity: number;
  currentEnrollment: number;
  duration: number; // minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment?: string[];
  imageUrl?: string;
}

// Schedule interface for time slots
export interface Schedule {
  id: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  isRecurring: boolean;
  specificDate?: string; // YYYY-MM-DD for one-time classes
}

// Available slot for any type of reservation
export interface AvailableSlot {
  id: string;
  type: ReservationType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  isAvailable: boolean;
  remainingSpots?: number; // for group classes
  instructorId?: number;
  instructor?: Instructor;
  groupClass?: GroupClass;
  specializedSpace?: SpecializedSpace;
  price?: number;
  // Additional fields for rendering compatibility
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  requiresPayment?: boolean;
  status?: ReservationStatus;
}

// Specialized Space interface
export interface SpecializedSpace {
  id: number;
  name: string;
  type: SpecializedSpaceType;
  description: string;
  capacity: number;
  locationId: number;
  pricePerHour: number;
  amenities: string[];
  imageUrl?: string;
  isAvailable: boolean;
}

// Reservation interface
export interface Reservation {
  id: number;
  userId: number;
  type: ReservationType;
  status: ReservationStatus;
  reservationDate: string; // ISO date when reservation was made
  scheduledDate: string; // YYYY-MM-DD
  scheduledStartTime: string; // HH:mm
  scheduledEndTime: string;
  
  // Optional fields based on reservation type
  groupClassId?: number;
  groupClass?: GroupClass;
  instructorId?: number;
  instructor?: Instructor;
  specializedSpaceId?: number;
  specializedSpace?: SpecializedSpace;
  
  // Additional info
  notes?: string;
  price: number;
  locationId: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
}

// Request interfaces for API calls
export interface CreateReservationRequest {
  type: ReservationType;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  groupClassId?: number;
  instructorId?: number;
  specializedSpaceId?: number;
  notes?: string;
  locationId: number;
}

export interface UpdateReservationRequest {
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  notes?: string;
  status?: ReservationStatus;
}

export interface CancelReservationRequest {
  reason?: string;
}

// Query interfaces
export interface AvailabilityQuery {
  type: ReservationType;
  date: string;
  locationId?: number;
  instructorId?: number;
  groupClassType?: GroupClassType;
  spaceType?: SpecializedSpaceType;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  type?: ReservationType;
  startDate?: string;
  endDate?: string;
  locationId?: number;
  instructorId?: number;
}

// Dashboard summary interfaces
export interface ReservationSummary {
  totalActive: number;
  upcomingToday: number;
  upcomingThisWeek: number;
  recentReservations: Reservation[];
}

export interface QuickStats {
  totalReservations: number;
  completedClasses: number;
  cancelledReservations: number;
  favoriteActivityType: ReservationType;
}

// Calendar event interface for display
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: ReservationType;
  status: ReservationStatus;
  color: string;
  reservation?: Reservation;
  availableSlot?: AvailableSlot;
}

// Location interface
export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  amenities: string[];
  operatingHours: {
    [key: string]: { open: string; close: string; }; // day: {open, close}
  };
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}