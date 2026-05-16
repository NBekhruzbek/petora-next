import { useState } from "react";
import {
  Stack,
  Typography,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { mockOrders, AdminOrder, OrderStatus } from "../../data/adminMockData";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrdersManager = () => {
  const [orderStatuses, setOrderStatuses] = useState<
    Record<string, OrderStatus>
  >({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const getStatus = (order: AdminOrder): OrderStatus =>
    orderStatuses[order.id] ?? order.status;

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrderStatuses((prev) => ({ ...prev, [id]: status }));

  const openDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Orders</Typography>
        <Typography className="admin-ord-pending-count">
          {
            mockOrders.filter(
              (o) => (orderStatuses[o.id] ?? o.status) === "pending",
            ).length
          }{" "}
          pending
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Stack
          className="admin-card-header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography className="admin-card-title">All Orders</Typography>
          <Typography className="admin-ord-total-count">
            {mockOrders.length} total
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.map((order) => {
                const status = getStatus(order);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="admin-ord-no-cell">
                      {order.orderNo}
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="admin-ord-customer-name">
                          {order.customerName}
                        </Typography>
                        <Typography className="admin-ord-customer-email">
                          {order.customerEmail}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell className="admin-ord-items-cell">
                      {order.products.length} item
                      {order.products.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="admin-ord-total-cell">
                      ₩{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as OrderStatus)
                        }
                        size="small"
                        renderValue={(val) => (
                          <span className={`status-chip status-${val}`}>
                            {val}
                          </span>
                        )}
                        className="admin-status-select"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>
                            <span className={`status-chip status-${s}`}>
                              {s}
                            </span>
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell className="admin-ord-date-cell">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => openDetail(order)}
                        className="admin-btn-edit"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
                      {selectedOrder.orderNo}
                    </Typography>
                    <Typography className="admin-ord-header-date">
                      Placed on {selectedOrder.date}
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
                  value={getStatus(selectedOrder)}
                  onChange={(e) =>
                    updateStatus(
                      selectedOrder.id,
                      e.target.value as OrderStatus,
                    )
                  }
                  size="small"
                  renderValue={(val) => (
                    <span className={`status-chip status-${val}`}>{val}</span>
                  )}
                  className="admin-ord-status-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      <span className={`status-chip status-${s}`}>{s}</span>
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
                      {selectedOrder.customerName.charAt(0)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography className="admin-ord-customer-name-text">
                      {selectedOrder.customerName}
                    </Typography>
                    <Typography className="admin-ord-customer-email-text">
                      {selectedOrder.customerEmail}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Items Card */}
              <Stack className="admin-ord-items-card">
                <Stack className="admin-ord-items-header">
                  <Typography className="admin-ord-items-heading">
                    Items ({selectedOrder.products.length})
                  </Typography>
                </Stack>
                <Stack>
                  {selectedOrder.products.map((p, i) => (
                    <>
                      <Stack
                        key={i}
                        direction="row"
                        alignItems="center"
                        gap={2}
                        className="admin-ord-item-row"
                      >
                        {/* Product thumbnail */}
                        <Stack className="admin-ord-item-thumb">
                          <img
                            src={p.image}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src =
                                "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                              img.style.opacity = "0";
                            }}
                          />
                        </Stack>
                        <Stack flex={1} minWidth={0}>
                          <Typography className="admin-ord-item-name">
                            {p.name}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            mt={0.3}
                          >
                            <Typography className="admin-ord-item-qty">
                              ×{p.quantity}
                            </Typography>
                            <Typography className="admin-ord-item-dot">
                              ·
                            </Typography>
                            <Typography className="admin-ord-item-unit-price">
                              ₩{p.unitPrice.toLocaleString()} each
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography className="admin-ord-item-total">
                          ₩{(p.quantity * p.unitPrice).toLocaleString()}
                        </Typography>
                      </Stack>
                      {i < selectedOrder.products.length - 1 && (
                        <Divider
                          key={`d-${i}`}
                          className="admin-ord-items-divider"
                        />
                      )}
                    </>
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
                      {selectedOrder.products.reduce(
                        (sum, p) => sum + p.quantity,
                        0,
                      )}{" "}
                      item
                      {selectedOrder.products.reduce(
                        (sum, p) => sum + p.quantity,
                        0,
                      ) !== 1
                        ? "s"
                        : ""}
                    </Typography>
                  </Stack>
                  <Typography className="admin-ord-total-amount">
                    ₩{selectedOrder.total.toLocaleString()}
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
