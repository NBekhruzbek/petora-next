import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  Divider,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ADMIN_DASHBOARD_STATS,
  GET_ALL_ORDERS_BY_ADMIN,
} from "@/apollo/admin/query";
import { UPDATE_ORDER_BY_ADMIN } from "@/apollo/admin/mutation";
import { Order } from "@/libs/types/order/order";
import { OrdersInquiry } from "@/libs/types/order/order.input";
import { OrderStatus } from "@/libs/enums/order.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  BLANK_IMAGE,
  formatDate,
  imageUrl,
  metaTotal,
  statusChipClass,
  useDebouncedValue,
  won,
} from "./adminHelpers";

const ORDERS_PER_PAGE = 10;

// Listed in tracker order, so advancing an order is a walk down the menu.
const STATUS_OPTIONS: OrderStatus[] = [
  OrderStatus.PROCESSED,
  OrderStatus.SHIPPED,
  OrderStatus.EN_ROUTE,
  OrderStatus.ARRIVED,
  OrderStatus.CANCELLED,
];

const customerName = (order: Order) =>
  order.receiverName ||
  order.memberData?.memberFullName ||
  order.memberData?.memberUserName ||
  "—";

const OrdersManager = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  /** APOLLO REQUESTS **/

  const searchFilter: OrdersInquiry = {
    page,
    limit: ORDERS_PER_PAGE,
    ...(filterStatus === "ALL" ? {} : { orderStatus: filterStatus }),
    // Matched against orderNumber server-side, so it searches every order and
    // not just the page on screen.
    ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
  };

  const {
    data: ordersData,
    previousData: ordersPreviousData,
    refetch: ordersRefetch,
  } = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  // The awaiting-shipment badge counts the whole collection, not just this page.
  const { data: statsData, refetch: statsRefetch } = useQuery(
    GET_ADMIN_DASHBOARD_STATS,
    { fetchPolicy: "cache-and-network" },
  );

  const [updateOrderByAdmin] = useMutation(UPDATE_ORDER_BY_ADMIN);

  /** DERIVED **/

  const ordersResult = ordersData ?? ordersPreviousData;
  const orders: Order[] = ordersResult?.getAllOrdersByAdmin?.list ?? [];
  const total = metaTotal(ordersResult?.getAllOrdersByAdmin?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PER_PAGE));
  const pendingCount = statsData?.getAdminDashboardStats?.pendingOrders ?? 0;

  // Read the selection back out of the list so the drawer follows a refetch
  // instead of showing the status the row had when it was opened.
  const selectedOrder =
    orders.find((order) => order._id === selectedId) ?? null;

  /** HANDLERS **/

  const updateStatus = async (order: Order, orderStatus: OrderStatus) => {
    if (order.orderStatus === orderStatus) return;
    try {
      await updateOrderByAdmin({
        variables: { input: { orderId: order._id, orderStatus } },
      });
      await Promise.all([
        ordersRefetch({ input: searchFilter }),
        statsRefetch(),
      ]);
      await sweetBottomSmallSuccessAlert("Order updated!", 700);
    } catch (err: any) {
      console.log("ERROR, updateStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const openDetail = (order: Order) => {
    setSelectedId(order._id);
    setDrawerOpen(true);
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.orders.title")}
        </Typography>
        <Typography className="admin-ord-pending-count">
          {t("admin.awaitingShipment", { count: pendingCount })}
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder={t("admin.orders.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="admin-toolbar-search admin-ord-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as "ALL" | OrderStatus);
              setPage(1);
            }}
            className="admin-toolbar-select admin-ord-status-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allStatuses")}</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`admin.status.${s}`)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {t("admin.showingOf", { shown: orders.length, total })}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("admin.col.order")}</TableCell>
                <TableCell>{t("admin.col.customer")}</TableCell>
                <TableCell>{t("admin.col.items")}</TableCell>
                <TableCell>{t("admin.col.total")}</TableCell>
                <TableCell>{t("admin.col.status")}</TableCell>
                <TableCell>{t("admin.col.date")}</TableCell>
                <TableCell>{t("admin.col.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const itemCount = order.orderItems?.length ?? 0;
                return (
                  <TableRow key={order._id}>
                    <TableCell className="admin-ord-no-cell">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-ord-customer-name">
                          {customerName(order)}
                        </Typography>
                        <Typography className="admin-ord-customer-email">
                          {order.memberData?.memberEmail ||
                            order.receiverPhone ||
                            "—"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell className="admin-ord-items-cell">
                      {t("admin.count.item", { count: itemCount })}
                    </TableCell>
                    <TableCell className="admin-ord-total-cell">
                      {won(order.orderTotal)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order, e.target.value as OrderStatus)
                        }
                        size="small"
                        renderValue={(val) => (
                          <span className={statusChipClass(val as string)}>
                            {t(`admin.status.${val}`)}
                          </span>
                        )}
                        className="admin-status-select"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>
                            <span className={statusChipClass(s)}>
                              {t(`admin.status.${s}`)}
                            </span>
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell className="admin-ord-date-cell">
                      {formatDate(order.createdAt, intlLocale)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => openDetail(order)}
                        className="admin-btn-edit"
                      >
                        {t("admin.act.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography className="admin-table-empty">
                      {t("admin.empty.orders")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack className="admin-pagination">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </Stack>

      {/* Order Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ className: "admin-ord-drawer-paper" }}
        disablePortal
      >
        {selectedOrder && (
          <>
            {/* Sticky Header */}
            <Stack className="admin-ord-drawer-header">
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    className="admin-ord-header-icon-box"
                  >
                    <ReceiptLongIcon className="admin-icon-20-indigo" />
                  </Stack>
                  <Stack>
                    <Typography className="admin-ord-header-title">
                      {selectedOrder.orderNumber}
                    </Typography>
                    <Typography className="admin-ord-header-date">
                      Placed on{" "}
                      {formatDate(selectedOrder.createdAt, intlLocale)}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  size="small"
                  className="admin-ord-close-btn"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            {/* Scrollable Body */}
            <Stack className="admin-ord-drawer-body">
              {/* Status Card */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <LocalShippingIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Order Status
                  </Typography>
                </Stack>
                <Select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    updateStatus(selectedOrder, e.target.value as OrderStatus)
                  }
                  size="small"
                  renderValue={(val) => (
                    <span className={statusChipClass(val as string)}>
                      {t(`admin.status.${val}`)}
                    </span>
                  )}
                  className="admin-ord-status-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      <span className={statusChipClass(s)}>
                        {t(`admin.status.${s}`)}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              {/* Customer Card */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <PersonIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Customer
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    className="admin-ord-customer-avatar"
                  >
                    <Typography className="admin-ord-customer-avatar-letter">
                      {customerName(selectedOrder).charAt(0)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography className="admin-ord-customer-name-text">
                      {customerName(selectedOrder)}
                    </Typography>
                    <Typography className="admin-ord-customer-email-text">
                      {selectedOrder.memberData?.memberEmail || "—"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Delivery Card */}
              <Stack className="admin-ord-section-card">
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <LocalShippingIcon className="admin-icon-16-indigo" />
                  <Typography className="admin-ord-section-heading">
                    Delivery & Payment
                  </Typography>
                </Stack>
                <Stack gap={1}>
                  {[
                    {
                      labelKey: "admin.orders.receiver",
                      value: selectedOrder.receiverName,
                    },
                    {
                      labelKey: "admin.orders.phone",
                      value: selectedOrder.receiverPhone,
                    },
                    {
                      labelKey: "admin.orders.address",
                      value: selectedOrder.deliveryAddress,
                    },
                    {
                      labelKey: "admin.orders.payment",
                      value: t(`admin.payment.${selectedOrder.paymentMethod}`),
                    },
                    {
                      labelKey: "admin.orders.deliveryFee",
                      value: selectedOrder.orderDelivery
                        ? won(selectedOrder.orderDelivery)
                        : "Free",
                    },
                  ].map(({ labelKey, value }) => (
                    <Stack
                      key={t(labelKey)}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Typography className="admin-cell-meta">
                        {t(labelKey)}
                      </Typography>
                      <Typography
                        className="admin-cell-name"
                        style={{ textAlign: "right" }}
                      >
                        {value || "—"}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* Items Card */}
              <Stack className="admin-ord-items-card">
                <Stack className="admin-ord-items-header">
                  <Typography className="admin-ord-items-heading">
                    Items ({selectedOrder.orderItems?.length ?? 0})
                  </Typography>
                </Stack>
                <Stack>
                  {(selectedOrder.orderItems ?? []).map((item, i, arr) => (
                    <Fragment key={item._id}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        className="admin-ord-item-row"
                      >
                        {/* Product thumbnail */}
                        <Stack className="admin-ord-item-thumb">
                          <img
                            src={imageUrl(item.productData?.productImages?.[0])}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = BLANK_IMAGE;
                              img.style.opacity = "0";
                            }}
                          />
                        </Stack>
                        <Stack flex={1} minWidth={0}>
                          <Typography className="admin-ord-item-name">
                            {item.productData?.productName ??
                              "Product unavailable"}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            mt={0.3}
                          >
                            <Typography className="admin-ord-item-qty">
                              ×{item.itemQuantity}
                            </Typography>
                            <Typography className="admin-ord-item-dot">
                              ·
                            </Typography>
                            <Typography className="admin-ord-item-unit-price">
                              {won(item.itemPrice)} each
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography className="admin-ord-item-total">
                          {won(item.itemQuantity * item.itemPrice)}
                        </Typography>
                      </Stack>
                      {i < arr.length - 1 && (
                        <Divider className="admin-ord-items-divider" />
                      )}
                    </Fragment>
                  ))}
                </Stack>

                {/* Total row */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className="admin-ord-total-row"
                >
                  <Stack>
                    <Typography className="admin-ord-total-label">
                      Order Total
                    </Typography>
                    <Typography className="admin-ord-total-sub">
                      {(() => {
                        const units = (selectedOrder.orderItems ?? []).reduce(
                          (sum, item) => sum + item.itemQuantity,
                          0,
                        );
                        return t("admin.count.item", { count: units });
                      })()}
                    </Typography>
                  </Stack>
                  <Typography className="admin-ord-total-amount">
                    {won(selectedOrder.orderTotal)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Sticky Footer */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              className="admin-ord-drawer-footer"
            >
              <Button
                onClick={() => setDrawerOpen(false)}
                className="admin-ord-close-footer-btn"
              >
                Close
              </Button>
            </Stack>
          </>
        )}
      </Drawer>
    </Stack>
  );
};

export default OrdersManager;
