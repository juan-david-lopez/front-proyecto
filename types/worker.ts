// types/worker.ts

import { UserRole } from './user';

export interface WorkerPermission {
  resource: string;
  actions: string[];
}

export interface WorkerProfile {
  id: string;
  userId: number;
  role: UserRole;
  permissions: WorkerPermission[];
  locationIds?: number[];
  specialties?: string[];
  schedule?: WorkerSchedule;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerSchedule {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isAvailable: boolean;
}

// Tipos específicos para Recepcionista
export interface CheckInRequest {
  memberId: number;
  accessType: 'gym' | 'class' | 'personal_training';
  classId?: number;
  reservationId?: number;
}

export interface CheckInResponse {
  success: boolean;
  member: {
    name: string;
    membershipType: string;
    photoUrl?: string;
    membershipStatus: 'active' | 'expired' | 'suspended';
  };
  accessGranted: boolean;
  message?: string;
}

export interface PaymentProcessRequest {
  memberId: number;
  amount: number;
  paymentType: 'membership_renewal' | 'new_membership' | 'personal_training' | 'additional_service';
  membershipTypeId?: number;
  serviceId?: number;
  paymentMethod: 'card' | 'cash' | 'transfer';
}

// Tipos específicos para Instructor
export interface ClassAttendance {
  classId: number;
  attendanceDate: string;
  members: MemberAttendance[];
}

export interface MemberAttendance {
  memberId: number;
  memberName: string;
  reservationId?: number;
  attended: boolean;
  notes?: string;
}

export interface InstructorAvailabilityUpdate {
  instructorId: number;
  date: string;
  availableSlots: TimeSlot[];
}

export interface MyClass {
  id: number;
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentReservations: number;
  location: string;
  reservedMembers: {
    id: number;
    name: string;
    email: string;
    reservationTime: string;
  }[];
}

// Tipos específicos para Administrador
export interface BusinessConfig {
  id?: number;
  gymName: string;
  locations: GymLocation[];
  membershipTypes: MembershipTypeConfig[];
  classTypes: ClassTypeConfig[];
  businessHours: BusinessHours;
  gamificationRules: GamificationConfig;
}

export interface GymLocation {
  id: number;
  name: string;
  address: string;
  capacity: number;
  facilities: string[];
  isActive: boolean;
}

export interface MembershipTypeConfig {
  id: number;
  name: string;
  price: number;
  duration: number; // dias
  benefits: string[];
  maxReservations: number;
  accessToSpecializedSpaces: boolean;
  personalTrainingSessions: number;
}

export interface ClassTypeConfig {
  id: number;
  name: string;
  description: string;
  duration: number; // minutos
  maxCapacity: number;
  requiredEquipment: string[];
  instructorRequired: boolean;
  membershipTierRequired: 'basico' | 'premium' | 'elite';
}

export interface BusinessHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

export interface GamificationConfig {
  pointsPerCheckIn: number;
  pointsPerClassAttendance: number;
  pointsPerPersonalTraining: number;
  monthlyGoalPoints: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  category: 'attendance' | 'consistency' | 'milestone' | 'special';
}

export interface KPIReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    totalRevenue: number;
    newMembers: number;
    memberRetention: number;
    classAttendance: number;
    popularClasses: string[];
    peakHours: string[];
    averageStayTime: number;
    equipmentUsage: { [key: string]: number };
  };
}

// Permisos por defecto para cada rol
export const DEFAULT_PERMISSIONS: Record<UserRole, WorkerPermission[]> = {
  [UserRole.ADMIN]: [
    { resource: 'members', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'workers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reservations', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'payments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'configuration', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'classes', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'check-in', actions: ['create', 'read', 'update'] },
  ],
  [UserRole.RECEPTIONIST]: [
    { resource: 'members', actions: ['create', 'read', 'update'] },
    { resource: 'reservations', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'payments', actions: ['create', 'read'] },
    { resource: 'check-in', actions: ['create', 'read'] },
    { resource: 'classes', actions: ['read'] },
  ],
  [UserRole.INSTRUCTOR]: [
    { resource: 'classes', actions: ['read', 'update'] },
    { resource: 'attendance', actions: ['create', 'read', 'update'] },
    { resource: 'schedule', actions: ['read', 'update'] },
    { resource: 'members', actions: ['read'] },
    { resource: 'reservations', actions: ['read'] },
  ],
  [UserRole.MEMBER]: [
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'reservations', actions: ['create', 'read', 'delete'] },
    { resource: 'classes', actions: ['read'] },
    { resource: 'payments', actions: ['read'] },
  ],
};