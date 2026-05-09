import React, { useState } from "react";
import {
  Stack,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DownloadIcon from "@mui/icons-material/Download";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface BillingInfoProps {
  isEditable: boolean;
  cancelTrigger?: number;
}

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

const BillingInfo = ({ isEditable, cancelTrigger }: BillingInfoProps) => {
  const [showCvv, setShowCvv] = useState(false);
  const [originalBilling, setOriginalBilling] = useState({
    cardHolder: "JOHN DOE",
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvv: "281",
    companyName: "Acme Inc.",
    vatNumber: "GB123456789",
    address: "123 Market Street",
    city: "Seoul",
    zipCode: "06234",
    country: "South Korea",
  });

  const [billing, setBilling] = useState(originalBilling);

  React.useEffect(() => {
    if (isEditable) {
      setOriginalBilling(billing);
    }
  }, [isEditable]);

  React.useEffect(() => {
    if (cancelTrigger && cancelTrigger > 0) {
      setBilling(originalBilling);
    }
  }, [cancelTrigger]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, ""); // Faqat raqam
      if (value.length > 16) value = value.slice(0, 16);
      // XXXX XXXX XXXX XXXX format
      const parts = value.match(/[\s\S]{1,4}/g) || [];
      value = parts.join(" ");
    } else if (name === "cvv") {
      value = value.replace(/\D/g, ""); // Faqat raqam
      if (value.length > 3) value = value.slice(0, 3);
    } else if (name === "zipCode") {
      value = value.replace(/\D/g, ""); // Faqat raqam
      if (value.length > 5) value = value.slice(0, 5);
    } else if (name === "expiryDate") {
      value = value.replace(/\D/g, ""); // Faqat raqam
      if (value.length > 4) value = value.slice(0, 4);
      // MM/YY format
      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    }

    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEditable ? "#410075" : "rgba(0, 0, 0, 0.05)",
      },
    },
  };

  const invoiceHistory = [
    {
      id: "INV-2024-001",
      date: "Apr 1, 2026",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      date: "Mar 1, 2026",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2024-003",
      date: "Feb 1, 2026",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2024-004",
      date: "Jan 1, 2026",
      amount: "$49.00",
      status: "Paid",
    },
  ];

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
          {isEditable && (
            <Button startIcon={<CreditCardIcon />} className="add-btn">
              Add New Card
            </Button>
          )}
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
                <Typography className="type">VISA</Typography>
              </Stack>
              <Typography className="card-number">
                {billing.cardNumber || "•••• •••• •••• ••••"}
              </Typography>
              <Stack direction="row" spacing={4}>
                <Stack spacing={0.5}>
                  <Typography className="label">Card Holder</Typography>
                  <Typography className="value">
                    {billing.cardHolder || "NAME ON CARD"}
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography className="label">Expires</Typography>
                  <Typography className="value">
                    {billing.expiryDate || "MM/YY"}
                  </Typography>
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
                    name="cardHolder"
                    disabled={!isEditable}
                    value={billing.cardHolder}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
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
                    name="cardNumber"
                    disabled={!isEditable}
                    value={billing.cardNumber}
                    onChange={handleChange}
                    placeholder="4242 4242 4242 4242"
                    sx={commonTextFieldStyles}
                  />
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DateRangeIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#4b5563",
                        }}
                      >
                        Expiry Date
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      name="expiryDate"
                      disabled={!isEditable}
                      value={billing.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      sx={commonTextFieldStyles}
                    />
                  </Stack>
                </Box>
                <Box flex={1}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LockIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#4b5563",
                        }}
                      >
                        CVV
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      name="cvv"
                      type={showCvv ? "text" : "password"}
                      disabled={!isEditable}
                      value={billing.cvv}
                      onChange={handleChange}
                      placeholder="***"
                      sx={commonTextFieldStyles}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCvv(!showCvv)}
                              edge="end"
                            >
                              {showCvv ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
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
                  value={billing.companyName}
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
                  value={billing.vatNumber}
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
                value={billing.address}
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
                  value={billing.city}
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
                  value={billing.zipCode}
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
                  name="country"
                  disabled={!isEditable}
                  value={billing.country}
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

        <Stack className="invoice-list" spacing={1}>
          {invoiceHistory.map((invoice) => (
            <Stack
              key={invoice.id}
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
                  <ReceiptLongIcon fontSize="small" sx={{ color: "#6b7280" }} />
                </Box>
                <Stack>
                  <Typography
                    className="id"
                    sx={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}
                  >
                    {invoice.id}
                  </Typography>
                  <Typography
                    className="date"
                    sx={{ color: "#6b7280", fontSize: "13px" }}
                  >
                    {invoice.date}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={4} alignItems="center">
                <Typography
                  className="amount"
                  sx={{ fontWeight: 600, color: "#111827" }}
                >
                  {invoice.amount}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  className="status"
                  sx={{
                    backgroundColor: "#ecfdf5",
                    px: 1,
                    py: 0.5,
                    borderRadius: "16px",
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 14, color: "#10b981" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#10b981", fontWeight: 600 }}
                  >
                    {invoice.status}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  className="btn-download"
                  size="small"
                  startIcon={<DownloadIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                  }}
                >
                  Download
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BillingInfo;
