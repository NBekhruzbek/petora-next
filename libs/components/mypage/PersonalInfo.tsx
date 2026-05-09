import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Avatar,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";

const PersonalInfo = ({ isEditable }: { isEditable: boolean }) => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    username: "johndoe",
    email: "john.doe@company.com",
    phone: "010-1234-5678",
    address: "Seoul, Gangnam-gu, Teheran-ro 123",
    bio: "Product designer and entrepreneur passionate about creating meaningful digital experiences.",
    image: "/img/profile/defaultUser.png",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setProfile((prev) => ({ ...prev, phone: value }));
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEditable ? "#410075" : "rgba(0, 0, 0, 0.05)",
      },
    },
  };

  return (
    <Stack spacing={4} className="personal-info-wrapper">
      {/* Profile Header */}
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        className="profile-header-card"
        sx={{ p: 4 }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar src={profile.image}>
            {profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          {isEditable && (
            <IconButton className="upload-btn" component="label">
              <input hidden accept="image/*" type="file" />
              <PhotoCameraIcon sx={{ fontSize: 20, color: "#410075" }} />
            </IconButton>
          )}
        </Box>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#000" }}>
              {profile.fullName}
            </Typography>
            <Box className="verified-badge" sx={{ px: 1, py: 0.2 }}>
              <Typography>✓ Verified</Typography>
            </Box>
          </Stack>
          <Typography sx={{ color: "#4b5563", fontWeight: 500 }}>
            Member Since 2026
          </Typography>
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: 400,
              maxWidth: "500px",
            }}
          >
            {profile.bio}
          </Typography>
        </Stack>
      </Stack>

      {/* Form Section */}
      <Stack
        spacing={3}
        className={`info-form-card ${isEditable ? "editable" : ""}`}
        sx={{ p: 4 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#000", mb: 1 }}>
          Personal Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Full Name
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="fullName"
                disabled={!isEditable}
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Username
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="username"
                disabled={!isEditable}
                value={profile.username}
                onChange={handleChange}
                placeholder="Choose a username"
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Email Address
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="email"
                disabled={!isEditable}
                value={profile.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Phone Number
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="phone"
                disabled={!isEditable}
                value={profile.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
                >
                  Delivery Address (배송지)
                </Typography>
              </Stack>
              <TextField
                fullWidth
                name="address"
                disabled={!isEditable}
                value={profile.address}
                onChange={handleChange}
                placeholder="Seoul, Gangnam-gu..."
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: "#4b5563" }}
              >
                Bio
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="bio"
                variant="outlined"
                disabled={!isEditable}
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                sx={commonTextFieldStyles}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default PersonalInfo;
