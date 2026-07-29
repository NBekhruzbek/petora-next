import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckIcon from "@mui/icons-material/Check";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_MY_BOOKINGS, GET_MY_ORDERS } from "@/apollo/user/query";
import { UPDATE_BOOKING_BY_USER } from "@/apollo/user/mutation";
import { BookedInfo } from "@/libs/types/booking/booking";
import { Order } from "@/libs/types/order/order";
import { BookingStatus } from "@/libs/enums/booking.enum";
import { OrderStatus } from "@/libs/enums/order.enum";
import { Direction } from "@/libs/enums/common.enum";
import { REACT_APP_API_URL } from "@/libs/config";
import { formatBookingMoment } from "./service-tabs/AgentBookingsList";
import EmptyState from "../common/EmptyState";
import {
  sweetBottomSmallSuccessAlert,
  sweetConfirmAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

// Mirrors updateBookingByUser on the API: a booking can be called off right up
// to the appointment, whether or not the agent has accepted it yet.
const CANCELLABLE_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
];

// The published policy is free cancellation until 24 hours before the session,
// and a fee inside that window — so the confirm has to say which one this is.
const FEE_WINDOW_MS = 24 * 60 * 60 * 1000;

const startsWithinFeeWindow = (booking: BookedInfo) => {
  if (!booking.bookingDate) return false;
  const start = new Date(
    `${booking.bookingDate}T${booking.bookingTime || "00:00"}`,
  ).getTime();
  if (Number.isNaN(start)) return false;
  const untilStart = start - Date.now();
  return untilStart > 0 && untilStart < FEE_WINDOW_MS;
};

const BOOKINGS_LIMIT = 20;
const ORDERS_LIMIT = 10;

// One source of truth for the tab order, the labels and the ?tab= deep link.
// Deriving the index from the key means reordering the tabs can never silently
// invert which panel a link opens.
const TABS = [
  { key: "ORDERS", label: "Orders" },
  { key: "BOOKINGS", label: "Bookings" },
] as const;

const TruckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="36"
    height="24"
    viewBox="0 0 56 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cargo box — purple, LEFT (back of truck) */}
    <rect x="1" y="3" width="33" height="17" rx="2" fill="#6f2cff" />
    <rect
      x="1"
      y="3"
      width="33"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.12)"
    />
    <rect
      x="2"
      y="4"
      width="1"
      height="15"
      rx="0.5"
      fill="rgba(255,255,255,0.22)"
    />

    {/* Cab — #F0F4F9, RIGHT (front of truck, facing right) */}
    <path
      d="M34 3 L34 20 L55 20 L55 14 L46 3 Z"
      fill="#F0F4F9"
      stroke="#d1d5db"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    {/* Driver window */}
    <rect
      x="36"
      y="4.5"
      width="9"
      height="7"
      rx="1.2"
      fill="#bae6fd"
      opacity="0.85"
    />

    {/* Headlight */}
    <rect x="52.5" y="15.5" width="2" height="2.5" rx="0.8" fill="#fde68a" />

    {/* Chassis rail */}
    <rect x="1" y="20" width="54" height="2" rx="1" fill="#e2e8f0" />

    {/* Rear wheel (under cargo) */}
    <circle cx="14" cy="24.5" r="4.5" fill="#1f2937" />
    <circle cx="14" cy="24.5" r="2" fill="#4b5563" />
    <circle cx="14" cy="24.5" r="0.8" fill="#9ca3af" />

    {/* Front wheel (under cab) */}
    <circle cx="44" cy="24.5" r="4.5" fill="#1f2937" />
    <circle cx="44" cy="24.5" r="2" fill="#4b5563" />
    <circle cx="44" cy="24.5" r="0.8" fill="#9ca3af" />
  </svg>
);

const STAGES = [
  {
    label: ["Order", "Processed"],
    Icon: AssignmentTurnedInOutlinedIcon,
    pct: 0,
  },
  { label: ["Order", "Shipped"], Icon: Inventory2OutlinedIcon, pct: 33 },
  { label: ["Order", "En Route"], Icon: LocalShippingOutlinedIcon, pct: 66 },
  { label: ["Order", "Arrived"], Icon: HomeOutlinedIcon, pct: 100 },
];

