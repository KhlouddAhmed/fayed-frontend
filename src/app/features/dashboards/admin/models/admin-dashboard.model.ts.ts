export interface CategoryStat {
  categoryName: string;
  percentage: number;
}

export interface RecentEvent {
  adminName: string;
  actionDescription: string;
  targetEntity: string;
  time: string; 
}

export interface DashboardStats {
  totalTradingVolume: number;
  volumeGrowthPercentage: number;
  pendingCompanies: number;
  totalUsers: number;
  openDisputes: number;
  categoryStats: CategoryStat[];
  recentEvents: RecentEvent[];
}