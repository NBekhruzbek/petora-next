import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Rating, Stack, Tab, Tabs, Typography } from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckIcon from "@mui/icons-material/Check";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const BOOKINGS = [
  {
    id: 1,
    service: "Premium Grooming",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    date: "May 12, 2026 · 10:00 AM",
    price: "₩45,000",
    rating: 4.8,
    reservations: 128,
    request: "Sensitive skin, use gentle shampoo.",
    status: "pending",
  },
  {
    id: 2,
    service: "Dog Walking",
    category: "Walking",
    image: "/img/services/walking.jpg",
    date: "May 12, 2026 · 2:00 PM",
    price: "₩25,000",
    rating: 4.7,
    reservations: 256,
    request: "Needs extra exercise, energetic dog.",
    status: "pending",
  },
  {
    id: 3,
    service: "Cat Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    date: "May 13 – 15, 2026",
    price: "₩65,000/night",
    rating: 4.9,
    reservations: 89,
    request: "Special diet required, medication at 8pm.",
    status: "accepted",
  },
  {
    id: 4,
    service: "Premium Grooming",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    date: "Apr 28, 2026 · 11:00 AM",
    price: "₩45,000",
    rating: 4.8,
    reservations: 214,
    request: "Full groom including nail trim.",
    status: "completed",
  },
];

const ORDERS = [
  {
    id: 1,
    orderNo: "ORD-20260509-001",
    status: "processing",
    orderTimestamp: Date.now() - 30 * 3_600_000,
    estimatedDeliveryHours: 240,
    products: [
      {
        name: "FILLET 'O' LAKES - KIT CAT",
        image: "/img/products/fillet.png",
        categories: ["Foods"],
        petType: "Cats",
        quantity: 2,
        unitPrice: 100,
      },
      {
        name: "CAT TRAVEL FEEDER BOWL",
        image: "/img/products/fillet.png",
        categories: ["Accessories"],
        petType: "Cats",
        quantity: 1,
        unitPrice: 98,
      },
    ],
    deliveryPrice: 30,
    orderDate: "May 9, 2026",
  },
  {
    id: 2,
    orderNo: "ORD-20260508-002",
    status: "shipped",
    orderTimestamp: Date.now() - 90 * 3_600_000,
    estimatedDeliveryHours: 120,
    products: [
      {
        name: "ENCORE - CAT FOOD",
        image: "/img/products/encore.png",
        categories: ["Foods", "Health"],
        petType: "Cats",
        quantity: 1,
        unitPrice: 400,
      },
    ],
    deliveryPrice: 20,
    orderDate: "May 8, 2026",
  },
  {
    id: 3,
    orderNo: "ORD-20260506-003",
    status: "delivered",
    orderTimestamp: Date.now() - 200 * 3_600_000,
    estimatedDeliveryHours: 168,
    products: [
      {
        name: "PAW & COAT CARE BUNDLE",
        image: "/img/products/dog-toys-to-mouth.png",
        categories: ["Health", "Accessories"],
        petType: "Dogs",
        quantity: 1,
        unitPrice: 260,
      },
      {
        name: "PUPPY CHEW STARTER PACK",
        image: "/img/products/basketball-ball.png",
        categories: ["Toys", "Accessories"],
        petType: "Dogs",
        quantity: 2,
        unitPrice: 150,
      },
      {
        name: "WINTER WALK DOG JACKET",
        image: "/img/products/wellness.png",
        categories: ["Clothes", "Accessories"],
        petType: "Dogs",
        quantity: 1,
        unitPrice: 210,
      },
    ],
    deliveryPrice: 0,
    orderDate: "May 6, 2026",
  },
];

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
    <rect x="1" y="3" width="33" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
    <rect x="2" y="4" width="1" height="15" rx="0.5" fill="rgba(255,255,255,0.22)" />

    {/* Cab — #F0F4F9, RIGHT (front of truck, facing right) */}
    <path
      d="M34 3 L34 20 L55 20 L55 14 L46 3 Z"
      fill="#F0F4F9"
      stroke="#d1d5db"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    {/* Driver window */}
    <rect x="36" y="4.5" width="9" height="7" rx="1.2" fill="#bae6fd" opacity="0.85" />

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
  { label: ["Order", "Processed"], Icon: AssignmentTurnedInOutlinedIcon, pct: 0 },
  { label: ["Order", "Shipped"], Icon: Inventory2OutlinedIcon, pct: 33 },
  { label: ["Order", "En Route"], Icon: LocalShippingOutlinedIcon, pct: 66 },
  { label: ["Order", "Arrived"], Icon: HomeOutlinedIcon, pct: 100 },
];

