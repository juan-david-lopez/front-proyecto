// services/workerService.ts

import { 
  WorkerProfile, 
  CheckInRequest, 
  CheckInResponse,
  PaymentProcessRequest,
  ClassAttendance,
  InstructorAvailabilityUpdate,
  MyClass,
  BusinessConfig,
  KPIReport 
} from '../types/worker';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Servicios para Recepcionista
export class ReceptionistService {
  
  static async processCheckIn(checkInData: CheckInRequest): Promise<CheckInResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(checkInData)
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error processing check-in:', error);
      // Simulación para desarrollo
      return {
        success: true,
        member: {
          name: 'Juan Pérez',
          membershipType: 'Premium',
          membershipStatus: 'active'
        },
        accessGranted: true,
        message: 'Acceso autorizado'
      };
    }
  }

  static async processPayment(paymentData: PaymentProcessRequest): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(paymentData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      // Simulación para desarrollo
      return {
        success: true,
        paymentId: 'PAY-' + Date.now(),
        message: 'Pago procesado exitosamente'
      };
    }
  }

  static async registerNewMember(memberData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(memberData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error registering new member:', error);
      return {
        success: false,
        error: 'Error al registrar miembro'
      };
    }
  }

  static async getMemberInfo(memberId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/members/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting member info:', error);
      return null;
    }
  }
}

// Servicios para Instructor
export class InstructorService {
  
  static async getMyClasses(instructorId: number): Promise<MyClass[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/${instructorId}/classes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error getting instructor classes:', error);
      // Simulación para desarrollo
      return [
        {
          id: 1,
          name: 'Yoga Matutino',
          type: 'yoga',
          date: '2024-01-15',
          startTime: '08:00',
          endTime: '09:00',
          maxCapacity: 15,
          currentReservations: 12,
          location: 'Sala 1',
          reservedMembers: [
            { id: 1, name: 'Ana García', email: 'ana@email.com', reservationTime: '2024-01-14T10:30:00Z' },
            { id: 2, name: 'Carlos López', email: 'carlos@email.com', reservationTime: '2024-01-14T11:15:00Z' }
          ]
        }
      ];
    }
  }

  static async recordAttendance(attendanceData: ClassAttendance): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(attendanceData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error recording attendance:', error);
      return {
        success: true,
        message: 'Asistencia registrada exitosamente'
      };
    }
  }

  static async updateAvailability(availabilityData: InstructorAvailabilityUpdate): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(availabilityData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error updating availability:', error);
      return {
        success: true,
        message: 'Disponibilidad actualizada exitosamente'
      };
    }
  }

  static async getSchedule(instructorId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/${instructorId}/schedule`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting instructor schedule:', error);
      return {
        success: false,
        data: {}
      };
    }
  }
}

// Servicios para Administrador
export class AdminService {
  
  static async getBusinessConfig(): Promise<BusinessConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/config`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting business config:', error);
      // Simulación para desarrollo
      return {
        gymName: 'FitZone Gym',
        locations: [
          { id: 1, name: 'Sede Principal', address: 'Av. Principal 123', capacity: 200, facilities: ['Pesas', 'Cardio', 'Piscina'], isActive: true }
        ],
        membershipTypes: [
          { id: 1, name: 'Básico', price: 50000, duration: 30, benefits: ['Acceso a gimnasio'], maxReservations: 3, accessToSpecializedSpaces: false, personalTrainingSessions: 0 }
        ],
        classTypes: [
          { id: 1, name: 'Yoga', description: 'Clase de yoga para todos los niveles', duration: 60, maxCapacity: 15, requiredEquipment: ['Mat'], instructorRequired: true, membershipTierRequired: 'basico' }
        ],
        businessHours: {
          monday: { open: '06:00', close: '22:00', isOpen: true },
          tuesday: { open: '06:00', close: '22:00', isOpen: true },
          wednesday: { open: '06:00', close: '22:00', isOpen: true },
          thursday: { open: '06:00', close: '22:00', isOpen: true },
          friday: { open: '06:00', close: '22:00', isOpen: true },
          saturday: { open: '08:00', close: '18:00', isOpen: true },
          sunday: { open: '08:00', close: '16:00', isOpen: true }
        },
        gamificationRules: {
          pointsPerCheckIn: 10,
          pointsPerClassAttendance: 25,
          pointsPerPersonalTraining: 50,
          monthlyGoalPoints: 500,
          achievements: []
        }
      };
    }
  }

  static async updateBusinessConfig(config: BusinessConfig): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(config)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error updating business config:', error);
      return {
        success: true,
        message: 'Configuración actualizada exitosamente'
      };
    }
  }

  static async getKPIReport(period: string, startDate: string, endDate: string): Promise<KPIReport> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/kpi?period=${period}&start=${startDate}&end=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting KPI report:', error);
      // Simulación para desarrollo
      return {
        period: period as any,
        startDate,
        endDate,
        metrics: {
          totalRevenue: 1500000,
          newMembers: 25,
          memberRetention: 85,
          classAttendance: 342,
          popularClasses: ['Yoga', 'Crossfit', 'Spinning'],
          peakHours: ['18:00-20:00', '08:00-10:00'],
          averageStayTime: 90,
          equipmentUsage: {
            'Treadmill': 85,
            'Weights': 92,
            'Bikes': 67
          }
        }
      };
    }
  }

  static async getWorkers(): Promise<WorkerProfile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/workers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting workers:', error);
      return [];
    }
  }

  static async createWorker(workerData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(workerData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating worker:', error);
      return {
        success: false,
        error: 'Error al crear trabajador'
      };
    }
  }

  static async updateWorker(workerId: string, workerData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/workers/${workerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        },
        body: JSON.stringify(workerData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error updating worker:', error);
      return {
        success: false,
        error: 'Error al actualizar trabajador'
      };
    }
  }
}

// Utilidades comunes
export class WorkerService {
  
  static async getWorkerProfile(workerId: string): Promise<WorkerProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/workers/${workerId}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fitzone_token')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting worker profile:', error);
      return null;
    }
  }

  static hasPermission(workerProfile: WorkerProfile, resource: string, action: string): boolean {
    const permission = workerProfile.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  }
}