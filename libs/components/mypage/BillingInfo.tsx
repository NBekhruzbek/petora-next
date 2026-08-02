import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_MEMBER_BILLING_INFOS, GET_MY_ORDERS } from "@/apollo/user/query";
import { UPDATE_MEMBER_BILLING_INFOS } from "@/apollo/user/mutation";
import { MemberBillingInfos } from "@/libs/types/member/member";
import { MemberBillingUpdate } from "@/libs/types/member/member.update";
import { Order } from "@/libs/types/order/order";
import { OrderStatus } from "@/libs/enums/order.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

interface BillingInfoProps {
  isEditable: boolean;
  cancelTrigger?: number;
  saveTrigger?: number;
  onSaveComplete?: (succeeded: boolean) => void;
}

interface BillingForm {
  companyName: string;
  vatNumber: string;
  address: string;
  city: string;
  zipCode: string;
  countryName: string;
}

// Mirrors availableCountries on the API, which rejects anything else.
const COUNTRIES = [
  "South Korea",
  "United States",
  "United Kingdom",
  "Japan",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Uzbekistan",
];

const INVOICES_LIMIT = 6;

const emptyForm: BillingForm = {
  companyName: "",
  vatNumber: "",
  address: "",
  city: "",
  zipCode: "",
  countryName: "",
};

const toForm = (billing?: MemberBillingInfos | null): BillingForm => ({
  companyName: billing?.companyName ?? "",
  vatNumber: billing?.vatNumber ?? "",
  address: billing?.address ?? "",
  city: billing?.city ?? "",
  zipCode: billing?.zipCode ?? "",
  countryName: billing?.countryName ?? "",
});

const formatWon = (value: number) => `₩${(value ?? 0).toLocaleString()}`;

