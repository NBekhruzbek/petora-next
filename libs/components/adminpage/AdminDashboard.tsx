import {
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import StatCard from "./StatCard";
import {
  GET_ADMIN_DASHBOARD_STATS,
  GET_ALL_ORDERS_BY_ADMIN,
  GET_ALL_USERS_BY_ADMIN,
} from "@/apollo/admin/query";
import { AdminDashboardStats } from "@/libs/types/admin/admin";
import { Order } from "@/libs/types/order/order";
import { Member } from "@/libs/types/member/member";
import { Direction } from "@/libs/enums/common.enum";
import { formatDate, statusChipClass, won } from "./adminHelpers";

const RECENT_LIMIT = 5;

const AdminDashboard = () => {
  const router = useRouter();

  /** APOLLO REQUESTS **/

  const { data: statsData } = useQuery(GET_ADMIN_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const { data: recentOrdersData } = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: { page: 1, limit: RECENT_LIMIT } },
    notifyOnNetworkStatusChange: true,
  });

  // getAllUsersByAdmin throws "No data found!" on an empty collection; the
  // errorLink already swallows that message, and the ?? below covers the data.
  const { data: recentUsersData } = useQuery(GET_ALL_USERS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: RECENT_LIMIT,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {},
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  /** DERIVED **/

  const stats: AdminDashboardStats | undefined =
    statsData?.getAdminDashboardStats;
  const recentOrders: Order[] =
    recentOrdersData?.getAllOrdersByAdmin?.list ?? [];
  const recentUsers: Member[] = recentUsersData?.getAllUsersByAdmin?.list ?? [];

  const revenue = stats?.totalRevenue ?? 0;
  const revenueLabel =
    revenue >= 1_000_000
      ? `₩${(revenue / 1_000_000).toFixed(1)}M`
      : won(revenue);

  return (
    <Stack className="admin-dashboard">
      <Stack className="stat-cards-row">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<PeopleAltIcon />}
          color="#6366F1"
          trendNeutral="registered members"
        />
        <StatCard
          title="Total Agents"
          value={stats?.totalAgents ?? 0}
          icon={<SupportAgentIcon />}
          color="#0EA5E9"
          trendNeutral="service providers"
        />
        <StatCard
          title="Products"
          value={stats?.totalProducts ?? 0}
          icon={<InventoryIcon />}
          color="#10B981"
          trendNeutral="listings in catalogue"
        />
        <StatCard
          title="Orders"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingCartIcon />}
          color="#F59E0B"
          trendNeutral={`${stats?.pendingOrders ?? 0} awaiting shipment`}
        />
        <StatCard
          title="Bookings"
          value={stats?.totalBookings ?? 0}
          icon={<EventAvailableIcon />}
          color="#8B5CF6"
          trendNeutral={`${stats?.pendingBookings ?? 0} awaiting reply`}
        />
        <StatCard
          title="Revenue"
          value={revenueLabel}
          icon={<AttachMoneyIcon />}
          color="#6366F1"
          trendNeutral="orders + paid bookings"
        />
      </Stack>

      <Stack className="dashboard-tables-row">
        {/* Recent Orders */}
        <Stack className="admin-card">
          <Stack
            className="admin-card-header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className="admin-card-title">Recent Orders</Typography>
            <Button
              size="small"
              onClick={() => router.push("/admin/orders")}
              className="admin-db-view-all-btn"
            >
              View all →
            </Button>
          </Stack>
          <TableContainer>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="admin-db-order-no-cell">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.receiverName ||
                        order.memberData?.memberFullName ||
                        order.memberData?.memberUserName ||
                        "—"}
                    </TableCell>
                    <TableCell className="admin-db-order-total-cell">
                      {won(order.orderTotal)}
                    </TableCell>
                    <TableCell>
                      <span className={statusChipClass(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography className="admin-table-empty">
                        No orders yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        {/* Recent Users */}
        <Stack className="admin-card">
          <Stack
            className="admin-card-header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className="admin-card-title">
              Recent Registrations
            </Typography>
            <Button
              size="small"
              onClick={() => router.push("/admin/users")}
              className="admin-db-view-all-btn"
            >
              View all →
            </Button>
          </Stack>
          <TableContainer>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-db-user-name">
                          {member.memberFullName || member.memberUserName}
                        </Typography>
                        <Typography className="admin-db-user-handle">
                          @{member.memberUserName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <span
                        className="status-chip"
                        style={{ background: "#F0F0FF", color: "#6366F1" }}
                      >
                        User
                      </span>
                    </TableCell>
                    <TableCell className="admin-db-user-joined">
                      {formatDate(member.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className={statusChipClass(member.memberStatus)}>
                        {member.memberStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {recentUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography className="admin-table-empty">
                        No registrations yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>

      {/* Quick Actions */}
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        className="admin-db-quick-actions"
      >
        <Typography className="admin-db-qa-label">Quick Actions</Typography>
        {[
          { label: "Add Product", href: "/admin/products", primary: true },
          { label: "Manage Orders", href: "/admin/orders", primary: false },
          { label: "Review Agents", href: "/admin/agents", primary: false },
          { label: "Community", href: "/admin/community", primary: false },
        ].map(({ label, href, primary }) => (
          <Button
            key={href}
            onClick={() => router.push(href)}
            className={
              primary ? "admin-db-btn-primary" : "admin-db-btn-secondary"
            }
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminDashboard;
