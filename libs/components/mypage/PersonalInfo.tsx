import React, { useState } from "react";
import { MOCK_AGENT_PROFILE } from "@/libs/data/userProfile";
import {
  Stack,
  Typography,
  TextField,
  Avatar,
  Box,
  IconButton,
  Grid,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";
import PetsIcon from "@mui/icons-material/Pets";
import TranslateIcon from "@mui/icons-material/Translate";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface PersonalInfoProps {
  isEditable: boolean;
  cancelTrigger?: number;
}

const SERVICE_TYPE_OPTIONS = [
  "Grooming",
  "Training",
  "Walking",
  "Boarding",
  "Day-care",
  "Health",
];

const SERVICE_AREA_OPTIONS = [
  "Seoul",
  "Busan",
  "Incheon",
  "Daegu",
  "Suwon",
  "Gyeongju",
  "Gwangju",
  "Chonju",
  "Daejon",
  "Jeju",
];

const toArray = (val?: string) =>
  val
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

// Toggle between MOCK_PERSONAL_INFO and MOCK_AGENT_PROFILE to test both member types
const ACTIVE_MOCK = MOCK_AGENT_PROFILE;

const PersonalInfo = ({ isEditable, cancelTrigger }: PersonalInfoProps) => {
  const [originalProfile, setOriginalProfile] = useState(ACTIVE_MOCK);
  const [profile, setProfile] = useState(originalProfile);
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);

  const agentProfile = profile as typeof MOCK_AGENT_PROFILE;
  const isAgent = profile.memberType === "Agent";

  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    toArray((ACTIVE_MOCK as typeof MOCK_AGENT_PROFILE).serviceType),
  );
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>(
    toArray((ACTIVE_MOCK as typeof MOCK_AGENT_PROFILE).serviceArea),
  );

  React.useEffect(() => {
    if (isEditable) {
      setOriginalProfile(profile);
    }
  }, [isEditable]);

  React.useEffect(() => {
    if (cancelTrigger && cancelTrigger > 0) {
      setProfile(originalProfile);
      setUsernameStatus(null);
      setSelectedServiceTypes(
        toArray((originalProfile as typeof MOCK_AGENT_PROFILE).serviceType),
      );
      setSelectedServiceAreas(
        toArray((originalProfile as typeof MOCK_AGENT_PROFILE).serviceArea),
      );
    }
  }, [cancelTrigger]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "username") setUsernameStatus(null);
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceTypeChange = (values: string[]) => {
    setSelectedServiceTypes(values);
    setProfile((prev) => ({ ...prev, serviceType: values.join(", ") }));
  };

  const handleServiceAreaChange = (values: string[]) => {
    setSelectedServiceAreas(values);
    setProfile((prev) => ({ ...prev, serviceArea: values.join(", ") }));
  };

  const checkUsername = () => {
    if (!profile.username || profile.username.trim() === "") return;
    setUsernameStatus("checking");
    setTimeout(() => {
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

  const handleCertImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const certs = [...(profile.certifications ?? [])];
      certs[index] = { ...certs[index], image: ev.target?.result as string };
      setProfile((prev) => ({ ...prev, certifications: certs }));
    };
    reader.readAsDataURL(file);
  };

  const removeCertification = (index: number) => {
    const certs = (profile.certifications ?? []).filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, certifications: certs }));
  };

  const addCertification = () => {
    const certs = [...(profile.certifications ?? []), { title: "", image: "" }];
    setProfile((prev) => ({ ...prev, certifications: certs }));
  };

  const fieldBorderStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEditable ? "#410075" : "rgba(0, 0, 0, 0.05)",
      },
    },
  };

  const selectBorderStyles = {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isEditable ? "#410075" : "rgba(0, 0, 0, 0.05)",
    },
  };

  const FieldLabel = ({
    icon,
    label,
  }: {
    icon: React.ReactNode;
    label: string;
  }) => (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      className="field-label-wrapper"
    >
      {icon}
      <Typography className="field-label">{label}</Typography>
    </Stack>
  );

  const MultiSelectField = ({
    options,
    selected,
    onChange,
  }: {
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
  }) =>
    isEditable ? (
      <FormControl fullWidth>
        <Select
          multiple
          displayEmpty
          value={selected}
          onChange={(e) => onChange(e.target.value as string[])}
          input={<OutlinedInput />}
          sx={selectBorderStyles}
          renderValue={(sel) =>
            sel.length === 0 ? (
              <Typography className="multi-select-placeholder">
                Select options...
              </Typography>
            ) : (
              <Typography className="multi-select-value">{sel.join(", ")}</Typography>
            )
          }
          MenuProps={{ PaperProps: { className: "multi-select-menu" } }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} className="multi-select-item">
              <Checkbox
                checked={selected.includes(option)}
                className="multi-select-checkbox"
              />
              <Typography>{option}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <TextField
        fullWidth
        disabled
        value={selected.join(", ") || "—"}
        sx={fieldBorderStyles}
      />
    );

  return (
    <Stack spacing={4} className="personal-info-wrapper">
      {/* Profile Header */}
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        className="profile-header-card"
      >
        <Box className="avatar-box">
          {isEditable ? (
            <label className="avatar-upload-label">
              <Avatar src={profile.image}>
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <input hidden accept="image/*" type="file" />
              <Box className="upload-btn-wrapper">
                <IconButton component="span" className="upload-btn">
                  <PhotoCameraIcon />
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
            <Typography variant="h5" className="profile-name">
              {profile.fullName}
            </Typography>
            <Box className="verified-badge">
              <Typography>✓ Verified</Typography>
            </Box>
            {isAgent && (
              <Chip label="Agent" size="small" className="agent-chip" />
            )}
          </Stack>
          {isAgent && agentProfile.role && (
            <Typography className="agent-role">{agentProfile.role}</Typography>
          )}
          <Typography className="member-since">Member Since 2026</Typography>
          <Typography className="profile-bio">{profile.bio}</Typography>
        </Stack>
      </Stack>

      {/* Personal Information */}
      <Stack
        spacing={3}
        className={`info-form-card ${isEditable ? "editable" : ""}`}
      >
        <Typography variant="h6" className="section-title">
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel icon={<BadgeIcon />} label="Full Name" />
              <TextField
                fullWidth
                name="fullName"
                disabled={!isEditable}
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel icon={<PersonIcon />} label="Username" />
              <Box className="username-field-wrapper">
                <TextField
                  fullWidth
                  name="username"
                  disabled={!isEditable}
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  sx={fieldBorderStyles}
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
              <FieldLabel icon={<EmailIcon />} label="Email Address" />
              <TextField
                fullWidth
                name="email"
                disabled={!isEditable}
                value={profile.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel icon={<PhoneIcon />} label="Phone Number" />
              <TextField
                fullWidth
                name="phone"
                disabled={!isEditable}
                value={profile.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<LocationOnIcon />}
                label="Delivery Address (배송지)"
              />
              <TextField
                fullWidth
                name="address"
                disabled={!isEditable}
                value={profile.address}
                onChange={handleChange}
                placeholder="Seoul, Gangnam-gu..."
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography className="field-label">Bio</Typography>
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
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      {/* Agent-only sections */}
      {isAgent && (
        <>
          {/* Professional Information */}
          <Stack
            spacing={3}
            className={`info-form-card ${isEditable ? "editable" : ""}`}
          >
            <Typography variant="h6" className="section-title">
              Professional Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<WorkIcon />} label="Role / Specialty" />
                  <TextField
                    fullWidth
                    name="role"
                    disabled={!isEditable}
                    value={agentProfile.role ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. Pet Groomer • Skin Care Specialist"
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<PetsIcon />} label="Service Type" />
                  <MultiSelectField
                    options={SERVICE_TYPE_OPTIONS}
                    selected={selectedServiceTypes}
                    onChange={handleServiceTypeChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<EmojiEventsIcon />} label="Experience" />
                  <TextField
                    fullWidth
                    name="experience"
                    disabled={!isEditable}
                    value={agentProfile.experience ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. 6+ years experience"
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<FavoriteIcon />} label="Approach" />
                  <TextField
                    fullWidth
                    name="approach"
                    disabled={!isEditable}
                    value={agentProfile.approach ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. Gentle, patient, positive reinforcement"
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          {/* Service Details */}
          <Stack
            spacing={3}
            className={`info-form-card ${isEditable ? "editable" : ""}`}
          >
            <Typography variant="h6" className="section-title">
              Service Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<TranslateIcon />} label="Languages" />
                  <TextField
                    fullWidth
                    name="languages"
                    disabled={!isEditable}
                    value={agentProfile.languages ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. Korean, English"
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<LocationOnIcon />} label="Service Area" />
                  <MultiSelectField
                    options={SERVICE_AREA_OPTIONS}
                    selected={selectedServiceAreas}
                    onChange={handleServiceAreaChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel icon={<ScheduleIcon />} label="Response Time" />
                  <TextField
                    fullWidth
                    name="responseTime"
                    disabled={!isEditable}
                    value={agentProfile.responseTime ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. Usually replies within 10 minutes"
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          {/* Certifications */}
          <Stack
            spacing={3}
            className={`info-form-card ${isEditable ? "editable" : ""}`}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <WorkspacePremiumIcon className="cert-section-icon" />
                <Typography
                  variant="h6"
                  className="section-title cert-section-title"
                >
                  Certifications
                </Typography>
              </Stack>
              {isEditable && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addCertification}
                  className="add-cert-btn"
                >
                  Add Certificate
                </Button>
              )}
            </Stack>

            {agentProfile.certifications?.length === 0 && (
              <Typography className="no-certs-text">
                No certifications added yet.
              </Typography>
            )}

            <Grid container spacing={3}>
              {agentProfile.certifications?.map((cert, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box className={`cert-card ${isEditable ? "editable" : ""}`}>
                    {isEditable ? (
                      <label className="cert-upload-label">
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e) => handleCertImageChange(index, e)}
                        />
                        {cert.image ? (
                          <Box
                            component="img"
                            src={cert.image}
                            alt={cert.title}
                            className="cert-image"
                          />
                        ) : (
                          <Box className="cert-placeholder">
                            <WorkspacePremiumIcon />
                          </Box>
                        )}
                        <Box className="cert-upload-overlay">
                          <Stack alignItems="center" spacing={0.5}>
                            <PhotoCameraIcon />
                            <Typography className="cert-upload-text">
                              Upload Image
                            </Typography>
                          </Stack>
                        </Box>
                      </label>
                    ) : cert.image ? (
                      <Box
                        component="img"
                        src={cert.image}
                        alt={cert.title}
                        className="cert-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Box className="cert-placeholder">
                        <WorkspacePremiumIcon />
                      </Box>
                    )}
                    {isEditable && (
                      <IconButton
                        size="small"
                        onClick={() => removeCertification(index)}
                        className="cert-delete-btn"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default PersonalInfo;
