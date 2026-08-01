import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
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
          title={t("admin.dashboard.totalUsers")}
          value={stats?.totalUsers ?? 0}
          icon={<PeopleAltIcon />}
          color="#6366F1"
          trendNeutral={t("admin.registeredMembers")}
        />
        <StatCard
          title={t("admin.dashboard.totalAgents")}
          value={stats?.totalAgents ?? 0}
          icon={<SupportAgentIcon />}
          color="#0EA5E9"
          trendNeutral={t("admin.serviceProviders")}
        />
        <StatCard
          title={t("admin.dashboard.products")}
          value={stats?.totalProducts ?? 0}
          icon={<InventoryIcon />}
          color="#10B981"
          trendNeutral={t("admin.listingsInCatalogue")}
        />
        <StatCard
          title={t("admin.dashboard.orders")}
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingCartIcon />}
          color="#F59E0B"
          trendNeutral={t("admin.awaitingShipment", {
            count: stats?.pendingOrders ?? 0,
          })}
        />
        <StatCard
          title={t("admin.dashboard.bookings")}
          value={stats?.totalBookings ?? 0}
          icon={<EventAvailableIcon />}
          color="#8B5CF6"
          trendNeutral={t("admin.awaitingReply", {
            count: stats?.pendingBookings ?? 0,
          })}
        />
        <StatCard
          title={t("admin.dashboard.revenue")}
          value={revenueLabel}
          icon={<AttachMoneyIcon />}
          color="#6366F1"
          trendNeutral={t("admin.ordersPaidBookings")}
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
            <Typography className="admin-card-title">
              {t("admin.dashboard.recentOrders")}
            </Typography>
            <Button
              size="small"
              onClick={() => router.push("/admin/orders")}
              className="admin-db-view-all-btn"
            >
              {t("admin.viewAll")}
            </Button>
          </Stack>
          <TableContainer>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("admin.col.order")}</TableCell>
                  <TableCell>{t("admin.col.customer")}</TableCell>
                  <TableCell>{t("admin.col.total")}</TableCell>
                  <TableCell>{t("admin.col.status")}</TableCell>
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
                        {t(`enums.status.${order.orderStatus}`)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography className="admin-table-empty">
                        {t("admin.noOrdersYet")}
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
              {t("admin.recentRegistrations")}
            </Typography>
            <Button
              size="small"
              onClick={() => router.push("/admin/users")}
              className="admin-db-view-all-btn"
            >
              {t("admin.viewAll")}
            </Button>
          </Stack>
          <TableContainer>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("admin.col.user")}</TableCell>
                  <TableCell>{t("admin.col.type")}</TableCell>
                  <TableCell>{t("admin.col.joined")}</TableCell>
                  <TableCell>{t("admin.col.status")}</TableCell>
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
                        {t("admin.col.user")}
                      </span>
                    </TableCell>
                    <TableCell className="admin-db-user-joined">
                      {formatDate(member.createdAt, intlLocale)}
                    </TableCell>
                    <TableCell>
                      <span className={statusChipClass(member.memberStatus)}>
                        {t(`enums.status.${member.memberStatus}`)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {recentUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography className="admin-table-empty">
                        {t("admin.noRegistrationsYet")}
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
        <Typography className="admin-db-qa-label">
          {t("admin.dashboard.quickActions")}
        </Typography>
        {[
          {
            labelKey: "admin.dashboard.addProduct",
            href: "/admin/products",
            primary: true,
          },
          {
            labelKey: "admin.dashboard.manageOrders",
            href: "/admin/orders",
            primary: false,
          },
          {
            labelKey: "admin.dashboard.reviewAgents",
            href: "/admin/agents",
            primary: false,
          },
          {
            labelKey: "admin.dashboard.community",
            href: "/admin/community",
            primary: false,
          },
        ].map(({ labelKey, href, primary }) => (
          <Button
            key={href}
            onClick={() => router.push(href)}
            className={
              primary ? "admin-db-btn-primary" : "admin-db-btn-secondary"
            }
          >
            {t(labelKey)}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminDashboard;
