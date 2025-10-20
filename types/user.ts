// types/user.ts
export enum DocumentType {
  CC = "CC",
  CE = "CE",
  PASSPORT = "PASSPORT"
}

export enum UserRole {
  ADMIN = "ADMIN",
  RECEPTIONIST = "RECEPTIONIST", 
  INSTRUCTOR = "INSTRUCTOR",
  MEMBER = "MEMBER" // Cambio: CLIENT → MEMBER para coincidir con backend
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  password: string;
  phoneNumber: string;
  birthDate: string; // yyyy-MM-dd formato
  emergencyContactPhone: string; // OBLIGATORIO según backend
  medicalConditions?: string;
  mainLocationId: number; // OBLIGATORIO: Se selecciona en registro para evitar needsLocation
  role: UserRole;
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  phoneNumber: string;
  birthDate: string; // yyyy-MM-dd
  emergencyContactPhone?: string; // Opcional
  medicalConditions?: string;
}

export interface UserResponse {
  idUser: number;
  name: string; // Backend devuelve 'name' no firstName/lastName
  email: string;
  role: string; // Backend devuelve role como string
  emergencyContactPhone: string;
  medicalConditions?: string;
  userRole: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mainLocationId?: number;
  membershipType?: string | null; // Añadido para reflejar la membresía activa
  avatar?: string; // Añadido para foto de perfil
  phone?: string;
  address?: string;
  birthDate?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: number;
  error?: string;
  details?: string;
  message?: string;
  status?: string;
  step?: number;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  membershipStatus?: any;
  data?: T;
}