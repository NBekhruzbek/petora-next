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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useRouter } from "next/router";
import StatCard from "./StatCard";
import {
  dashboardStats,
  mockOrders,
  mockUsers,
} from "../../data/adminMockData";

const AdminDashboard = () => {
  const router = useRouter();
  const recentOrders = mockOrders.slice(0, 5);
  const recentUsers = [...mockUsers].reverse().slice(0, 5);

  return (
    <Stack className="admin-dashboard">
      <Stack className="stat-cards-row">
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers}
          icon={<PeopleAltIcon />}
          color="#6366F1"
          trend="+184 this month"
        />
        <StatCard
          title="Total Agents"
          value={dashboardStats.totalAgents}
          icon={<SupportAgentIcon />}
          color="#0EA5E9"
          trend="+18 this month"
        />
        <StatCard
          title="Products"
          value={dashboardStats.totalProducts}
          icon={<InventoryIcon />}
          color="#10B981"
          trendNeutral="342 active listings"
        />
        <StatCard
          title="Orders"
          value={dashboardStats.totalOrders}
          icon={<ShoppingCartIcon />}
          color="#F59E0B"
          trend="+681 this month"
        />
        <StatCard
          title="Revenue"
          value={`₩${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={<AttachMoneyIcon />}
          color="#6366F1"
          trend="+12% vs last month"
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
              sx={{
                fontSize: "12px",
                textTransform: "none",
                color: "#6366F1",
                fontWeight: 700,
                padding: 0,
                minWidth: "auto",
              }}
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
                  <TableRow key={order.id}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#6366F1",
                        fontSize: "12px",
                      }}
                    >
                      {order.orderNo}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ₩{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`status-chip status-${order.status}`}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
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
              sx={{
                fontSize: "12px",
                textTransform: "none",
                color: "#6366F1",
                fontWeight: 700,
                padding: 0,
                minWidth: "auto",
              }}
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
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        >
                          {user.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                          @{user.username}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <span
                        className="status-chip"
                        style={{
                          background:
                            user.memberType === "SERVICE_AGENT"
                              ? "#EFF6FF"
                              : "#F0F0FF",
                          color:
                            user.memberType === "SERVICE_AGENT"
                              ? "#3B82F6"
                              : "#6366F1",
                        }}
                      >
                        {user.memberType === "SERVICE_AGENT" ? "Agent" : "User"}
                      </span>
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontSize: "12px" }}>
                      {user.joinDate}
                    </TableCell>
                    <TableCell>
                      <span className={`status-chip status-${user.status}`}>
                        {user.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
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
        sx={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #E8ECF0",
          padding: "16px 20px",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            mr: 1,
            whiteSpace: "nowrap",
          }}
        >
          Quick Actions
        </Typography>
        {[
          { label: "Add Product", href: "/admin/products", primary: true },
          { label: "Manage Orders", href: "/admin/orders", primary: false },
          { label: "Review Agents", href: "/admin/agents", primary: false },
          { label: "Community", href: "/admin/community", primary: false },
        ].map(({ label, href, primary }) => (
          <Button
            key={href}
            onClick={() => router.push(href)}
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "9px",
              height: "36px",
              px: 2,
              boxShadow: "none",
              ...(primary
                ? {
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#5254CC",
                      boxShadow: "none",
                    },
                  }
                : {
                    backgroundColor: "#F4F5FA",
                    color: "#374151",
                    border: "1px solid #E8ECF0",
                    "&:hover": {
                      backgroundColor: "#F0F0FF",
                      borderColor: "#C7D2FE",
                      color: "#6366F1",
                      boxShadow: "none",
                    },
                  }),
            }}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminDashboard;
