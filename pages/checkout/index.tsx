import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useReactiveVar } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { userVar, basketVar } from "@/apollo/store";
import { CREATE_ORDER, UPDATE_MEMBER } from "@/apollo/user/mutation";
import { updateStorage, updateUserInfo } from "@/libs/auth";
import { MemberUpdate } from "@/libs/types/member/member.update";
import { BasketItem } from "@/libs/types/basket/basket";
import { Order } from "@/libs/types/order/order";
import { REACT_APP_API_URL } from "@/libs/config";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  basketSubtotal,
  clearBasket,
  formatPrice,
  hydrateBasket,
} from "@/libs/basket";
import {
  asPhoneNumber,
  buildOrderName,
  clearPendingPayment,
  generatePaymentId,
  portoneConfigured,
  readPendingPayment,
  requestKakaoPayment,
  savePendingPayment,
  toOrderItems,
} from "@/libs/payment/portone";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/libs/sweetAlert";

interface DeliveryForm {
  fullName: string;
  phone: string;
  address: string;
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
  const user = useReactiveVar(userVar);
  const basket = useReactiveVar(basketVar);

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [placedItems, setPlacedItems] = useState<BasketItem[]>([]);
  const [paying, setPaying] = useState(false);
  const [editDelivery, setEditDelivery] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryForm>({
    fullName: "",
    phone: "",
    address: "",
  });
  const [deliveryDraft, setDeliveryDraft] = useState(delivery);

