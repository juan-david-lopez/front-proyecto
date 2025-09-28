import { 
  MembershipTypeResponse, 
  CreateMembershipRequest, 
  MembershipTypeName, 
  MembershipStatusResponse, 
} from '@/types/membership';

interface ApiResponse<T = any> {
  success: boolean;
  timestamp: number;
  error?: string;
  details?: string;
  message?: string;
  status?: string;
  data?: T;
}

export interface MembershipInfo {
  isActive: boolean;
  status: "ACTIVE" | "INACTIVE";
  membershipType: MembershipTypeName | "NONE";
  expiryDate: string | null;
}

class MembershipService {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8080';
    }
    return 'https://desplieguefitzone.onrender.com';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 Making request to:', url);

    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    const token = this.getAccessToken();
    if (token) defaultOptions.headers = { ...defaultOptions.headers, Authorization: `Bearer ${token}` };

    try {
      const response = await fetch(url, defaultOptions);
      console.log('📥 Response status:', response.status);

      if (response.status === 204) return {} as T;

      const text = await response.text();
      console.log('📥 Raw response text:', text);

      let data;
      try { data = text ? JSON.parse(text) : { success: false, error: 'Empty response' }; }
      catch { throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`); }

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

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    return null;
  }

  // ---------------------------
  // Membership Types
  // ---------------------------
  async getMembershipTypes(): Promise<MembershipTypeResponse[]> {
    const response = await this.request<ApiResponse<MembershipTypeResponse[]>>('/membership-types');
    return response.data || [];
  }

  async getMembershipTypeById(id: number): Promise<MembershipTypeResponse> {
    const response = await this.request<ApiResponse<MembershipTypeResponse>>(`/membership-types/${id}`);
    return response.data!;
  }

  async getMembershipTypeByName(name: MembershipTypeName): Promise<MembershipTypeResponse> {
    const params = new URLSearchParams({ name }).toString();
    const response = await this.request<ApiResponse<MembershipTypeResponse>>(`/membership-types/by-name?${params}`);
    return response.data!;
  }

  // ---------------------------
  // Membership Management
  // ---------------------------
  async createMembership(request: CreateMembershipRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/memberships/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getMembershipByUserId(userId: number): Promise<MembershipInfo> {
    const response = await this.request<ApiResponse<MembershipInfo>>(`/memberships/${userId}`);
    return response.data!;
  }

  async checkMembership(userId: number): Promise<MembershipStatusResponse> {
    try {
      const response = await this.request<ApiResponse<MembershipStatusResponse>>(`/memberships/status/${userId}`);
      return response.data ?? {
        isActive: false,
        status: "INACTIVE",
        membershipType: MembershipTypeName.NONE,
      };
    } catch (error) {
      console.error("❌ Error al verificar membresía:", error);
      return {
        isActive: false,
        status: "INACTIVE",
        membershipType: MembershipTypeName.NONE,
      };
    }
  }

  // ---------------------------
  // Payment
  // ---------------------------
  async createPaymentIntent(amount: number, currency: string = 'cop', description: string): Promise<string> {
    const response = await this.request<ApiResponse<{ clientSecret: string }>>('/memberships/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, description }),
    });
    return response.data?.clientSecret || '';
  }
}

export const membershipService = new MembershipService();
export default membershipService;
