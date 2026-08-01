import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_MEMBER } from "@/apollo/user/query";
import { IMAGES_UPLOADER, UPDATE_MEMBER } from "@/apollo/user/mutation";
import { updateStorage, updateUserInfo } from "@/libs/auth";
import { Member } from "@/libs/types/member/member";
import { MemberUpdate } from "@/libs/types/member/member.update";
import { MemberType } from "@/libs/enums/member.enum";
import { ServiceLocation, ServiceType } from "@/libs/enums/service.enum";
import { REACT_APP_API_URL } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

interface PersonalInfoProps {
  isEditable: boolean;
  cancelTrigger?: number;
  saveTrigger?: number;
  onSaveComplete?: (succeeded: boolean) => void;
}

interface CertificateSlot {
  path?: string;
  file?: File;
  preview: string;
}

interface ProfileForm {
  memberFullName: string;
  memberUserName: string;
  memberEmail: string;
  memberPhone: string;
  memberAddress: string;
  memberDesc: string;
  memberSpecialty: string;
  memberExperience: string;
  memberApproach: string;
  memberLanguages: string;
  memberResponseTime: string;
  memberServiceTypes: string[];
  memberServiceArea: string[];
}

const SERVICE_TYPE_OPTIONS = Object.values(ServiceType);
const SERVICE_AREA_OPTIONS = Object.values(ServiceLocation);

const prettifyEnum = (value?: string) =>
  (value ?? "")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const emptyForm: ProfileForm = {
  memberFullName: "",
  memberUserName: "",
  memberEmail: "",
  memberPhone: "",
  memberAddress: "",
  memberDesc: "",
  memberSpecialty: "",
  memberExperience: "",
  memberApproach: "",
  memberLanguages: "",
  memberResponseTime: "",
  memberServiceTypes: [],
  memberServiceArea: [],
};

const toForm = (member?: Member): ProfileForm => ({
  memberFullName: member?.memberFullName ?? "",
  memberUserName: member?.memberUserName ?? "",
  memberEmail: member?.memberEmail ?? "",
  memberPhone: member?.memberPhone ?? "",
  memberAddress: member?.memberAddress ?? "",
  memberDesc: member?.memberDesc ?? "",
  memberSpecialty: member?.memberSpecialty ?? "",
  // Seeded as "0" for members who never filled it in.
  memberExperience:
    member?.memberExperience && member.memberExperience !== "0"
      ? member.memberExperience
      : "",
  memberApproach: member?.memberApproach ?? "",
  memberLanguages: member?.memberLanguages ?? "",
  memberResponseTime: member?.memberResponseTime ?? "",
  memberServiceTypes: (member?.memberServiceTypes ?? []).filter(Boolean),
  memberServiceArea: (member?.memberServiceArea ?? []).filter(Boolean),
});

const imageSrc = (path?: string) =>
  path ? `${REACT_APP_API_URL}/${path}` : "";

