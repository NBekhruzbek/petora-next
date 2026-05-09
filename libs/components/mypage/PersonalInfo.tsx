import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Avatar,
  Box,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";

interface PersonalInfoProps {
  isEditable: boolean;
  cancelTrigger?: number;
}

const PersonalInfo = ({ isEditable, cancelTrigger }: PersonalInfoProps) => {
  const [originalProfile, setOriginalProfile] = useState({
    fullName: "John Doe",
    username: "johndoe",
    email: "john.doe@company.com",
    phone: "010-1234-5678",
    address: "Seoul, Gangnam-gu, Teheran-ro 123",
    bio: "Product designer and entrepreneur passionate about creating meaningful digital experiences.",
    image: "/img/profile/defaultUser.png",
  });

  const [profile, setProfile] = useState(originalProfile);
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);

  React.useEffect(() => {
    if (isEditable) {
      setOriginalProfile(profile);
    }
  }, [isEditable]);

  React.useEffect(() => {
    if (cancelTrigger && cancelTrigger > 0) {
      setProfile(originalProfile);
      setUsernameStatus(null);
    }
  }, [cancelTrigger]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsernameStatus(null);
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const checkUsername = () => {
    if (!profile.username || profile.username.trim() === "") return;
    setUsernameStatus("checking");
    // Mock API call
    setTimeout(() => {
      // Just a mock: if it's exactly 'admin' or 'johndoe', say taken
      if (
        profile.username.toLowerCase() === "admin" ||
        profile.username.toLowerCase() === "johndoe"
      ) {
        setUsernameStatus("taken");
      } else {
        setUsernameStatus("available");
      }
    }, 600);
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
        <Box sx={{ position: "relative", display: "inline-block" }}>
          {isEditable ? (
            <label
              style={{
                cursor: "pointer",
                display: "block",
                position: "relative",
              }}
            >
              <Avatar src={profile.image}>
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <input hidden accept="image/*" type="file" />
              <Box className="upload-btn-wrapper">
                <IconButton component="span" className="upload-btn">
                  <PhotoCameraIcon sx={{ fontSize: 20, color: "#4b5563" }} />
                </IconButton>
              </Box>
            </label>
          ) : (
            <Avatar src={profile.image}>
              {profile.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
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
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  name="username"
                  disabled={!isEditable}
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  sx={commonTextFieldStyles}
                  InputProps={{
                    endAdornment: isEditable ? (
                      <Box mr={-0.5}>
                        <Button
                          variant="contained"
                          className="check-username-btn"
                          onClick={checkUsername}
                          disabled={usernameStatus === "checking"}
                        >
                          Check
                        </Button>
                      </Box>
                    ) : null,
                  }}
                />
                {usernameStatus && (
                  <Typography
                    className={`username-status-text ${
                      usernameStatus === "checking"
                        ? "checking"
                        : usernameStatus === "available"
                        ? "available"
                        : "taken"
                    }`}
                  >
                    {usernameStatus === "checking"
                      ? "Checking availability..."
                      : usernameStatus === "available"
                      ? "✓ This username is available"
                      : "✗ Username is already taken"}
                  </Typography>
                )}
              </Box>
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