const DeliveryTracker = ({
  orderTimestamp,
  estimatedDeliveryHours,
}: {
  orderTimestamp: number;
  estimatedDeliveryHours: number;
}) => {
  const totalMs = estimatedDeliveryHours * 3_600_000;
  const pct = Math.min(Math.max(((Date.now() - orderTimestamp) / totalMs) * 100, 0), 100);

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
  const initialTab = router.query.tab === "ORDERS" ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookingStatuses, setBookingStatuses] = useState<
    Record<number, string>
  >({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getBookingStatus = (item: (typeof BOOKINGS)[number]) =>
    bookingStatuses[item.id] || item.status;

  const goToWriteReview = () => {
    router.push("/service/booking?writeReview=true");
  };

  const formatWon = (value: number) => `₩${value.toLocaleString()}`;

  return (
    <Stack className="bookings-orders-container" spacing={3}>
      <Stack className="bookings-orders-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="bookings and orders tabs"
        >
          <Tab label="Bookings" />
          <Tab label="Orders" />
        </Tabs>
      </Stack>

      <Box className="bookings-orders-tab-content">
        {/* ── BOOKINGS TAB ── */}
        {activeTab === 0 && (
          <Stack spacing={1.5} className="bo-bookings-tab">
            {BOOKINGS.map((item) => {
              const status = getBookingStatus(item);
              return (
                <Stack
                  key={item.id}
                  direction="row"
                  alignItems="center"
                  className={`service-row ${status}`}
                >
                  {/* Service image */}
                  <Box className="service-row-media">
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.service}
                      className="service-thumb-img"
                    />
                  </Box>

                  {/* Main info */}
                  <Stack className="service-row-main" spacing={0.75}>
                    <Typography className="agent-name">
                      {item.service}
                    </Typography>
                    <Typography className="service-description">
                      {item.request}
                    </Typography>
                    <Typography className="agent-service-type">
                      {item.category}
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
                        {item.price}
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
                          value={item.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography className="rating-value">
                          {item.rating}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack className="metric-block">
                      <Typography className="metric-label">
                        Reservations
                      </Typography>
                      <Typography className="bookings-row">
                        {item.reservations}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* End: Booked time + Status */}
                  <Stack className="booking-end-block" spacing={1}>
                    <Stack spacing={0.25}>
                      <Typography className="metric-label">Booked</Typography>
                      <Typography className="booking-date">
                        {item.date}
                      </Typography>
                    </Stack>
                    <Box className={`booking-status-badge ${status}`}>
                      {status}
                    </Box>
                    {status === "completed" && (
                      <Button
                        className="write-review-btn"
                        startIcon={<RateReviewOutlinedIcon />}
                        onClick={goToWriteReview}
                      >
                        Write Review
                      </Button>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 1 && (
          <Stack spacing={2} className="bo-orders-list">
            {ORDERS.map((item) => {
              const productsPrice = item.products.reduce(
                (sum, p) => sum + p.unitPrice * p.quantity,
                0,
              );
              const totalPrice = productsPrice + item.deliveryPrice;

              return (
                <Stack
                  key={item.id}
                  className={`order-card ${item.status}`}
                  spacing={0}
                >
                  {/* Header */}
                  <Stack className="order-card-header" spacing={1.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack spacing={0.5}>
                        <Typography className="order-card-label">
                          Order Number
                        </Typography>
                        <Typography className="order-card-number">
                          {item.orderNo}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Typography className="order-card-label">
                            Order Date
                          </Typography>
                          <Typography className="order-card-date">
                            {item.orderDate}
                          </Typography>
                        </Stack>
                        {item.status === "delivered" && (
                          <Box className="order-status-badge delivered">
                            Delivered
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                    <DeliveryTracker
                      orderTimestamp={item.orderTimestamp}
                      estimatedDeliveryHours={item.estimatedDeliveryHours}
                    />
                  </Stack>

                  {/* Products */}
                  <Stack className="order-card-products" spacing={1.25}>
                    {item.products.map((product) => (
                      <Stack
                        key={product.name}
                        className="order-product-card"
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Box className="order-product-image">
                          <Box
                            component="img"
                            src={product.image}
                            alt={product.name}
                          />
                        </Box>

                        <Stack spacing={0.4} flex={1} minWidth={0}>
                          <Typography className="order-product-title">
                            {product.name}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            className="order-product-meta"
                          >
                            <Typography className="product-meta-item">
                              {product.petType}
                            </Typography>
                            <Typography className="product-meta-categories">
                              {product.categories.join(" · ")}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          spacing={0.25}
                          alignItems="flex-end"
                          className="order-product-info"
                        >
                          <Typography className="product-quantity">
                            {product.quantity} × {formatWon(product.unitPrice)}
                          </Typography>
                          <Typography className="product-line-total">
                            {formatWon(product.unitPrice * product.quantity)}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
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

                    {item.deliveryPrice > 0 && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        className="price-row"
                      >
                        <Typography className="price-label">
                          Delivery
                        </Typography>
                        <Typography className="price-value">
                          {formatWon(item.deliveryPrice)}
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
                        {formatWon(totalPrice)}
                      </Typography>
                    </Stack>
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