const PersonalInfo = ({
  isEditable,
  cancelTrigger,
  saveTrigger,
  onSaveComplete,
}: PersonalInfoProps) => {
  const { t } = useTranslation();
  const user = useReactiveVar(userVar);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [certificates, setCertificates] = useState<CertificateSlot[]>([]);
  const [avatar, setAvatar] = useState<{ file: File; preview: string } | null>(
    null,
  );
  // Guards against the save effect firing on mount, when saveTrigger is 0.
  const lastSaveTrigger = useRef(saveTrigger ?? 0);

  /** APOLLO REQUESTS **/

  const { data: getMemberData, refetch: getMemberRefetch } = useQuery(
    GET_MEMBER,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: user?._id },
      skip: !user?._id,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [updateMember] = useMutation(UPDATE_MEMBER);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const member: Member | undefined = getMemberData?.getMember;
  const isAgent = member?.memberType === MemberType.AGENT;
  const memberSince = member?.createdAt
    ? new Date(member.createdAt).getFullYear()
    : "";
  const avatarPreview =
    avatar?.preview || imageSrc(member?.memberImage) || undefined;
  const initials = useMemo(
    () =>
      (form.memberFullName || form.memberUserName)
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [form.memberFullName, form.memberUserName],
  );

  /** LIFECYCLES **/

  const applyMember = (source?: Member) => {
    setForm(toForm(source));
    setCertificates(
      (source?.memberCertificates ?? [])
        .filter(Boolean)
        .map((path) => ({ path, preview: imageSrc(path) })),
    );
    setAvatar(null);
  };

  useEffect(() => {
    if (!isEditable) applyMember(member);
  }, [member]);

  useEffect(() => {
    if (cancelTrigger && cancelTrigger > 0) applyMember(member);
  }, [cancelTrigger]);

  useEffect(() => {
    if (!saveTrigger || saveTrigger === lastSaveTrigger.current) return;
    lastSaveTrigger.current = saveTrigger;
    void handleSave();
  }, [saveTrigger]);

  /** HANDLERS **/

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "memberExperience"
          ? value.replace(/\D/g, "").slice(0, 2)
          : value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setForm((prev) => ({ ...prev, memberPhone: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatar) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleCertImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertificates((prev) =>
      prev.map((cert, i) =>
        i === index ? { file, preview: URL.createObjectURL(file) } : cert,
      ),
    );
    e.target.value = "";
  };

  const removeCertification = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    setCertificates((prev) => [...prev, { preview: "" }]);
  };

  const handleSave = async () => {
    try {
      if (!user?._id) throw new Error(t("mypage.personal.loginFirst"));

      let memberImage = member?.memberImage;
      if (avatar) {
        const { data } = await imagesUploader({
          variables: { files: [avatar.file], target: "member" },
        });
        const uploaded = (data?.imagesUploader ?? []).filter(Boolean)[0];
        if (!uploaded) throw new Error(t("mypage.personal.imageFailed"));
        memberImage = uploaded;
      }

      const pendingCerts = certificates.filter((cert) => cert.file);
      let uploadedCerts: string[] = [];
      if (pendingCerts.length) {
        const { data } = await imagesUploader({
          variables: {
            files: pendingCerts.map((cert) => cert.file),
            target: "certificate",
          },
        });
        uploadedCerts = (data?.imagesUploader ?? []).filter(Boolean);
        if (uploadedCerts.length !== pendingCerts.length) {
          throw new Error(t("mypage.personal.certFailed"));
        }
      }

      let nextUpload = 0;
      const memberCertificates = certificates
        .map((cert) => (cert.file ? uploadedCerts[nextUpload++] : cert.path))
        .filter(Boolean) as string[];

      const input: MemberUpdate = {
        _id: user._id,
        memberFullName: form.memberFullName.trim(),
        memberUserName: form.memberUserName.trim(),
        memberEmail: form.memberEmail.trim(),
        memberPhone: form.memberPhone.trim(),
        memberAddress: form.memberAddress.trim(),
        memberDesc: form.memberDesc.trim(),
        memberImage,
      };

      if (isAgent) {
        input.memberSpecialty = form.memberSpecialty.trim();
        input.memberExperience = form.memberExperience.trim();
        input.memberApproach = form.memberApproach.trim();
        input.memberLanguages = form.memberLanguages.trim();
        input.memberResponseTime = form.memberResponseTime.trim();
        input.memberServiceTypes = form.memberServiceTypes;
        input.memberServiceArea = form.memberServiceArea;
        input.memberCertificates = memberCertificates;
      }

      const { data } = await updateMember({ variables: { input } });

      const accessToken = data?.updateMember?.accessToken;
      if (accessToken) {
        updateStorage({ jwtToken: accessToken });
        updateUserInfo(accessToken);
      }

      const { data: refetched } = await getMemberRefetch({ input: user._id });
      applyMember(refetched?.getMember);

      await sweetBottomSmallSuccessAlert(t("mypage.personal.updated"), 900);
      onSaveComplete?.(true);
    } catch (err: any) {
      console.log("ERROR, handleSave:", err.message);
      await sweetMixinErrorAlert(err.message);
      onSaveComplete?.(false);
    }
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
                {t("mypage.personal.selectOptions")}
              </Typography>
            ) : (
              <Typography className="multi-select-value">
                {sel.map(prettifyEnum).join(", ")}
              </Typography>
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
              <Typography>{prettifyEnum(option)}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <TextField
        fullWidth
        disabled
        value={selected.map(prettifyEnum).join(", ") || "—"}
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
              <Avatar src={avatarPreview}>{initials}</Avatar>
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarChange}
              />
              <Box className="upload-btn-wrapper">
                <IconButton component="span" className="upload-btn">
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
            </label>
          ) : (
            <Avatar src={avatarPreview}>{initials}</Avatar>
          )}
        </Box>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" className="profile-name">
              {form.memberFullName || form.memberUserName}
            </Typography>
            {member?.memberStatus === "ACTIVE" && (
              <Box className="verified-badge">
                <Typography>✓ Verified</Typography>
              </Box>
            )}
            {isAgent && (
              <Chip
                label={t("mypage.personal.agent")}
                size="small"
                className="agent-chip"
              />
            )}
          </Stack>
          {isAgent && form.memberSpecialty && (
            <Typography className="agent-role">
              {form.memberSpecialty}
            </Typography>
          )}
          {memberSince && (
            <Typography className="member-since">
              Member Since {memberSince}
            </Typography>
          )}
          <Typography className="profile-bio">{form.memberDesc}</Typography>
        </Stack>
      </Stack>

      {/* Personal Information */}
      <Stack
        spacing={3}
        className={`info-form-card ${isEditable ? "editable" : ""}`}
      >
        <Typography variant="h6" className="section-title">
          {t("mypage.personal.sectionPersonal")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<BadgeIcon />}
                label={t("mypage.personal.fullName")}
              />
              <TextField
                fullWidth
                name="memberFullName"
                disabled={!isEditable}
                value={form.memberFullName}
                onChange={handleChange}
                placeholder={t("mypage.personal.phFullName")}
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<PersonIcon />}
                label={t("mypage.personal.username")}
              />
              <Box className="username-field-wrapper">
                <TextField
                  fullWidth
                  name="memberUserName"
                  disabled={!isEditable}
                  value={form.memberUserName}
                  onChange={handleChange}
                  placeholder={t("mypage.personal.phUsername")}
                  sx={fieldBorderStyles}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<EmailIcon />}
                label={t("mypage.personal.email")}
              />
              <TextField
                fullWidth
                name="memberEmail"
                disabled={!isEditable}
                value={form.memberEmail}
                onChange={handleChange}
                placeholder={t("mypage.personal.phEmail")}
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<PhoneIcon />}
                label={t("mypage.personal.phone")}
              />
              <TextField
                fullWidth
                name="memberPhone"
                disabled={!isEditable}
                value={form.memberPhone}
                onChange={handlePhoneChange}
                placeholder={t("mypage.personal.phPhone")}
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <FieldLabel
                icon={<LocationOnIcon />}
                label={t("mypage.personal.deliveryAddress")}
              />
              <TextField
                fullWidth
                name="memberAddress"
                disabled={!isEditable}
                value={form.memberAddress}
                onChange={handleChange}
                placeholder={t("mypage.personal.phAddress")}
                sx={fieldBorderStyles}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography className="field-label">
                {t("mypage.personal.bio")}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="memberDesc"
                variant="outlined"
                disabled={!isEditable}
                value={form.memberDesc}
                onChange={handleChange}
                placeholder={t("mypage.personal.phBio")}
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
              {t("mypage.personal.sectionProfessional")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<WorkIcon />}
                    label={t("mypage.personal.role")}
                  />
                  <TextField
                    fullWidth
                    name="memberSpecialty"
                    disabled={!isEditable}
                    value={form.memberSpecialty}
                    onChange={handleChange}
                    placeholder={t("mypage.personal.phRole")}
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<PetsIcon />}
                    label={t("mypage.personal.serviceType")}
                  />
                  <MultiSelectField
                    options={SERVICE_TYPE_OPTIONS}
                    selected={form.memberServiceTypes}
                    onChange={(values) =>
                      setForm((prev) => ({
                        ...prev,
                        memberServiceTypes: values,
                      }))
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<EmojiEventsIcon />}
                    label={t("mypage.personal.experience")}
                  />
                  <TextField
                    fullWidth
                    name="memberExperience"
                    disabled={!isEditable}
                    value={form.memberExperience}
                    onChange={handleChange}
                    placeholder={t("mypage.personal.phExperience")}
                    inputProps={{ inputMode: "numeric" }}
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<FavoriteIcon />}
                    label={t("mypage.personal.approach")}
                  />
                  <TextField
                    fullWidth
                    name="memberApproach"
                    disabled={!isEditable}
                    value={form.memberApproach}
                    onChange={handleChange}
                    placeholder={t("mypage.personal.phApproach")}
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
              {t("mypage.personal.sectionService")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<TranslateIcon />}
                    label={t("mypage.personal.languages")}
                  />
                  <TextField
                    fullWidth
                    name="memberLanguages"
                    disabled={!isEditable}
                    value={form.memberLanguages}
                    onChange={handleChange}
                    placeholder={t("mypage.personal.phLanguages")}
                    sx={fieldBorderStyles}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<LocationOnIcon />}
                    label={t("mypage.personal.serviceArea")}
                  />
                  <MultiSelectField
                    options={SERVICE_AREA_OPTIONS}
                    selected={form.memberServiceArea}
                    onChange={(values) =>
                      setForm((prev) => ({
                        ...prev,
                        memberServiceArea: values,
                      }))
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FieldLabel
                    icon={<ScheduleIcon />}
                    label={t("mypage.personal.responseTime")}
                  />
                  <TextField
                    fullWidth
                    name="memberResponseTime"
                    disabled={!isEditable}
                    value={form.memberResponseTime}
                    onChange={handleChange}
                    placeholder={t("mypage.personal.phResponse")}
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
                  {t("mypage.personal.certifications")}
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
                  {t("mypage.personal.addCertificate")}
                </Button>
              )}
            </Stack>

            {certificates.length === 0 && (
              <Typography className="no-certs-text">
                {t("mypage.personal.noCertifications")}
              </Typography>
            )}

            <Grid container spacing={3}>
              {certificates.map((cert, index) => (
                <Grid item xs={12} sm={6} md={4} key={cert.path ?? index}>
                  <Box className={`cert-card ${isEditable ? "editable" : ""}`}>
                    {isEditable ? (
                      <label className="cert-upload-label">
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e) => handleCertImageChange(index, e)}
                        />
                        {cert.preview ? (
                          <Box
                            component="img"
                            src={cert.preview}
                            alt="certificate"
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
                              {t("mypage.personal.uploadImage")}
                            </Typography>
                          </Stack>
                        </Box>
                      </label>
                    ) : cert.preview ? (
                      <Box
                        component="img"
                        src={cert.preview}
                        alt="certificate"
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
