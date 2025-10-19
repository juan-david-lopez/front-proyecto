// types/loyalty.ts

export type TierName = 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO';

export type ActivityType = 
  | 'MEMBERSHIP_PURCHASE'
  | 'MEMBERSHIP_RENEWAL'
  | 'MEMBERSHIP_UPGRADE'
  | 'CLASS_ATTENDANCE'
  | 'REFERRAL'
  | 'LOGIN_STREAK'
  | 'EARLY_RENEWAL'
  | 'PAYMENT_ON_TIME'
  | 'SOCIAL_SHARE'
  | 'PROFILE_COMPLETION';

export type RewardType =
  | 'FREE_CLASS'
  | 'RENEWAL_DISCOUNT'
  | 'TEMPORARY_UPGRADE'
  | 'PERSONAL_TRAINING'
  | 'GUEST_PASS'
  | 'MERCHANDISE_DISCOUNT'
  | 'NUTRITIONAL_CONSULTATION'
  | 'EXTENSION_DAYS';

export type RedemptionStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';

export interface TierBenefits {
  tierName: TierName;
  renewalDiscountPercentage: number;
  additionalClassesPerMonth: number;
  freeGuestPassesPerMonth: number;
  priorityReservations: boolean;
  description: string;
}

export interface LoyaltyProfile {
  idLoyaltyProfile: number;
  userId: number;
  userEmail: string;
  userName: string;
  currentTier: TierName;
  totalPoints: number;
  availablePoints: number;
  memberSince: string;
  monthsAsMember: number;
  lastActivityDate: string;
  totalActivitiesLogged: number;
  consecutiveLoginDays: number;
  totalReferrals: number;
  classesAttended: number;
  renewalsCompleted: number;
  tierBenefits: TierBenefits;
  monthsToNextTier: number;
  nextTier: TierName | null;
}

export interface LoyaltyActivity {
  idLoyaltyActivity: number;
  activityType: ActivityType;
  activityTypeDisplayName: string;
  pointsEarned: number;
  description: string;
  activityDate: string;
  expirationDate: string;
  isExpired: boolean;
  isCancelled: boolean;
}

export interface LoyaltyReward {
  idLoyaltyReward: number;
  name: string;
  description: string;
  rewardType: RewardType;
  rewardTypeDisplayName: string;
  pointsCost: number;
  minimumTierRequired: TierName;
  validityDays: number;
  rewardValue: string;
  termsAndConditions: string;
  canUserAfford?: boolean;
  meetsMinimumTier?: boolean;
}

export interface LoyaltyRedemption {
  idLoyaltyRedemption: number;
  redemptionCode: string;
  rewardName: string;
  rewardType: RewardType;
  rewardTypeDisplayName?: string;
  pointsSpent: number;
  status: RedemptionStatus;
  redemptionDate: string;
  expirationDate: string;
  usedDate?: string;
  canBeUsed: boolean;
  notes?: string;
}

export interface LoyaltyDashboard {
  profile: LoyaltyProfile;
  recentActivities: LoyaltyActivity[];
  activeRedemptions: LoyaltyRedemption[];
  recommendedRewards: LoyaltyReward[];
  pointsExpiringInNext30Days: number;
  motivationalMessage: string;
}

export interface RedeemRewardRequest {
  rewardId: number;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
