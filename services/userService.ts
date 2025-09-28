// services/userService.ts
import { UserRequest, UserUpdateRequest, UserResponse } from '@/types/user';

interface ApiResponse<T = any> {
  success: boolean;
  timestamp: number;
  error?: string;
  details?: string;
  message?: string;
  status?: string;
  data?: T;
}

class UserService {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8080';
    }
    
    return 'https://desplieguefitzone.onrender.com';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🔗 Making request to:', url);
    
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
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      console.log('📥 Response status:', response.status);
      
      // Para respuestas sin contenido (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const text = await response.text();
      console.log('📥 Raw response text:', text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : { success: false, error: "Empty response" };
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }
      
      console.log('📥 Parsed response data:', data);
      
      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }

  // Gestión de tokens (compartida con authService)
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Registro público (sin autenticación requerida)
  async publicRegister(userData: UserRequest): Promise<UserResponse> {
    const response = await this.request<ApiResponse<UserResponse>>('/users/public/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  // Registro con autenticación (requiere token de admin/recepcionista/instructor)
  async registerUser(userData: UserRequest): Promise<UserResponse> {
    const response = await this.request<ApiResponse<UserResponse>>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  // Actualizar usuario
  async updateUser(idUser: number, userData: UserUpdateRequest): Promise<UserResponse> {
    const response = await this.request<ApiResponse<UserResponse>>(`/users/${idUser}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  // Eliminar usuario (eliminación lógica)
  async deleteUser(idUser: number): Promise<void> {
    await this.request(`/users/${idUser}`, {
      method: 'DELETE',
    });
  }

  // Obtener usuario por ID
  async getUserById(idUser: number): Promise<UserResponse> {
    const response = await this.request<ApiResponse<UserResponse>>(`/users/${idUser}`);
    return response.data!;
  }

  // Obtener usuario por email
  async getUserByEmail(email: string): Promise<UserResponse> {
    const params = new URLSearchParams({ email });
    const response = await this.request<ApiResponse<UserResponse>>(`/users/by-email?${params}`);
    return response.data!;
  }

  // Obtener usuario por número de documento
  async getUserByDocumentNumber(documentNumber: string): Promise<UserResponse> {
    const params = new URLSearchParams({ documentNumber });
    const response = await this.request<ApiResponse<UserResponse>>(`/users/by-document?${params}`);
    return response.data!;
  }

  // Obtener todos los usuarios activos
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await this.request<ApiResponse<UserResponse[]>>('/users');
    return response.data || [];
  }

  // Métodos de utilidad (compartidos)
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getCurrentUser(): UserResponse | null {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  }

  setCurrentUser(userInfo: UserResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return roles.includes(user?.userRole || '');
  }

  // Compatibilidad con authService
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
}

export const userService = new UserService();
export default userService;