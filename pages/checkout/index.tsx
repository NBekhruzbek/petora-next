import { useTranslation } from "react-i18next";
import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import { MOCK_BILLING_INFO, MOCK_PERSONAL_INFO } from "@/libs/data/userProfile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface DeliveryForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

const MOCK_ITEMS: OrderItem[] = [
  {
    id: "1",
    name: "Cat Fillet",
    image: "/img/products/fillet.png",
    price: 10,
    quantity: 1,
  },
  {
    id: "2",
    name: "Bone Toy",
    image: "/img/products/bone-toy.png",
    price: 15,
    quantity: 2,
  },
  {
    id: "3",
    name: "Royal Canin",
    image: "/img/products/royal-canin.png",
    price: 32,
    quantity: 1,
  },
];

const DELIVERY_FEE = 5;

function formatCardNumber(val: string) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function getCardBrand(num: string) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^5[1-5]/.test(n)) return "MASTERCARD";
  if (/^3[47]/.test(n)) return "AMEX";
  return "CARD";
}
function maskCard(num: string) {
  const clean = num.replace(/\s/g, "");
  return clean.length >= 4
    ? `•••• •••• •••• ${clean.slice(-4)}`
    : "•••• •••• •••• ••••";
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fff",
    "& fieldset": { borderColor: "#410075" },
    "&:hover fieldset": { borderColor: "#6d28d9" },
    "&.Mui-focused fieldset": { borderColor: "#410075" },
    "&.Mui-disabled fieldset": { borderColor: "rgba(0,0,0,0.05)" },
  },
  "& .MuiInputBase-input": {
    fontFamily: "Assistant",
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },
};

const CheckoutPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [placed, setPlaced] = useState(false);
  const [orderNumber] = useState(
    `PTR-${Math.floor(10000 + Math.random() * 90000)}`,
  );
  const [editDelivery, setEditDelivery] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryForm>({
    fullName: MOCK_PERSONAL_INFO.fullName,
    phone: MOCK_PERSONAL_INFO.phone,
    address: MOCK_BILLING_INFO.address,
    city: MOCK_BILLING_INFO.city,
    zip: MOCK_BILLING_INFO.zipCode,
    country: MOCK_BILLING_INFO.country,
  });
  const [deliveryDraft, setDeliveryDraft] = useState(delivery);

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: MOCK_BILLING_INFO.cardNumber,
    cardHolder: MOCK_BILLING_INFO.cardHolder,
    expiry: MOCK_BILLING_INFO.expiryDate,
    cvv: MOCK_BILLING_INFO.cvv,
  });
  const [paymentDraft, setPaymentDraft] = useState(payment);

  const subtotal = MOCK_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 100 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const handleDeliveryChange = (field: keyof DeliveryForm, val: string) =>
    setDeliveryDraft((p) => ({ ...p, [field]: val }));

  const handlePaymentChange = (field: keyof PaymentForm, raw: string) => {
    let val = raw;
    if (field === "cardNumber") val = formatCardNumber(raw);
    if (field === "expiry") val = formatExpiry(raw);
    if (field === "cvv") val = raw.replace(/\D/g, "").slice(0, 3);
    setPaymentDraft((p) => ({ ...p, [field]: val }));
  };

  const saveDelivery = () => {
    setDelivery(deliveryDraft);
    setEditDelivery(false);
  };
  const cancelDelivery = () => {
    setDeliveryDraft(delivery);
    setEditDelivery(false);
  };
  const savePayment = () => {
    setPayment(paymentDraft);
    setEditPayment(false);
  };
  const cancelPayment = () => {
    setPaymentDraft(payment);
    setEditPayment(false);
  };

  const handlePlaceOrder = () => setPlaced(true);

  // ── Success screen ──
  if (placed) {
    return (
      <Stack className="checkout-success">
        <Stack className="checkout-success-card">
          <CheckCircleOutlineIcon className="success-icon" />
          <Typography className="success-title">
            {t("checkout.orderPlaced")}
          </Typography>
          <Typography className="success-order-num">
            Order #{orderNumber}
          </Typography>
          <Typography className="success-message">
            Thank you for your order. We've received your payment and will start
            preparing your items right away.
          </Typography>
          <Divider className="success-divider" />
          <Stack className="success-items">
            {MOCK_ITEMS.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                gap="12px"
                className="success-item"
              >
                <Box className="success-item-img-wrap">
                  <img src={item.image} alt={item.name} />
                </Box>
                <Stack flex={1}>
                  <Typography className="success-item-name">
                    {item.name}
                  </Typography>
                  <Typography className="success-item-qty">
                    Qty: {item.quantity}
                  </Typography>
                </Stack>
                <Typography className="success-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" gap="12px" className="success-actions">
            <Button
              className="btn-success-shop"
              onClick={() => void router.push("/shop")}
              startIcon={<ShoppingBagOutlinedIcon />}
            >
              {t("checkout.continueShopping")}
            </Button>
            <Button
              className="btn-success-orders"
              onClick={() =>
                void router.push("/mypage?category=ORDERS_BOOKINGS&tab=ORDERS")
              }
            >
              {t("checkout.viewMyOrders")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="checkout-page">
      <Stack className="container">
        {/* Heading */}
        <Stack className="checkout-heading">
          <Button
            className="btn-back-to-shop"
            startIcon={<ArrowBackIcon />}
            onClick={() => void router.push("/shop")}
          >
            {t("checkout.backToShop")}
          </Button>
          <Typography className="checkout-title">
            {t("checkout.title")}
          </Typography>
        </Stack>

        <Stack className="checkout-body">
          {/* ── Left: form column ── */}
          <Stack className="checkout-form-col">
            {/* Delivery Address */}
            <Stack
              className={`checkout-section ${editDelivery ? "editable" : ""}`}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className="checkout-section-header"
              >
                <Stack direction="row" alignItems="center" gap="10px">
                  <Stack className="section-icon-wrap">
                    <LocationOnOutlinedIcon />
                  </Stack>
                  <Typography className="checkout-section-title">
                    {t("checkout.deliveryAddress")}
                  </Typography>
                </Stack>
                {!editDelivery && (
                  <Button
                    className="btn-section-edit"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      setDeliveryDraft(delivery);
                      setEditDelivery(true);
                    }}
                  >
                    {t("checkout.edit")}
                  </Button>
                )}
              </Stack>

              {editDelivery ? (
                <Stack className="checkout-fields">
                  <Stack className="field-row-2">
                    <TextField
                      label={t("checkout.fFullName")}
                      value={deliveryDraft.fullName}
                      onChange={(e) =>
                        handleDeliveryChange("fullName", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label={t("checkout.fPhone")}
                      value={deliveryDraft.phone}
                      onChange={(e) =>
                        handleDeliveryChange("phone", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                  </Stack>
                  <TextField
                    label={t("checkout.fStreet")}
                    value={deliveryDraft.address}
                    onChange={(e) =>
                      handleDeliveryChange("address", e.target.value)
                    }
                    fullWidth
                    sx={fieldSx}
                  />
                  <Stack className="field-row-3">
                    <TextField
                      label={t("checkout.fCity")}
                      value={deliveryDraft.city}
                      onChange={(e) =>
                        handleDeliveryChange("city", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label={t("checkout.fZip")}
                      value={deliveryDraft.zip}
                      onChange={(e) =>
                        handleDeliveryChange("zip", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label={t("checkout.fCountry")}
                      value={deliveryDraft.country}
                      onChange={(e) =>
                        handleDeliveryChange("country", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                  </Stack>
                  <Stack direction="row" gap="10px" justifyContent="flex-end">
                    <Button
                      className="btn-section-cancel"
                      onClick={cancelDelivery}
                    >
                      {t("checkout.cancel")}
                    </Button>
                    <Button className="btn-section-save" onClick={saveDelivery}>
                      {t("checkout.save")}
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack className="review-display">
                  <Stack direction="row" gap="32px" flexWrap="wrap">
                    <Stack className="review-field">
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap="6px"
                        className="review-label"
                      >
                        <PersonOutlineIcon fontSize="small" />
                        <span>{t("checkout.fullName")}</span>
                      </Stack>
                      <Typography className="review-value">
                        {delivery.fullName}
                      </Typography>
                    </Stack>
                    <Stack className="review-field">
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap="6px"
                        className="review-label"
                      >
                        <PhoneOutlinedIcon fontSize="small" />
                        <span>{t("checkout.phone")}</span>
                      </Stack>
                      <Typography className="review-value">
                        {delivery.phone}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className="review-field">
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="6px"
                      className="review-label"
                    >
                      <HomeOutlinedIcon fontSize="small" />
                      <span>{t("checkout.address")}</span>
                    </Stack>
                    <Typography className="review-value">
                      {delivery.address}
                    </Typography>
                    <Typography className="review-subvalue">
                      {delivery.city}, {delivery.zip} · {delivery.country}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>

            {/* Payment Details */}
            <Stack
              className={`checkout-section ${editPayment ? "editable" : ""}`}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className="checkout-section-header"
              >
                <Stack direction="row" alignItems="center" gap="10px">
                  <Stack className="section-icon-wrap">
                    <CreditCardOutlinedIcon />
                  </Stack>
                  <Typography className="checkout-section-title">
                    {t("checkout.paymentMethod")}
                  </Typography>
                </Stack>
                {!editPayment && (
                  <Button
                    className="btn-section-edit"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      setPaymentDraft(payment);
                      setEditPayment(true);
                    }}
                  >
                    {t("checkout.edit")}
                  </Button>
                )}
              </Stack>

              {/* Card preview — same structure as BillingInfo */}
              <Box className="credit-card-preview" sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box className="chip" />
                  <Typography className="type">
                    {getCardBrand(
                      editPayment
                        ? paymentDraft.cardNumber
                        : payment.cardNumber,
                    )}
                  </Typography>
                </Stack>
                <Typography className="card-number">
                  {editPayment
                    ? paymentDraft.cardNumber || "•••• •••• •••• ••••"
                    : maskCard(payment.cardNumber)}
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Stack spacing={0.5}>
                    <Typography className="label">
                      {t("checkout.cardHolder")}
                    </Typography>
                    <Typography className="value">
                      {(editPayment
                        ? paymentDraft.cardHolder
                        : payment.cardHolder) || "NAME ON CARD"}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography className="label">
                      {t("checkout.expires")}
                    </Typography>
                    <Typography className="value">
                      {(editPayment ? paymentDraft.expiry : payment.expiry) ||
                        "MM/YY"}
                    </Typography>
                  </Stack>
                  <Box className="logos">
                    <Box className="logo1" />
                    <Box className="logo2" />
                  </Box>
                </Stack>
              </Box>

              {editPayment ? (
                <Stack className="checkout-fields">
                  <TextField
                    label={t("checkout.fCardNumber")}
                    value={paymentDraft.cardNumber}
                    onChange={(e) =>
                      handlePaymentChange("cardNumber", e.target.value)
                    }
                    fullWidth
                    sx={fieldSx}
                    placeholder={t("checkout.phCardNumber")}
                  />
                  <TextField
                    label={t("checkout.fCardName")}
                    value={paymentDraft.cardHolder}
                    onChange={(e) =>
                      handlePaymentChange("cardHolder", e.target.value)
                    }
                    fullWidth
                    sx={fieldSx}
                  />
                  <Stack className="field-row-2">
                    <TextField
                      label={t("checkout.fExpiry")}
                      value={paymentDraft.expiry}
                      onChange={(e) =>
                        handlePaymentChange("expiry", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                      placeholder={t("checkout.phExpiry")}
                    />
                    <TextField
                      label={t("checkout.fCvv")}
                      type={showCvv ? "text" : "password"}
                      value={paymentDraft.cvv}
                      onChange={(e) =>
                        handlePaymentChange("cvv", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCvv(!showCvv)}
                              edge="end"
                              size="small"
                            >
                              {showCvv ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" gap="10px" justifyContent="flex-end">
                    <Button
                      className="btn-section-cancel"
                      onClick={cancelPayment}
                    >
                      {t("checkout.cancel")}
                    </Button>
                    <Button className="btn-section-save" onClick={savePayment}>
                      {t("checkout.save")}
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack className="review-display">
                  <Stack direction="row" gap="32px" flexWrap="wrap">
                    <Stack className="review-field">
                      <Typography className="review-label-plain">
                        {t("checkout.card")}
                      </Typography>
                      <Typography className="review-value">
                        {t("checkout.cardEndingIn", {
                          brand: getCardBrand(payment.cardNumber),
                          last4: payment.cardNumber
                            .replace(/\s/g, "")
                            .slice(-4),
                        })}
                      </Typography>
                    </Stack>
                    <Stack className="review-field">
                      <Typography className="review-label-plain">
                        {t("checkout.expires")}
                      </Typography>
                      <Typography className="review-value">
                        {payment.expiry}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              )}

              <Stack
                direction="row"
                alignItems="center"
                gap="6px"
                className="secure-note"
              >
                <LockOutlinedIcon fontSize="small" />
                <Typography>{t("checkout.sslNotice")}</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* ── Right: Order Summary ── */}
          <Stack className="checkout-summary-col">
            <Stack className="checkout-summary-card">
              <Typography className="summary-card-title">
                {t("checkout.orderSummary")}
              </Typography>

              <Stack className="summary-items">
                {MOCK_ITEMS.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    alignItems="center"
                    gap="12px"
                    className="summary-item"
                  >
                    <Box className="summary-item-img-wrap">
                      <img src={item.image} alt={item.name} />
                    </Box>
                    <Stack flex={1}>
                      <Typography className="summary-item-name">
                        {item.name}
                      </Typography>
                      <Typography className="summary-item-qty">
                        ×{item.quantity}
                      </Typography>
                    </Stack>
                    <Typography className="summary-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack className="summary-totals">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className="summary-totals-row"
                >
                  <Typography className="totals-label">
                    {t("checkout.subtotal")}
                  </Typography>
                  <Typography className="totals-value">
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className="summary-totals-row"
                >
                  <Typography className="totals-label">
                    {t("checkout.delivery")}
                  </Typography>
                  {deliveryFee === 0 ? (
                    <Typography className="totals-value free-delivery">
                      Free
                    </Typography>
                  ) : (
                    <Typography className="totals-value">
                      ${deliveryFee.toFixed(2)}
                    </Typography>
                  )}
                </Stack>
                <Box className="totals-divider" />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography className="totals-total-label">
                    {t("checkout.total")}
                  </Typography>
                  <Typography className="totals-total-value">
                    ${total.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                className="btn-place-order"
                onClick={handlePlaceOrder}
                startIcon={<LockOutlinedIcon />}
              >
                {t("checkout.placeOrder")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(CheckoutPage);
