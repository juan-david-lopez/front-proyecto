// services/loyaltyService.ts
import type {
  LoyaltyDashboard,
  LoyaltyProfile,
  LoyaltyReward,
  LoyaltyRedemption,
  LoyaltyActivity,
  TierBenefits,
  RedeemRewardRequest,
  ApiResponse,
  TierName
} from '@/types/loyalty';
import { API_CONFIG } from '@/lib/api-config';

const BASE_URL = `${API_CONFIG.BASE_URL}/loyalty`;

// Helper para obtener el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper para manejar respuestas fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<T> = await response.json();
  return result.data;
}

class LoyaltyService {
  /**
   * Obtener dashboard completo con perfil, actividades recientes, canjes activos
   */
  async getDashboard(): Promise<LoyaltyDashboard> {
    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyDashboard>(response);
    } catch (error) {
      console.error('Error fetching loyalty dashboard:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil de fidelización del usuario
   */
  async getProfile(): Promise<LoyaltyProfile> {
    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyProfile>(response);
    } catch (error) {
      console.error('Error fetching loyalty profile:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las recompensas disponibles
   */
  async getRewards(): Promise<LoyaltyReward[]> {
    try {
      const response = await fetch(`${BASE_URL}/rewards`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyReward[]>(response);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw error;
    }
  }

  /**
   * Obtener solo recompensas que el usuario puede costear
   */
  async getAffordableRewards(): Promise<LoyaltyReward[]> {
    try {
      const response = await fetch(`${BASE_URL}/rewards/affordable`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyReward[]>(response);
    } catch (error) {
      console.error('Error fetching affordable rewards:', error);
      throw error;
    }
  }

  /**
   * Obtener una recompensa específica por ID
   */
  async getRewardById(rewardId: number): Promise<LoyaltyReward> {
    try {
      const response = await fetch(`${BASE_URL}/rewards/${rewardId}`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyReward>(response);
    } catch (error) {
      console.error(`Error fetching reward ${rewardId}:`, error);
      throw error;
    }
  }

  /**
   * Canjear una recompensa
   */
  async redeemReward(request: RedeemRewardRequest): Promise<LoyaltyRedemption> {
    try {
      const response = await fetch(`${BASE_URL}/redeem`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });
      return await handleResponse<LoyaltyRedemption>(response);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los canjes del usuario
   */
  async getRedemptions(): Promise<LoyaltyRedemption[]> {
    try {
      const response = await fetch(`${BASE_URL}/redemptions`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyRedemption[]>(response);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      throw error;
    }
  }

  /**
   * Obtener canjes activos del usuario
   */
  async getActiveRedemptions(): Promise<LoyaltyRedemption[]> {
    try {
      const redemptions = await this.getRedemptions();
      return redemptions.filter(r => r.status === 'ACTIVE');
    } catch (error) {
      console.error('Error fetching active redemptions:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de actividades
   */
  async getActivities(): Promise<LoyaltyActivity[]> {
    try {
      const response = await fetch(`${BASE_URL}/activities`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<LoyaltyActivity[]>(response);
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  /**
   * Obtener beneficios de un nivel específico
   */
  async getTierBenefits(tier: TierName): Promise<TierBenefits> {
    try {
      const response = await fetch(`${BASE_URL}/tiers/${tier}/benefits`, {
        headers: getAuthHeaders()
      });
      return await handleResponse<TierBenefits>(response);
    } catch (error) {
      console.error(`Error fetching tier benefits for ${tier}:`, error);
      throw error;
    }
  }

  /**
   * Obtener beneficios de todos los niveles
   */
  async getAllTiersBenefits(): Promise<Record<TierName, TierBenefits>> {
    try {
      const tiers: TierName[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO'];
      const benefits = await Promise.all(
        tiers.map(tier => this.getTierBenefits(tier))
      );
      
      return {
        BRONCE: benefits[0],
        PLATA: benefits[1],
        ORO: benefits[2],
        PLATINO: benefits[3]
      };
    } catch (error) {
      console.error('Error fetching all tiers benefits:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const loyaltyService = new LoyaltyService();
export default loyaltyService;
