// services/authService.ts - VERSIÓN ADAPTADA AL BACKEND
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
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return "http://localhost:8080";
    }
    return "https://desplieguefitzone.onrender.com";
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("🔗 Making request to:", url);

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
    }

    try {
      const response = await fetch(url, defaultOptions);
      const text = await response.text();
      console.log("📥 Raw response text:", text);

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
        throw new Error(errorMessage);
      }

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

  // Verificar OTP
  async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ email, otp });
    return this.request(`/auth/verify-otp?${params}`, { method: "POST" });
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
