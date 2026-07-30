export interface AdminDashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  /** Sum of `orderTotal` over every order that was not cancelled. */
  totalRevenue: number;
}
