// services/locationService.ts
import { Location } from '@/types/reservation';
import { API_CONFIG } from '@/lib/api-config';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: number;
}

class LocationService {
  private baseURL: string = API_CONFIG.BASE_URL;

  constructor() {
    // Configurado desde API_CONFIG
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 [LocationService] Request to:', url);

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getAccessToken();
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, defaultOptions);
      console.log('📥 [LocationService] Response status:', response.status);

      if (response.status === 204) {
        return {} as T;
      }

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : { success: false, error: 'Empty response' };
      } catch (parseError) {
        console.error('❌ [LocationService] JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        console.error('❌ [LocationService] HTTP Error:', errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ [LocationService] Request failed:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las sedes/ubicaciones disponibles
   * @returns Lista de sedes con id, nombre, dirección, etc.
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      console.log('📍 [LocationService] Obteniendo todas las sedes...');
      const response = await this.request<ApiResponse<Location[]>>('/locations');
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ [LocationService] ${response.data.length} sedes encontradas`);
        return response.data;
      }

      console.warn('⚠️ [LocationService] No se encontraron sedes');
      return [];
    } catch (error) {
      console.error('❌ [LocationService] Error obteniendo sedes:', error);
      // Retornar sedes por defecto en caso de error
      return this.getDefaultLocations();
    }
  }

  /**
   * Obtener una sede específica por ID
   * @param locationId ID de la sede
   * @returns Sede encontrada
   */
  async getLocationById(locationId: number): Promise<Location | null> {
    try {
      console.log(`📍 [LocationService] Obteniendo sede ID: ${locationId}...`);
      const response = await this.request<ApiResponse<Location>>(`/locations/${locationId}`);
      
      if (response.data) {
        console.log(`✅ [LocationService] Sede encontrada:`, response.data.name);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`❌ [LocationService] Error obteniendo sede ${locationId}:`, error);
      return null;
    }
  }

  /**
   * Sedes por defecto (fallback)
   * Usar solo si el backend no está disponible
   */
  private getDefaultLocations(): Location[] {
    return [
      {
        id: 1,
        name: 'Sede Norte',
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        phone: '+57 300 123 4567',
        amenities: ['Pesas', 'Cardio', 'Clases Grupales', 'Spinning'],
        operatingHours: {
          'Lunes': { open: '06:00', close: '22:00' },
          'Martes': { open: '06:00', close: '22:00' },
          'Miércoles': { open: '06:00', close: '22:00' },
          'Jueves': { open: '06:00', close: '22:00' },
          'Viernes': { open: '06:00', close: '22:00' },
          'Sábado': { open: '08:00', close: '20:00' },
          'Domingo': { open: '08:00', close: '18:00' }
        }
      },
      {
        id: 2,
        name: 'Sede Sur',
        address: 'Carrera 98 #76-54',
        city: 'Medellín',
        phone: '+57 300 234 5678',
        amenities: ['Pesas', 'Cardio', 'Piscina', 'Spa'],
        operatingHours: {
          'Lunes': { open: '06:00', close: '22:00' },
          'Martes': { open: '06:00', close: '22:00' },
          'Miércoles': { open: '06:00', close: '22:00' },
          'Jueves': { open: '06:00', close: '22:00' },
          'Viernes': { open: '06:00', close: '22:00' },
          'Sábado': { open: '08:00', close: '20:00' },
          'Domingo': { open: '08:00', close: '18:00' }
        }
      },
      {
        id: 3,
        name: 'Sede Centro',
        address: 'Avenida 50 #30-20',
        city: 'Cali',
        phone: '+57 300 345 6789',
        amenities: ['Pesas', 'Cardio', 'Yoga', 'Pilates'],
        operatingHours: {
          'Lunes': { open: '06:00', close: '22:00' },
          'Martes': { open: '06:00', close: '22:00' },
          'Miércoles': { open: '06:00', close: '22:00' },
          'Jueves': { open: '06:00', close: '22:00' },
          'Viernes': { open: '06:00', close: '22:00' },
          'Sábado': { open: '08:00', close: '20:00' },
          'Domingo': { open: '08:00', close: '18:00' }
        }
      },
      {
        id: 4,
        name: 'Sede Oriente',
        address: 'Calle 10 #15-25',
        city: 'Barranquilla',
        phone: '+57 300 456 7890',
        amenities: ['Pesas', 'Cardio', 'Crossfit', 'Box'],
        operatingHours: {
          'Lunes': { open: '06:00', close: '22:00' },
          'Martes': { open: '06:00', close: '22:00' },
          'Miércoles': { open: '06:00', close: '22:00' },
          'Jueves': { open: '06:00', close: '22:00' },
          'Viernes': { open: '06:00', close: '22:00' },
          'Sábado': { open: '08:00', close: '20:00' },
          'Domingo': { open: '08:00', close: '18:00' }
        }
      }
    ];
  }
}

export const locationService = new LocationService();
export default locationService;
