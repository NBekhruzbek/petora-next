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

const formatDate = (value?: Date | string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
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
      if (!user?._id) throw new Error("Please login first!");

      if (form.zipCode && form.zipCode.length < 5) {
        throw new Error("Please enter a 5 digit ZIP code.");
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

      await sweetBottomSmallSuccessAlert("Billing info updated!", 900);
      onSaveComplete?.(true);
    } catch (err: any) {
      console.log("ERROR, handleSave:", err.message);
      await sweetMixinErrorAlert(err.message);
      onSaveComplete?.(false);
    }
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEditable ? "#410075" : "rgba(0, 0, 0, 0.05)",
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
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Payment Method
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
                  <Typography className="label">Card Holder</Typography>
                  <Typography className="value">
                    {billing?.cardHolderName || "NAME ON CARD"}
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography className="label">Expires</Typography>
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
                    <PersonIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#4b5563",
                      }}
                    >
                      Card Holder Name
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
                    <CreditCardIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#4b5563",
                      }}
                    >
                      Card Number
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    disabled
                    value={hasCard ? cardNumber : "No card on file"}
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
          <BusinessIcon sx={{ color: "#000" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Billing Address
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box flex={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                  >
                    Company Name (Optional)
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
                  <ReceiptIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                  >
                    VAT Number (Optional)
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
                <LocationOnIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Address
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
                  <LocationCityIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                  >
                    City
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
                    sx={{ fontSize: 18, color: "#9ca3af" }}
                  />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                  >
                    ZIP Code
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
                  <PublicIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                  >
                    Country
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
                          "& .MuiMenuItem-root": {
                            color: "#111827",
                            fontWeight: 500,
                          },
                          "& .Mui-selected": {
                            backgroundColor: "#f3f4f6 !important",
                            color: "#111827",
                          },
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#f9fafb",
                          },
                        },
                      },
                    },
                  }}
                >
                  {COUNTRIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
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
          <ReceiptLongIcon sx={{ color: "#000" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Invoice History
          </Typography>
        </Stack>

        {orders.length === 0 ? (
          <Typography sx={{ color: "#6b7280", fontSize: "14px" }}>
            No invoices yet.
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
                  sx={{ p: 2, borderBottom: "1px solid #f3f4f6" }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      className="icon-box"
                      sx={{
                        p: 1.5,
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    >
                      <ReceiptLongIcon
                        fontSize="small"
                        sx={{ color: "#6b7280" }}
                      />
                    </Box>
                    <Stack>
                      <Typography
                        className="id"
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "14px",
                        }}
                      >
                        {order.orderNumber}
                      </Typography>
                      <Typography
                        className="date"
                        sx={{ color: "#6b7280", fontSize: "13px" }}
                      >
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={4} alignItems="center">
                    <Typography
                      className="amount"
                      sx={{ fontWeight: 600, color: "#111827" }}
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