const formatDate = (value: Date | string | undefined, locale: string) =>
  value
    ? new Date(value).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const BillingInfo = ({
  isEditable,
  cancelTrigger,
  saveTrigger,
  onSaveComplete,
}: BillingInfoProps) => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const user = useReactiveVar(userVar);
  const [form, setForm] = useState<BillingForm>(emptyForm);
  const lastSaveTrigger = useRef(saveTrigger ?? 0);

  /** APOLLO REQUESTS **/

  const { data: getBillingData, refetch: getBillingRefetch } = useQuery(
    GET_MEMBER_BILLING_INFOS,
    {
      fetchPolicy: "cache-and-network",
      skip: !user?._id,
      notifyOnNetworkStatusChange: true,
    },
  );

  const { data: getMyOrdersData } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: { input: { page: 1, limit: INVOICES_LIMIT } },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  const [updateMemberBillingInfos] = useMutation(UPDATE_MEMBER_BILLING_INFOS);

  /** DERIVED **/

  const billing: MemberBillingInfos | null =
    getBillingData?.getMemberBillingInfos ?? null;
  const orders: Order[] = getMyOrdersData?.getMyOrders?.list ?? [];
  const hasCard = Boolean(billing?.last4);
  const cardNumber = hasCard
    ? `•••• •••• •••• ${billing?.last4}`
    : "•••• •••• •••• ••••";
  const cardExpiry =
    billing?.expiryMonth && billing?.expiryYear
      ? `${billing.expiryMonth}/${billing.expiryYear.slice(-2)}`
      : "MM/YY";

  /** LIFECYCLES **/

  const applyBilling = (source?: MemberBillingInfos | null) =>
    setForm(toForm(source));

  useEffect(() => {
    if (!isEditable) applyBilling(billing);
  }, [billing]);

  useEffect(() => {
    if (cancelTrigger && cancelTrigger > 0) applyBilling(billing);
  }, [cancelTrigger]);

  useEffect(() => {
    if (!saveTrigger || saveTrigger === lastSaveTrigger.current) return;
    lastSaveTrigger.current = saveTrigger;
    void handleSave();
  }, [saveTrigger]);

  /** HANDLERS **/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "zipCode") {
      value = value.replace(/\D/g, "").slice(0, 5);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!user?._id) throw new Error(t("mypage.personal.loginFirst"));

      if (form.zipCode && form.zipCode.length < 5) {
        throw new Error(t("mypage.billing.zipError"));
      }

      const input: MemberBillingUpdate = {
        memberId: user._id,
        companyName: form.companyName.trim(),
        vatNumber: form.vatNumber.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
      };

      if (form.zipCode) input.zipCode = form.zipCode;
      if (form.countryName) input.countryName = form.countryName;

      await updateMemberBillingInfos({ variables: { input } });

      const { data: refetched } = await getBillingRefetch();
      applyBilling(refetched?.getMemberBillingInfos);

      await sweetBottomSmallSuccessAlert(t("mypage.billing.updated"), 900);
      onSaveComplete?.(true);
    } catch (err: any) {
      console.log("ERROR, handleSave:", err.message);
      await sweetMixinErrorAlert(err.message);
      onSaveComplete?.(false);
    }
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--pt-field-surface)",
      color: "var(--pt-ink-strong)",
      "& fieldset": {
        borderColor: isEditable
          ? "var(--pt-ink)"
          : "var(--pt-hairline)",
      },
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "var(--pt-ink-strong)",
      },
    },
  };

  return (
    <Stack spacing={4} className="billing-info-wrapper">
      {/* Payment Method Section */}
      <Stack
        spacing={3}
        className={`billing-card-section ${isEditable ? "editable" : ""}`}
        sx={{ p: 5 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--pt-ink-strong)" }}>
            {t("mypage.billing.paymentMethod")}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={6}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              width: { xs: "100%", lg: "400px" },
              flexShrink: 0,
            }}
          >
            <Box className="credit-card-preview" sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box className="chip" />
                <Typography className="type">
                  {billing?.cardBrand || "CARD"}
                </Typography>
              </Stack>
              <Typography className="card-number">{cardNumber}</Typography>
              <Stack direction="row" spacing={4}>
                <Stack spacing={0.5}>
                  <Typography className="label">
                    {t("mypage.billing.cardHolder")}
                  </Typography>
                  <Typography className="value">
                    {billing?.cardHolderName || "NAME ON CARD"}
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography className="label">
                    {t("mypage.billing.expires")}
                  </Typography>
                  <Typography className="value">{cardExpiry}</Typography>
                </Stack>
                <Box className="logos">
                  <Box className="logo1" />
                  <Box className="logo2" />
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Stack spacing={2}>
              <Box>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--pt-ink-muted)",
                      }}
                    >
                      {t("mypage.billing.cardHolderName")}
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    disabled
                    value={billing?.cardHolderName || "—"}
                    sx={commonTextFieldStyles}
                  />
                </Stack>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CreditCardIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--pt-ink-muted)",
                      }}
                    >
                      {t("mypage.billing.cardNumber")}
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    disabled
                    value={hasCard ? cardNumber : t("mypage.billing.noCard")}
                    sx={commonTextFieldStyles}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      {/* Billing Address Section */}
      <Stack
        spacing={3}
        className={`billing-address-section ${isEditable ? "editable" : ""}`}
        sx={{ p: 5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <BusinessIcon sx={{ color: "var(--pt-ink-strong)" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--pt-ink-strong)" }}>
            {t("mypage.billing.billingAddress")}
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                  >
                    {t("mypage.billing.company")}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="companyName"
                  disabled={!isEditable}
                  value={form.companyName}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Stack>
            </Box>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ReceiptIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                  >
                    {t("mypage.billing.vat")}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="vatNumber"
                  disabled={!isEditable}
                  value={form.vatNumber}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Stack>
            </Box>
          </Stack>

          <Box>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                >
                  {t("mypage.billing.address")}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="address"
                disabled={!isEditable}
                value={form.address}
                onChange={handleChange}
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationCityIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                  >
                    {t("mypage.billing.city")}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="city"
                  disabled={!isEditable}
                  value={form.city}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Stack>
            </Box>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MarkunreadMailboxIcon
                    sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }}
                  />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                  >
                    {t("mypage.billing.zip")}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  name="zipCode"
                  disabled={!isEditable}
                  value={form.zipCode}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Stack>
            </Box>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PublicIcon sx={{ fontSize: 18, color: "var(--pt-ink-faint)" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "var(--pt-ink-muted)" }}
                  >
                    {t("mypage.billing.country")}
                  </Typography>
                </Stack>
                <TextField
                  select
                  fullWidth
                  name="countryName"
                  disabled={!isEditable}
                  value={form.countryName}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "var(--pt-menu-surface) !important",
                          border: "1px solid var(--pt-hairline)",
                          "& .MuiMenuItem-root": {
                            color: "var(--pt-menu-ink)",
                            fontWeight: 500,
                          },
                          "& .Mui-selected": {
                            backgroundColor: "var(--pt-selected) !important",
                            color: "var(--pt-ink)",
                          },
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "var(--pt-hover)",
                          },
                        },
                      },
                    },
                  }}
                >
                  {COUNTRIES.map((option) => (
                    // The value stays the English name — the API validates
                    // against its own availableCountries list.
                    <MenuItem key={option} value={option}>
                      {t(`mypage.billing.countries.${option}`, {
                        defaultValue: option,
                      })}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      {/* Invoice History Section */}
      <Stack spacing={3} className="invoice-history-section" sx={{ p: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptLongIcon sx={{ color: "var(--pt-ink-strong)" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--pt-ink-strong)" }}>
            {t("mypage.billing.invoiceHistory")}
          </Typography>
        </Stack>

        {orders.length === 0 ? (
          <Typography sx={{ color: "var(--pt-ink-cool)", fontSize: "14px" }}>
            {t("mypage.billing.noInvoices")}
          </Typography>
        ) : (
          <Stack className="invoice-list" spacing={1}>
            {orders.map((order) => {
              // An order only counts as settled once it has actually arrived.
              const isPaid = order.orderStatus === OrderStatus.ARRIVED;
              const isCancelled = order.orderStatus === OrderStatus.CANCELLED;
              const statusLabel = isCancelled
                ? "Cancelled"
                : isPaid
                  ? "Paid"
                  : "Pending";

              return (
                <Stack
                  key={order._id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className="invoice-item"
                  sx={{ p: 2, borderBottom: "1px solid var(--pt-hairline)" }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      className="icon-box"
                      sx={{
                        p: 1.5,
                        backgroundColor: "var(--pt-surface-sunken)",
                        borderRadius: "8px",
                      }}
                    >
                      <ReceiptLongIcon
                        fontSize="small"
                        sx={{ color: "var(--pt-ink-cool)" }}
                      />
                    </Box>
                    <Stack>
                      <Typography
                        className="id"
                        sx={{
                          fontWeight: 600,
                          color: "var(--pt-ink-strong)",
                          fontSize: "14px",
                        }}
                      >
                        {order.orderNumber}
                      </Typography>
                      <Typography
                        className="date"
                        sx={{ color: "var(--pt-ink-cool)", fontSize: "13px" }}
                      >
                        {formatDate(order.createdAt, intlLocale)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={4} alignItems="center">
                    <Typography
                      className="amount"
                      sx={{ fontWeight: 600, color: "var(--pt-ink-strong)" }}
                    >
                      {formatWon(order.orderTotal)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      className="status"
                      sx={{
                        backgroundColor: isCancelled ? "#fef2f2" : "#ecfdf5",
                        px: 1,
                        py: 0.5,
                        borderRadius: "16px",
                      }}
                    >
                      <VerifiedIcon
                        sx={{
                          fontSize: 14,
                          color: isCancelled ? "#ef4444" : "#10b981",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isCancelled ? "#ef4444" : "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        {statusLabel}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default BillingInfo;
