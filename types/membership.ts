// types/membership.ts
export enum MembershipTypeName {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  VIP = "VIP",
  NONE = "NONE"   // 👈 extra por si no hay membresía
}

export interface MembershipType {
  idMembershipType: number;
  name: MembershipTypeName;
  description: string;
  monthlyPrice: number;
  accessToAllLocation: boolean;
  groupClassesSessionsIncluded: number;
  personalTrainingIncluded: number;
  specializedClassesIncluded: boolean;
}

export interface MembershipTypeResponse extends MembershipType {}

// Para crear membresías
export interface CreateMembershipRequest {
  userId: number;
  membershipTypeId: number;
  mainLocationId: number;
  paymentIntentId: string;
}

/**
 * Respuesta ligera para el estado de membresía (ej: para validaciones rápidas).
 */
export interface MembershipStatusResponse {
  isActive: boolean;
  status: "ACTIVE" | "INACTIVE";
  membershipType: MembershipTypeName;
  expiryDate?: string; 
}

/**
 * Información completa de la membresía (ej: para dashboard detallado).
 */
export interface MembershipInfo {
  id?: number;
  type?: MembershipType;     // objeto completo con detalles
  startDate?: string;        // inicio (ISO)
  endDate?: string;          // fin (ISO)
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  statusMessage?: string;
  daysRemaining?: number;
  isActive: boolean;
}
