// services/authService.ts - VERSIÓN ADAPTADA AL BACKEND
import { API_CONFIG } from '@/lib/api-config';

interface ApiResponse<T = any> {
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

class AuthService {
  private baseURL: string = API_CONFIG.BASE_URL;

  constructor() {
    // Ya está configurado en API_CONFIG
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("🔗 Making request to:", url);
    console.log("📤 Request options:", options);

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
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
      console.log("🔑 Token añadido al request");
    }

    try {
      const response = await fetch(url, defaultOptions);
      const text = await response.text();
      console.log("📥 Raw response text:", text);
      console.log("📊 Response status:", response.status, response.statusText);

      let data: ApiResponse;
      try {
        data = text ? JSON.parse(text) : { success: false, error: "Empty response" };
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      // ⚡ Normalizar respuesta: si el backend manda info en `data`, la subimos al nivel raíz
      if (data.data && typeof data.data === "object") {
        data = { ...data, ...data.data };
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        console.error("❌ API Error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Request successful:", data);
      return data as ApiResponse<T>;
    } catch (error) {
      console.error("❌ API Request failed:", error);
      throw error;
    }
  }

  // Login inicial
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request("/auth/login-2fa", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Verificar OTP para REGISTRO
  async verifyOtp(email: string, otp: string, type?: string): Promise<ApiResponse> {
    // Si no se proporciona type, usar "register" por defecto
    const verificationType = type || "register";
    console.log("🔗 Verificando OTP de REGISTRO con:", { email, otp, type: verificationType });
    
    // Probar primero con body JSON incluyendo el tipo
    try {
      const body = { 
        email, 
        otp, 
        type: verificationType,
        verificationType: verificationType // Enviar ambos por si acaso
      };
      const response = await this.request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return response;
    } catch (error) {
      console.log("❌ Falló con body JSON, probando con query params...");
      
      // Fallback: probar con query parameters
      const params = new URLSearchParams({ 
        email, 
        otp,
        type: verificationType,
        verificationType: verificationType
      });
      return this.request(`/auth/verify-otp?${params}`, { method: "POST" });
    }
  }

  // Verificar OTP para LOGIN (método específico)
  async verifyLoginOtp(email: string, otp: string): Promise<ApiResponse> {
    console.log("🔗 Verificando OTP de LOGIN con:", { email, otp });
    
    // Intentar diferentes formatos que el backend podría esperar
    const attempts = [
      // Formato 1: /auth/verify-login-otp con JSON body
      {
        endpoint: "/auth/verify-login-otp",
        options: {
          method: "POST",
          body: JSON.stringify({ email, otp })
        }
      },
      // Formato 2: /auth/login/verify-otp con JSON body
      {
        endpoint: "/auth/login/verify-otp", 
        options: {
          method: "POST",
          body: JSON.stringify({ email, otp })
        }
      },
      // Formato 3: /auth/verify-otp con type=login
      {
        endpoint: "/auth/verify-otp",
        options: {
          method: "POST", 
          body: JSON.stringify({ email, otp, type: "login" })
        }
      },
      // Formato 4: usando el mismo endpoint pero con código diferente en el body
      {
        endpoint: "/auth/verify-otp",
        options: {
          method: "POST",
          body: JSON.stringify({ email, code: otp, verificationType: "login" })
        }
      }
    ];

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      try {
        console.log(`🔄 Intento ${i + 1}: ${attempt.endpoint}`);
        const response = await this.request(attempt.endpoint, attempt.options);
        console.log(`✅ Éxito con ${attempt.endpoint}`);
        return response;
      } catch (error: any) {
        console.log(`❌ Falló intento ${i + 1} (${attempt.endpoint}):`, error.message);
        if (i === attempts.length - 1) {
          // Si todos los intentos fallan, lanzar el último error
          throw error;
        }
      }
    }
    
    // Esto nunca debería ejecutarse, pero TypeScript lo requiere
    throw new Error("Todos los intentos de verificación OTP fallaron");
  }

  // Reenviar OTP
  async resendOtp(email: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ email });
    return this.request(`/auth/resend-otp?${params}`, { method: "POST" });
  }

  // Olvidé mi contraseña
  async forgotPassword(email: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ email });
    return this.request(`/auth/forgot-password?${params}`, { method: "POST" });
  }

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Gestión de tokens
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("pendingLogin");
      localStorage.removeItem("user");
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Obtener información del usuario guardada
  getUserInfo() {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  }

  // Guardar información del usuario
  setUserInfo(userInfo: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
  }
}

export const authService = new AuthService();
export default authService;
