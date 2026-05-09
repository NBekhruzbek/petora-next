import React, { useState } from "react";
import {
  Stack,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VerifiedIcon from "@mui/icons-material/Verified";

const BillingInfo = ({ isEditable }: { isEditable: boolean }) => {
  const [billing, setBilling] = useState({
    cardHolder: "JOHN DOE",
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvv: "***",
    companyName: "Acme Inc.",
    vatNumber: "GB123456789",
    address: "123 Market Street",
    city: "Seoul",
    zipCode: "06234",
    country: "South Korea",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    { id: "INV-2024-001", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
    { id: "INV-2024-002", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
    { id: "INV-2024-003", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
    { id: "INV-2024-004", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
  ];

  return (
    <Stack spacing={4} className="billing-info-wrapper">
      {/* Payment Method Section */}
      <Stack
        spacing={3}
        className={`billing-card-section ${isEditable ? "editable" : ""}`}
        sx={{ p: 4 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Payment Method
          </Typography>
          {isEditable && (
            <Button
              startIcon={<CreditCardIcon />}
              className="add-btn"
            >
              Add New Card
            </Button>
          )}
        </Stack>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box className="credit-card-preview" sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
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
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Holder Name"
                  name="cardHolder"
                  disabled={!isEditable}
                  value={billing.cardHolder}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  disabled={!isEditable}
                  value={billing.cardNumber}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  disabled={!isEditable}
                  value={billing.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  disabled={!isEditable}
                  value={billing.cvv}
                  onChange={handleChange}
                  sx={commonTextFieldStyles}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>

      {/* Billing Address Section */}
      <Stack
        spacing={3}
        className={`billing-address-section ${isEditable ? "editable" : ""}`}
        sx={{ p: 4 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <BusinessIcon sx={{ color: "#410075" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Billing Address
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name (Optional)"
              name="companyName"
              disabled={!isEditable}
              value={billing.companyName}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="VAT Number (Optional)"
              name="vatNumber"
              disabled={!isEditable}
              value={billing.vatNumber}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              disabled={!isEditable}
              value={billing.address}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              disabled={!isEditable}
              value={billing.city}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              disabled={!isEditable}
              value={billing.zipCode}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              disabled={!isEditable}
              value={billing.country}
              onChange={handleChange}
              sx={commonTextFieldStyles}
            />
          </Grid>
        </Grid>
      </Stack>

      {/* Invoice History Section */}
      <Stack
        spacing={3}
        className="invoice-history-section"
        sx={{ p: 4 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptLongIcon sx={{ color: "#410075" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#000" }}>
            Invoice History
          </Typography>
        </Stack>

        <Stack className="invoice-list" spacing={2}>
          {invoiceHistory.map((invoice) => (
            <Stack
              key={invoice.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className="invoice-item"
              sx={{ p: 2 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box className="icon-box" sx={{ p: 1.5 }}>
                  <ReceiptLongIcon fontSize="small" />
                </Box>
                <Stack>
                  <Typography className="id">{invoice.id}</Typography>
                  <Typography className="date">{invoice.date}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={4} alignItems="center">
                <Typography className="amount">{invoice.amount}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" className="status">
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{invoice.status}</Typography>
                </Stack>
                <Button variant="text" className="btn-download">
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