  /** APOLLO REQUESTS **/

  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateMember] = useMutation(UPDATE_MEMBER);

  /** DERIVED **/

  const subtotal = basketSubtotal(basket);
  const deliveryFee =
    basket.length > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const addressReady = Boolean(delivery.address && delivery.phone);

  const imageSrc = (path: string) => `${REACT_APP_API_URL}/${path}`;

  /** LIFECYCLE **/

  useEffect(() => {
    hydrateBasket();
  }, []);

  // The address the order actually ships to is the one on the member record —
  // the server reads it there and ignores anything the browser sends — so the
  // form mirrors the profile rather than keeping its own copy.
  useEffect(() => {
    const next = {
      fullName: user?.memberFullName || user?.memberUserName || "",
      phone: asPhoneNumber(user?.memberPhone) ? user.memberPhone : "",
      address: user?.memberAddress || "",
    };
    setDelivery(next);
    setDeliveryDraft(next);
  }, [
    user?.memberFullName,
    user?.memberUserName,
    user?.memberPhone,
    user?.memberAddress,
  ]);

  /** HANDLERS **/

  const handleDeliveryChange = (field: keyof DeliveryForm, val: string) =>
    setDeliveryDraft((prev) => ({ ...prev, [field]: val }));

  const saveDelivery = async () => {
    if (!user?._id) return;
    setSavingDelivery(true);
    try {
      const input: MemberUpdate = {
        _id: user._id,
        memberFullName: deliveryDraft.fullName,
        memberPhone: deliveryDraft.phone,
        memberAddress: deliveryDraft.address,
      };
      const { data } = await updateMember({ variables: { input } });

      // The profile lives in the JWT, so a fresh token is what makes the new
      // address visible to the rest of the app.
      const accessToken = data?.updateMember?.accessToken;
      if (accessToken) {
        updateStorage({ jwtToken: accessToken });
        updateUserInfo(accessToken);
      }

      setDelivery(deliveryDraft);
      setEditDelivery(false);
      await sweetTopSmallSuccessAlert(t("checkout.addressSaved"), 900);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    } finally {
      setSavingDelivery(false);
    }
  };

  const cancelDelivery = () => {
    setDeliveryDraft(delivery);
    setEditDelivery(false);
  };

  /**
   * Turns a paid payment into an order. The server re-prices the basket and
   * checks the payment against PortOne, so a rejection here means the payment
   * did not hold up — never that the order quietly went through.
   */
  const completeOrder = useCallback(
    async (
      paymentId: string,
      items: ReturnType<typeof toOrderItems>,
      snapshot: BasketItem[],
    ) => {
      const { data } = await createOrder({
        variables: { input: items, paymentId },
      });

      clearPendingPayment();
      clearBasket();
      setPlacedItems(snapshot);
      setPlacedOrder(data?.createOrder ?? null);
    },
    [createOrder],
  );

  const handlePlaceOrder = async () => {
    if (!user?._id) {
      await sweetMixinErrorAlert(t("checkout.loginFirst"));
      return;
    }
    if (!basket.length) return;
    if (!addressReady) {
      await sweetMixinErrorAlert(t("checkout.addressRequired"));
      setEditDelivery(true);
      return;
    }
    if (!portoneConfigured) {
      await sweetMixinErrorAlert(t("checkout.paymentUnavailable"));
      return;
    }

    setPaying(true);
    const paymentId = generatePaymentId();
    const items = toOrderItems(basket);

    try {
      // Persisted before the window opens: on mobile the PG takes over the tab
      // and this page is gone by the time the payment lands.
      savePendingPayment({ paymentId, items, basket, total });

      const response = await requestKakaoPayment({
        paymentId,
        orderName: buildOrderName(
          basket,
          t("checkout.andMore", { count: basket.length - 1 }),
        ),
        totalAmount: total,
        customData: { memberId: user._id },
        customer: {
          fullName: delivery.fullName || undefined,
          phoneNumber: asPhoneNumber(delivery.phone),
          email: user?.memberEmail || undefined,
        },
        redirectUrl: `${window.location.origin}/checkout`,
      });

      // A `code` is how the SDK reports a cancelled or failed payment. Nothing
      // was charged, so the pending record has no one left to help.
      if (response?.code) {
        clearPendingPayment();
        await sweetMixinErrorAlert(response.message ?? t("checkout.payFailed"));
        return;
      }

      try {
        await completeOrder(paymentId, items, basket);
      } catch (err: any) {
        // Money moved but the order didn't stick. The server refunds what it
        // can; the pending record stays put so the paymentId survives for
        // anyone picking this up by hand.
        console.log("ERROR, completeOrder:", err.message);
        await sweetMixinErrorAlert(t("checkout.orderFailedAfterPay"));
      }
    } catch (err: any) {
      clearPendingPayment();
      await sweetMixinErrorAlert(err.message ?? t("checkout.payFailed"));
    } finally {
      setPaying(false);
    }
  };

  /**
   * The mobile flow comes back here as a plain page load carrying the result
   * in the query string, so the order has to be finished off on arrival.
   */
  const redirectHandled = useRef(false);

  useEffect(() => {
    if (!router.isReady || redirectHandled.current) return;

    const paymentId = router.query.paymentId;
    if (typeof paymentId !== "string") return;
    redirectHandled.current = true;

    // Drop the PG's parameters so a refresh doesn't replay any of this.
    void router.replace("/checkout", undefined, { shallow: true });

    const failureCode = router.query.code;
    if (typeof failureCode === "string") {
      clearPendingPayment();
      const message = router.query.message;
      void sweetMixinErrorAlert(
        typeof message === "string" ? message : t("checkout.payFailed"),
      );
      return;
    }

    const pending = readPendingPayment();
    if (!pending || pending.paymentId !== paymentId) {
      // Paid, but this browser has no record of what for. The money is real,
      // so send them somewhere a human can pick it up rather than retrying.
      void sweetMixinErrorAlert(t("checkout.payOrphaned"));
      return;
    }

    setPaying(true);
    completeOrder(pending.paymentId, pending.items, pending.basket)
      .catch((err: any) => {
        console.log("ERROR, completeOrder:", err.message);
        return sweetMixinErrorAlert(t("checkout.orderFailedAfterPay"));
      })
      .finally(() => setPaying(false));
  }, [router.isReady, router.query, completeOrder, router, t]);

  /** RENDER **/

  // ── Success screen ──
  if (placedOrder) {
    return (
      <Stack className="checkout-success">
        <Stack className="checkout-success-card">
          <CheckCircleOutlineIcon className="success-icon" />
          <Typography className="success-title">
            {t("checkout.orderPlaced")}
          </Typography>
          <Typography className="success-order-num">
            {placedOrder.orderNumber}
          </Typography>
          <Typography className="success-message">
            {t("checkout.successMessage")}
          </Typography>
          <Divider className="success-divider" />
          <Stack className="success-items">
            {placedItems.map((item) => (
              <Stack
                key={item.productId}
                direction="row"
                alignItems="center"
                gap="12px"
                className="success-item"
              >
                <Box className="success-item-img-wrap">
                  <img src={imageSrc(item.image)} alt={item.name} />
                </Box>
                <Stack flex={1}>
                  <Typography className="success-item-name">
                    {item.name}
                  </Typography>
                  <Typography className="success-item-qty">
                    {t("checkout.qty", { count: item.quantity })}
                  </Typography>
                </Stack>
                <Typography className="success-item-price">
                  {formatPrice(item.price * item.quantity)}
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

        {basket.length === 0 ? (
          <Stack className="checkout-empty">
            <ShoppingBagOutlinedIcon className="checkout-empty-icon" />
            <Typography className="checkout-empty-title">
              {t("checkout.emptyBasket")}
            </Typography>
            <Typography className="checkout-empty-sub">
              {t("checkout.emptyBasketDesc")}
            </Typography>
            <Button
              className="btn-empty-shop"
              onClick={() => void router.push("/shop")}
            >
              {t("checkout.continueShopping")}
            </Button>
          </Stack>
        ) : (
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
                        placeholder={t("checkout.phPhone")}
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
                    <Typography className="field-note">
                      {t("checkout.addressSyncNote")}
                    </Typography>
                    <Stack direction="row" gap="10px" justifyContent="flex-end">
                      <Button
                        className="btn-section-cancel"
                        onClick={cancelDelivery}
                        disabled={savingDelivery}
                      >
                        {t("checkout.cancel")}
                      </Button>
                      <Button
                        className="btn-section-save"
                        onClick={() => void saveDelivery()}
                        disabled={savingDelivery}
                      >
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
                          {delivery.fullName || "—"}
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
                          {delivery.phone || "—"}
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
                        {delivery.address || "—"}
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                {!editDelivery && !addressReady && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="8px"
                    className="checkout-warning"
                  >
                    <WarningAmberRoundedIcon fontSize="small" />
                    <Typography>{t("checkout.addressRequired")}</Typography>
                  </Stack>
                )}
              </Stack>

              {/* Payment Method */}
              <Stack className="checkout-section">
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  className="checkout-section-header"
                >
                  <Stack className="section-icon-wrap">
                    <AccountBalanceWalletOutlinedIcon />
                  </Stack>
                  <Typography className="checkout-section-title">
                    {t("checkout.paymentMethod")}
                  </Typography>
                </Stack>

                <Stack className="pay-method selected">
                  <Stack direction="row" alignItems="center" gap="12px">
                    <Stack className="pay-method-logo kakaopay">
                      <span>pay</span>
                    </Stack>
                    <Stack flex={1}>
                      <Typography className="pay-method-name">
                        {t("checkout.kakaopay")}
                      </Typography>
                      <Typography className="pay-method-desc">
                        {t("checkout.kakaopayDesc")}
                      </Typography>
                    </Stack>
                    <CheckCircleOutlineIcon className="pay-method-check" />
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap="6px"
                  className="secure-note"
                >
                  <LockOutlinedIcon fontSize="small" />
                  <Typography>{t("checkout.portoneNotice")}</Typography>
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
                  {basket.map((item) => (
                    <Stack
                      key={item.productId}
                      direction="row"
                      alignItems="center"
                      gap="12px"
                      className="summary-item"
                    >
                      <Box className="summary-item-img-wrap">
                        <img src={imageSrc(item.image)} alt={item.name} />
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
                        {formatPrice(item.price * item.quantity)}
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
                      {formatPrice(subtotal)}
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
                        {t("checkout.free")}
                      </Typography>
                    ) : (
                      <Typography className="totals-value">
                        {formatPrice(deliveryFee)}
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
                      {formatPrice(total)}
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  className="btn-place-order"
                  onClick={() => void handlePlaceOrder()}
                  disabled={paying || !addressReady}
                  startIcon={
                    paying ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <LockOutlinedIcon />
                    )
                  }
                >
                  {paying
                    ? t("checkout.processing")
                    : t("checkout.payAmount", { amount: formatPrice(total) })}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(CheckoutPage);
