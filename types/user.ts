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
  CLIENT = "CLIENT"
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  password: string;
  phoneNumber: string;
  birthDate: string; // yyyy-MM-dd
  emergencyContactPhone: string;
  medicalConditions?: string;
  mainLocationId?: number;
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
  emergencyContactPhone: string;
  medicalConditions?: string;
}

export interface UserResponse {
  idUser: number;
  email: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phoneNumber: string;
  birthDate: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  userRole: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mainLocationId?: number;
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