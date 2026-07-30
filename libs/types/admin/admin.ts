export interface AdminDashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalBookings: number;
  pendingBookings: number;
  /**
   * Both halves of the marketplace: every order that was not cancelled, plus
   * every booking the customer has actually paid for.
   */
  totalRevenue: number;
}