// There is no carrier ETA on the API, so the tracker advances one stage per
// order status instead of interpolating over a delivery window.
const STATUS_PROGRESS: Record<string, number> = {
  [OrderStatus.PENDING]: 0,
  [OrderStatus.PROCESSING]: 33,
  [OrderStatus.SHIPPED]: 66,
  [OrderStatus.DELIVERED]: 100,
  [OrderStatus.CANCELLED]: 0,
};

// The row styling keys off the lowercase legacy status names.
const bookingStatusClass: Record<string, string> = {
  [BookingStatus.PENDING]: "pending",
  [BookingStatus.CONFIRMED]: "accepted",
  [BookingStatus.COMPLETED]: "completed",
  [BookingStatus.CANCELLED]: "cancelled",
  [BookingStatus.REJECTED]: "rejected",
};

const prettifyEnum = (value?: string) =>
  (value ?? "")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const formatWon = (value: number) => `₩${(value ?? 0).toLocaleString()}`;

const formatDate = (value?: Date | string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const DeliveryTracker = ({ orderStatus }: { orderStatus: OrderStatus }) => {
  const pct = STATUS_PROGRESS[orderStatus] ?? 0;

  return (
    <Box className="delivery-tracker">
      <Box className="dt-line-wrap">
        <Box className="dt-bg" />
        <Box className="dt-fill" style={{ width: `${pct}%` }} />
        <Box className="dt-car" style={{ left: `${pct}%` }}>
          <TruckIcon className="dt-car-icon" />
        </Box>
        {STAGES.map((s) => (
          <Box
            key={s.pct}
            className={`dt-dot ${pct >= s.pct ? "done" : ""}`}
            style={{ left: `${s.pct}%` }}
          >
            {pct >= s.pct && <CheckIcon className="dt-check" />}
          </Box>
        ))}
      </Box>
      <Box className="dt-labels">
        {STAGES.map((s) => (
          <Stack
            key={s.pct}
            className={`dt-label ${pct >= s.pct ? "done" : ""}`}
            alignItems="center"
            spacing={0.5}
            style={{ left: `${s.pct}%` }}
          >
            <s.Icon className="dt-label-icon" />
            <Typography className="dt-label-text">
              {s.label[0]}
              <br />
              {s.label[1]}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
};

const BookingsOrders = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  // An unknown or missing ?tab= falls back to the first tab.
  const initialTab = Math.max(
    0,
    TABS.findIndex((tab) => tab.key === router.query.tab),
  );
  const [activeTab, setActiveTab] = useState(initialTab);

  /** APOLLO REQUESTS **/

  const bookingsFilter = {
    page: 1,
    limit: BOOKINGS_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
  };

  const { data: getMyBookingsData, refetch: getMyBookingsRefetch } = useQuery(
    GET_MY_BOOKINGS,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: bookingsFilter },
      skip: !user?._id,
      notifyOnNetworkStatusChange: true,
    },
  );

  const { data: getMyOrdersData } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: { input: { page: 1, limit: ORDERS_LIMIT } },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  const [updateBookingByUser] = useMutation(UPDATE_BOOKING_BY_USER);

  /** DERIVED **/

  const activeTabKey = TABS[activeTab]?.key ?? TABS[0].key;
  const bookings: BookedInfo[] = getMyBookingsData?.getMyBookings?.list ?? [];
  const orders: Order[] = getMyOrdersData?.getMyOrders?.list ?? [];

  /** HANDLERS **/

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const cancelBooking = async (booking: BookedInfo) => {
    try {
      const confirmed = await sweetConfirmAlert(
        startsWithinFeeWindow(booking)
          ? "This booking starts in less than 24 hours, so cancelling it may incur a fee. Cancel it anyway?"
          : "Cancel this booking?",
      );
      if (!confirmed) return;

      await updateBookingByUser({
        variables: {
          input: {
            bookingId: booking._id,
            bookingStatus: BookingStatus.CANCELLED,
          },
        },
      });
      await getMyBookingsRefetch({ input: bookingsFilter });
      await sweetBottomSmallSuccessAlert("Booking cancelled", 700);
    } catch (err: any) {
      console.log("ERROR, cancelBooking:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const goToWriteReview = (serviceId: string) => {
    void router.push(`/service/booking?id=${serviceId}&writeReview=true`);
  };

  const goToWriteAgentReview = (agentId: string) => {
    void router.push(`/agents/detail?id=${agentId}&writeReview=true`);
  };

  const goToWriteProductReview = (productId: string) => {
    void router.push(`/shop/detail?id=${productId}&writeReview=true`);
  };

  return (
    <Stack className="bookings-orders-container" spacing={3}>
      <Stack className="bookings-orders-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="bookings and orders tabs"
        >
          {TABS.map((tab) => (
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>
      </Stack>

      <Box className="bookings-orders-tab-content">
        {/* ── ORDERS TAB ── */}
        {activeTabKey === "ORDERS" && (
          <Stack spacing={2} className="bo-orders-list">
            {orders.length === 0 && (
              <EmptyState
                icon={<Inventory2OutlinedIcon />}
                title="No orders yet"
                description="Anything you buy in the shop lands here, with its delivery progress."
                action={{
                  label: "Browse the shop",
                  onClick: () => void router.push("/shop"),
                }}
              />
            )}

            {orders.map((order) => {
              const items = order.orderItems ?? [];
              const productsPrice = items.reduce(
                (sum, item) => sum + item.itemPrice * item.itemQuantity,
                0,
              );
              const deliveryPrice = order.orderDelivery ?? 0;
              const status = order.orderStatus.toLowerCase();

              return (
                <Stack
                  key={order._id}
                  className={`order-card ${status}`}
                  spacing={0}
                >
                  {/* Header */}
                  <Stack className="order-card-header" spacing={1.5}>
                    <Stack
                      className="order-card-header-row"
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack spacing={0.5}>
                        <Typography className="order-card-label">
                          Order Number
                        </Typography>
                        <Typography className="order-card-number">
                          {order.orderNumber}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Typography className="order-card-label">
                            Order Date
                          </Typography>
                          <Typography className="order-card-date">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </Stack>
                        {order.orderStatus === OrderStatus.DELIVERED ? (
                          <Stack
                            className="order-delivered-actions"
                            spacing={1}
                            width={"220px"}
                            flexDirection={"row"}
                            justifyContent={"space-between"}
                            alignItems="flex-end"
                          >
                            <Box className="order-status-badge delivered">
                              Delivered
                            </Box>
                            {items[0]?.productId && (
                              <Button
                                className="write-review-btn"
                                startIcon={<RateReviewOutlinedIcon />}
                                onClick={() =>
                                  goToWriteProductReview(items[0].productId)
                                }
                              >
                                Write Review
                              </Button>
                            )}
                          </Stack>
                        ) : (
                          <Box className={`order-status-badge ${status}`}>
                            {status}
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                    <DeliveryTracker orderStatus={order.orderStatus} />
                  </Stack>

                  {/* Products */}
                  <Stack className="order-card-products" spacing={1.25}>
                    {items.map((item) => {
                      const product = item.productData;

                      return (
                        <Stack
                          key={item._id}
                          className="order-product-card"
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box className="order-product-image">
                            <Box
                              component="img"
                              src={
                                product?.productImages?.[0]
                                  ? `${REACT_APP_API_URL}/${product.productImages[0]}`
                                  : "/img/products/fillet.png"
                              }
                              alt={product?.productName ?? "product"}
                            />
                          </Box>

                          <Stack spacing={0.4} flex={1} minWidth={0}>
                            <Typography className="order-product-title">
                              {product?.productName ?? "Product removed"}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              className="order-product-meta"
                            >
                              <Typography className="product-meta-item">
                                {prettifyEnum(product?.productPetType)}
                              </Typography>
                              <Typography className="product-meta-categories">
                                {prettifyEnum(product?.productType)}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Stack
                            spacing={0.25}
                            alignItems="flex-end"
                            className="order-product-info"
                          >
                            <Typography className="product-quantity">
                              {item.itemQuantity} × {formatWon(item.itemPrice)}
                            </Typography>
                            <Typography className="product-line-total">
                              {formatWon(item.itemPrice * item.itemQuantity)}
                            </Typography>
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>

                  {/* Footer / Price summary */}
                  <Stack className="order-card-footer" spacing={0.75}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      className="price-row"
                    >
                      <Typography className="price-label">Products</Typography>
                      <Typography className="price-value">
                        {formatWon(productsPrice)}
                      </Typography>
                    </Stack>

                    {deliveryPrice > 0 && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        className="price-row"
                      >
                        <Typography className="price-label">
                          Delivery
                        </Typography>
                        <Typography className="price-value">
                          {formatWon(deliveryPrice)}
                        </Typography>
                      </Stack>
                    )}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      className="price-row total-row"
                    >
                      <Typography className="price-label total-label">
                        Total Price
                      </Typography>
                      <Typography className="price-value total-value">
                        {formatWon(order.orderTotal)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTabKey === "BOOKINGS" && (
          <Stack spacing={1.5} className="bo-bookings-tab">
            {bookings.length === 0 && (
              <EmptyState
                icon={<CalendarMonthOutlinedIcon />}
                title="No bookings yet"
                description="Book a groomer, walker or sitter and you can follow it here."
                action={{
                  label: "Find a service",
                  onClick: () => void router.push("/service"),
                }}
              />
            )}

            {bookings.map((booking) => {
              const status = bookingStatusClass[booking.bookingStatus];
              const service = booking.serviceData;

              return (
                <Stack
                  key={booking._id}
                  direction="row"
                  alignItems="center"
                  className={`service-row ${status}`}
                >
                  {/* Service image */}
                  <Box className="service-row-media">
                    <Box
                      component="img"
                      src={
                        service?.serviceImages?.[0]
                          ? `${REACT_APP_API_URL}/${service.serviceImages[0]}`
                          : "/img/services/grooming.jpg"
                      }
                      alt={service?.serviceTitle ?? "service"}
                      className="service-thumb-img"
                    />
                  </Box>

                  {/* Main info */}
                  <Stack className="service-row-main" spacing={0.75}>
                    <Typography className="agent-name">
                      {service?.serviceTitle ?? "Service removed"}
                    </Typography>
                    <Typography className="service-description">
                      {booking.bookingNote || "No additional request"}
                    </Typography>
                    <Typography className="agent-service-type">
                      {prettifyEnum(service?.serviceType)} ·{" "}
                      {booking.bookingPetName}
                    </Typography>
                  </Stack>

                  {/* Metrics: Price | Rating | Reservations */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    className="service-row-metrics"
                  >
                    <Stack className="metric-block">
                      <Typography className="metric-label">Price</Typography>
                      <Typography className="service-price">
                        {formatWon(booking.bookingPrice)}
                      </Typography>
                    </Stack>
                    <Stack className="metric-block">
                      <Typography className="metric-label">Rating</Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        className="rating-row"
                      >
                        <Rating
                          value={service?.serviceRating ?? 0}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography className="rating-value">
                          {(service?.serviceRating ?? 0).toFixed(1)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack className="metric-block">
                      <Typography className="metric-label">
                        Reservations
                      </Typography>
                      <Typography className="bookings-row">
                        {service?.serviceBookings ?? 0}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* End: Booked time + Status */}
                  <Stack className="booking-end-block" spacing={1}>
                    <Stack spacing={0.25}>
                      <Typography className="metric-label">Booked</Typography>
                      <Typography className="booking-date">
                        {formatBookingMoment(
                          booking.bookingDate,
                          booking.bookingTime,
                        )}
                      </Typography>
                    </Stack>
                    <Box className={`booking-status-badge ${status}`}>
                      {status}
                    </Box>
                    {CANCELLABLE_STATUSES.includes(booking.bookingStatus) && (
                      <Button
                        className="cancel-booking-btn"
                        onClick={() => void cancelBooking(booking)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {booking.bookingStatus === BookingStatus.COMPLETED && (
                      <Stack spacing={1}>
                        <Button
                          className="write-review-btn"
                          startIcon={<RateReviewOutlinedIcon />}
                          onClick={() => goToWriteReview(booking.serviceId)}
                        >
                          Review Service
                        </Button>
                        <Button
                          className="write-review-btn agent-review-btn"
                          startIcon={<PersonOutlineIcon />}
                          onClick={() => goToWriteAgentReview(booking.agentId)}
                        >
                          Review Agent
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default BookingsOrders;
