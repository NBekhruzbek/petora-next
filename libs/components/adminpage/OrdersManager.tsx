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
        <Typography sx={{ fontSize: "13px", color: "#9CA3AF" }}>
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
          <Typography sx={{ fontSize: "12px", color: "#9CA3AF" }}>
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
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#6366F1",
                        fontSize: "12px",
                      }}
                    >
                      {order.orderNo}
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                          {order.customerName}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                          {order.customerEmail}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", color: "#6B7280" }}>
                      {order.products.length} item
                      {order.products.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "13px" }}>
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
                    <TableCell sx={{ fontSize: "12px", color: "#9CA3AF" }}>
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
        PaperProps={{
          sx: {
            width: 480,
            boxShadow: "-8px 0 32px rgba(0,0,0,0.10)",
            background: "#F4F5FA",
            overflowY: "auto",
          },
        }}
      >
        {selectedOrder && (
          <>
            {/* Sticky Header */}
            <Stack
              sx={{
                px: 3,
                py: 2.5,
                background: "#fff",
                borderBottom: "1px solid #E8ECF0",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: "#EEF2FF",
                      flexShrink: 0,
                    }}
                  >
                    <ReceiptLongIcon sx={{ fontSize: 20, color: "#6366F1" }} />
                  </Stack>
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#111827",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {selectedOrder.orderNo}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.2 }}
                    >
                      Placed on {selectedOrder.date}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  size="small"
                  sx={{
                    color: "#6B7280",
                    "&:hover": { background: "#F3F4F6" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            {/* Scrollable Body */}
            <Stack sx={{ p: 2.5, gap: 2, pb: 12 }}>
              {/* Status Card */}
              <Stack
                sx={{
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #F3F4F6",
                  p: 2.5,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <LocalShippingIcon sx={{ fontSize: 16, color: "#6366F1" }} />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
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
                  sx={{
                    height: 38,
                    borderRadius: "9px",
                    fontSize: "13px",
                    background: "#F9FAFB",
                    color: "#111827",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E8ECF0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#C7D2FE",
                    },
                    ".MuiSelect-icon": { color: "#9CA3AF" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "1.4px",
                      borderColor: "#6366F1",
                    },
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      <span className={`status-chip status-${s}`}>{s}</span>
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              {/* Customer Card */}
              <Stack
                sx={{
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #F3F4F6",
                  p: 2.5,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                  <PersonIcon sx={{ fontSize: 16, color: "#6366F1" }} />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Customer
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#EEF2FF",
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#6366F1",
                      }}
                    >
                      {selectedOrder.customerName.charAt(0)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {selectedOrder.customerName}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#9CA3AF" }}>
                      {selectedOrder.customerEmail}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Items Card */}
              <Stack
                sx={{
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #F3F4F6",
                  overflow: "hidden",
                }}
              >
                <Stack
                  sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F3F4F6" }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
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
                        sx={{ px: 2.5, py: 2 }}
                      >
                        {/* Product thumbnail */}
                        <Stack
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "10px",
                            background: "#F3F4F6",
                            flexShrink: 0,
                            overflow: "hidden",
                            border: "1px solid #E8ECF0",
                          }}
                        >
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
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.name}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            mt={0.3}
                          >
                            <Typography
                              sx={{ fontSize: "11px", color: "#9CA3AF" }}
                            >
                              ×{p.quantity}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "11px", color: "#D1D5DB" }}
                            >
                              ·
                            </Typography>
                            <Typography
                              sx={{ fontSize: "11px", color: "#9CA3AF" }}
                            >
                              ₩{p.unitPrice.toLocaleString()} each
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#374151",
                            flexShrink: 0,
                          }}
                        >
                          ₩{(p.quantity * p.unitPrice).toLocaleString()}
                        </Typography>
                      </Stack>
                      {i < selectedOrder.products.length - 1 && (
                        <Divider
                          key={`d-${i}`}
                          sx={{ mx: 2.5, borderColor: "#F3F4F6" }}
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
                  sx={{
                    px: 2.5,
                    py: 2,
                    borderTop: "1px solid #F3F4F6",
                    background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)",
                  }}
                >
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Order Total
                    </Typography>
                    <Typography
                      sx={{ fontSize: "11px", color: "#9CA3AF", mt: 0.3 }}
                    >
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
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#6366F1",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ₩{selectedOrder.total.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Sticky Footer */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                px: 3,
                py: 2,
                background: "#fff",
                borderTop: "1px solid #E8ECF0",
                position: "sticky",
                bottom: 0,
                zIndex: 10,
              }}
            >
              <Button
                onClick={() => setDrawerOpen(false)}
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#6B7280",
                  border: "1px solid #E8ECF0",
                  borderRadius: "10px",
                  height: "40px",
                  px: 3,
                  "&:hover": { background: "#F9FAFB" },
                }}
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
