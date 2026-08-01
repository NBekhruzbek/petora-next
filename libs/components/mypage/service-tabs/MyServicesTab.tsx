import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_ALL_SERVICES } from "@/apollo/user/query";
import {
  CREATE_SERVICE,
  IMAGES_UPLOADER,
  UPDATE_SERVICE,
} from "@/apollo/user/mutation";
import EmptyState from "../../common/EmptyState";
import { Service } from "@/libs/types/service/service";
import { ServicesInquiry } from "@/libs/types/service/service.input";
import {
  ServiceLocation,
  ServiceStatus,
  ServiceType,
} from "@/libs/enums/service.enum";
import { Direction, Message } from "@/libs/enums/common.enum";
import { REACT_APP_API_URL } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

const SERVICES_LIMIT = 20;
const MAX_IMAGES = 4;

const SERVICE_TYPES = Object.values(ServiceType);
const SERVICE_LOCATIONS = Object.values(ServiceLocation);

const OWNED_STATUSES = [
  ServiceStatus.ACTIVE,
  ServiceStatus.PAUSE,
  ServiceStatus.DELETE,
];

interface ServiceForm {
  serviceTitle: string;
  serviceDescription: string;
  serviceType: string;
  serviceLocation: string;
  serviceDurationMinutes: string;
  servicePrice: string;
}

interface ImageSlot {
  path?: string;
  file?: File;
  preview: string;
  name: string;
}

const emptyForm: ServiceForm = {
  serviceTitle: "",
  serviceDescription: "",
  serviceType: ServiceType.GROOMING,
  serviceLocation: ServiceLocation.SEOUL,
  serviceDurationMinutes: "",
  servicePrice: "",
};

const withThousands = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const formatDuration = (minutes: number) => {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? `${hours} h ${rest} min`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
};

// The row styling keys off the lowercase legacy status names.
const statusClass: Record<string, string> = {
  [ServiceStatus.ACTIVE]: "active",
  [ServiceStatus.PAUSE]: "paused",
  [ServiceStatus.DELETE]: "deleted",
};

const MyServicesTab = () => {
  const { t } = useTranslation();
  const user = useReactiveVar(userVar);
  const [category, setCategory] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ServiceForm>(emptyForm);
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [imageError, setImageError] = useState("");

  /** APOLLO REQUESTS **/

  const searchFilter: ServicesInquiry = {
    page: 1,
    limit: SERVICES_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      onlyLiked: false,
      memberId: user?._id,
      serviceStatus: OWNED_STATUSES,
      ...(category === "ALL" ? {} : { serviceType: [category as ServiceType] }),
    },
  };

  const {
    data: getAllServicesData,
    refetch: getAllServicesRefetch,
    error: getAllServicesError,
  } = useQuery(GET_ALL_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  // The API throws "No data found!" instead of returning an empty list.
  const isEmpty = Boolean(
    getAllServicesError?.graphQLErrors?.some(
      (e) => e.message === Message.NO_DATA_FOUND,
    ),
  );
  const services: Service[] = isEmpty
    ? []
    : (getAllServicesData?.getAllServices?.list ?? []);

  /** HANDLERS **/

  // getAllServices rejects with "No data found!" once the catalogue is empty,
  // so a refetch that empties the list must not read as a failed action — the
  // hook's error state already renders the empty view.
  const refreshServices = async () => {
    try {
      await getAllServicesRefetch({ input: searchFilter });
    } catch {
      /* handled through getAllServicesError */
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setImages([]);
    setImageError("");
    setShowAddModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      serviceTitle: service.serviceTitle,
      serviceDescription: service.serviceDescription,
      serviceType: service.serviceType,
      serviceLocation: service.serviceLocation,
      serviceDurationMinutes: String(service.serviceDurationMinutes ?? ""),
      servicePrice: withThousands(String(service.servicePrice ?? "")),
    });
    setImages(
      (service.serviceImages ?? []).filter(Boolean).map((path) => ({
        path,
        preview: `${REACT_APP_API_URL}/${path}`,
        name: path.split("/").pop() ?? "image",
      })),
    );
    setImageError("");
    setShowAddModal(true);
  };

  const updateServiceStatus = async (
    service: Service,
    serviceStatus: ServiceStatus,
  ) => {
    if (service.serviceStatus === serviceStatus) return;
    try {
      await updateService({
        variables: { input: { serviceId: service._id, serviceStatus } },
      });
      await refreshServices();
      await sweetBottomSmallSuccessAlert("Service updated!", 700);
    } catch (err: any) {
      console.log("ERROR, updateServiceStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "servicePrice"
          ? withThousands(value)
          : name === "serviceDurationMinutes"
            ? value.replace(/\D/g, "")
            : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES) {
      setImageError(`Maximum ${MAX_IMAGES} images allowed`);
      e.target.value = "";
      return;
    }

    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);
    // Reset the input so re-picking the same file still fires a change.
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setFormData(emptyForm);
    setImages([]);
    setImageError("");
  };

  const handlePublish = async () => {
    if (isSubmitting) return;

    const price = Number(formData.servicePrice.replace(/,/g, ""));
    const duration = Number(formData.serviceDurationMinutes);

    try {
      if (!formData.serviceTitle.trim())
        throw new Error(t("mypage.services.errTitle"));
      if (!formData.serviceDescription.trim())
        throw new Error(t("mypage.services.errDescription"));
      if (!duration) throw new Error(t("mypage.services.errDuration"));
      if (!price) throw new Error(t("mypage.services.errPrice"));
      if (!images.length) throw new Error(t("mypage.services.errImages"));

      setIsSubmitting(true);

      // Only newly picked files need uploading; already saved paths are reused.
      const pending = images.filter((image) => image.file);
      let uploaded: string[] = [];
      if (pending.length) {
        const { data } = await imagesUploader({
          variables: {
            files: pending.map((image) => image.file),
            target: "service",
          },
        });
        uploaded = (data?.imagesUploader ?? []).filter(Boolean);
        if (uploaded.length !== pending.length) {
          throw new Error(t("mypage.services.errUpload"));
        }
      }

      let nextUpload = 0;
      const serviceImages = images
        .map((image) => (image.file ? uploaded[nextUpload++] : image.path))
        .filter(Boolean) as string[];

      const payload = {
        serviceTitle: formData.serviceTitle.trim(),
        serviceDescription: formData.serviceDescription.trim(),
        serviceType: formData.serviceType,
        serviceLocation: formData.serviceLocation,
        serviceDurationMinutes: duration,
        servicePrice: price,
        serviceImages,
      };

      if (editingService) {
        // No serviceStatus here — editing a paused offer must not silently
        // republish it.
        await updateService({
          variables: { input: { serviceId: editingService._id, ...payload } },
        });
      } else {
        // The Service schema defaults new rows to PAUSE, which would leave a
        // just-"published" offer invisible on the public Service page until the
        // agent flipped it on. Publish means live.
        await createService({
          variables: {
            input: { ...payload, serviceStatus: ServiceStatus.ACTIVE },
          },
        });
      }

      await refreshServices();
      resetModal();
      await sweetBottomSmallSuccessAlert(
        editingService ? "Service updated!" : "Service published!",
        900,
      );
    } catch (err: any) {
      console.log("ERROR, handlePublish:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={3} className="my-services-tab">
      {/* Toolbar */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        className="services-toolbar"
        flexWrap="wrap"
      >
        <TextField
          select
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
          sx={{ width: 220, maxWidth: 220 }}
          SelectProps={{
            MenuProps: {
              className: "custom-filter-menu",
              sx: {
                "& .MuiMenuItem-root": {
                  color: "#000 !important",
                },
              },
            },
          }}
        >
          <MenuItem value="ALL" sx={{ color: "#000 !important" }}>
            All
          </MenuItem>
          {SERVICE_TYPES.map((type) => (
            <MenuItem key={type} value={type} sx={{ color: "#000 !important" }}>
              {t(`enums.serviceType.${type}`)}
            </MenuItem>
          ))}
        </TextField>
        <Box flex={1} />
        <Button
          variant="contained"
          className="btn-add-service"
          onClick={openAddModal}
        >
          {t("mypage.services.addNew")}
        </Button>
      </Stack>

      {/* Services List */}
      <Stack spacing={1.5} className="services-list">
        {services.length === 0 &&
          (category === "ALL" ? (
            <EmptyState
              icon={<StorefrontOutlinedIcon />}
              title={t("mypage.services.noneTitle")}
              description={t("mypage.services.noneDesc")}
              action={{
                label: t("mypage.services.addNewAction"),
                onClick: openAddModal,
              }}
            />
          ) : (
            <EmptyState
              icon={<FilterAltOffOutlinedIcon />}
              title={t("mypage.services.emptyCategoryTitle")}
              description={t("mypage.services.emptyCategoryDesc")}
              action={{
                label: t("mypage.services.addNewAction"),
                onClick: openAddModal,
              }}
            />
          ))}

        {services.map((service) => {
          const serviceStatus = statusClass[service.serviceStatus] ?? "active";

          return (
            <Stack
              key={service._id}
              direction="row"
              alignItems="center"
              className={`service-row ${serviceStatus}`}
            >
              <Box className="service-row-media">
                <Box
                  component="img"
                  src={
                    service.serviceImages?.[0]
                      ? `${REACT_APP_API_URL}/${service.serviceImages[0]}`
                      : "/img/services/grooming.jpg"
                  }
                  alt={service.serviceTitle}
                  className="thumb-img"
                />
              </Box>

              <Stack className="service-row-main" spacing={0.75}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                  className="service-row-title-line"
                >
                  <Typography className="agent-name">
                    {service.serviceTitle}
                  </Typography>
                  <Box className={`service-status ${serviceStatus}`}>
                    {serviceStatus}
                  </Box>
                </Stack>
                <Typography className="service-description">
                  {service.serviceDescription}
                </Typography>
                <Typography className="agent-service-type">
                  {t(`enums.serviceType.${service.serviceType}`)} ·{" "}
                  {formatDuration(service.serviceDurationMinutes)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                className="service-row-metrics"
              >
                <Stack className="metric-block">
                  <Typography className="metric-label">
                    {t("mypage.services.price")}
                  </Typography>
                  <Typography className="service-price">
                    ₩{service.servicePrice?.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack className="metric-block">
                  <Typography className="metric-label">
                    {t("mypage.services.rating")}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    className="rating-row"
                  >
                    <Rating
                      value={service.serviceRating ?? 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography className="rating-value">
                      {(service.serviceRating ?? 0).toFixed(1)}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack className="metric-block">
                  <Typography className="metric-label">
                    {t("mypage.services.bookings")}
                  </Typography>
                  <Typography className="bookings-row">
                    {service.serviceBookings ?? 0}
                  </Typography>
                </Stack>
              </Stack>

              <Stack className="service-row-actions" spacing={1}>
                <Button
                  className="service-action-tab edit"
                  onClick={() => openEditModal(service)}
                >
                  {t("mypage.services.edit")}
                </Button>
                <Stack direction="row" className="service-status-tabs">
                  {OWNED_STATUSES.map((status) => (
                    <Button
                      key={status}
                      className={`status-tab ${statusClass[status]} ${
                        service.serviceStatus === status ? "selected" : ""
                      }`}
                      onClick={() => void updateServiceStatus(service, status)}
                    >
                      {status === ServiceStatus.PAUSE
                        ? "Pause"
                        : statusClass[status]}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      {/* Add New Service Modal */}
      <Dialog
        className="qna-dialog add-service-dialog"
        open={showAddModal}
        onClose={resetModal}
        fullWidth
        maxWidth="md"
        disableScrollLock
        transitionDuration={{ enter: 320, exit: 220 }}
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <DialogTitle className="add-dialog-title">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box className="add-dialog-icon">
                <PetsIcon />
              </Box>
              <Stack spacing={0.25}>
                <span>
                  {editingService
                    ? t("mypage.services.editTitle")
                    : t("mypage.services.createTitle")}
                </span>
                <Typography className="add-dialog-subtitle">
                  {editingService
                    ? t("mypage.services.editSubtitle")
                    : t("mypage.services.createSubtitle")}
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              size="small"
              onClick={resetModal}
              className="dialog-close-btn"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent className="add-dialog-content">
          <Stack spacing={3} className="add-service-form">
            <Box className="form-grid">
              <TextField
                fullWidth
                label={t("mypage.services.fTitle")}
                name="serviceTitle"
                value={formData.serviceTitle}
                onChange={handleInputChange}
                placeholder={t("mypage.services.phTitle")}
                variant="outlined"
                className="add-service-field wide"
              />

              <TextField
                select
                fullWidth
                label={t("mypage.services.fType")}
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                variant="outlined"
                className="add-service-field"
                SelectProps={{
                  MenuProps: { className: "add-service-select-menu" },
                }}
              >
                {SERVICE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`enums.serviceType.${type}`)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label={t("mypage.services.fLocation")}
                name="serviceLocation"
                value={formData.serviceLocation}
                onChange={handleInputChange}
                variant="outlined"
                className="add-service-field"
                SelectProps={{
                  MenuProps: { className: "add-service-select-menu" },
                }}
              >
                {SERVICE_LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {t(`enums.serviceLocation.${location}`)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label={t("mypage.services.fDuration")}
                name="serviceDurationMinutes"
                value={formData.serviceDurationMinutes}
                onChange={handleInputChange}
                placeholder={t("mypage.services.phDuration")}
                variant="outlined"
                className="add-service-field"
                inputProps={{ inputMode: "numeric" }}
              />

              <TextField
                fullWidth
                label={t("mypage.services.fPrice")}
                name="servicePrice"
                type="text"
                value={formData.servicePrice}
                onChange={handleInputChange}
                placeholder={t("mypage.services.phPrice")}
                variant="outlined"
                className="add-service-field price-field"
                inputProps={{
                  inputMode: "numeric",
                }}
                InputProps={{
                  startAdornment: <span className="field-prefix">₩</span>,
                }}
              />

              <TextField
                fullWidth
                label={t("mypage.services.fDescription")}
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleInputChange}
                placeholder={t("mypage.services.phDescription")}
                multiline
                rows={4}
                variant="outlined"
                className="add-service-field description-field wide"
              />
            </Box>

            <Stack spacing={2} className="image-upload-section">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className="image-upload-heading"
              >
                <Typography>{t("mypage.services.images")}</Typography>
                <Chip
                  label={`${images.length}/${MAX_IMAGES} selected`}
                  className="image-count-chip"
                />
              </Stack>

              {imageError && <Alert severity="error">{imageError}</Alert>}

              <Box
                className={`upload-dropzone ${
                  images.length >= MAX_IMAGES ? "disabled" : ""
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                  disabled={images.length >= MAX_IMAGES}
                />
                <label htmlFor="image-upload">
                  <Box className="upload-icon-wrap">
                    <CloudUploadIcon />
                  </Box>
                  <Stack spacing={0.25} className="upload-copy">
                    <Typography className="upload-title">
                      {t("mypage.services.uploadPhotos")}
                    </Typography>
                    <Typography className="upload-note">
                      {t("mypage.services.uploadHint")}
                    </Typography>
                  </Stack>
                </label>
              </Box>

              {images.length > 0 && (
                <Grid container spacing={1.5} className="image-preview-grid">
                  {images.map((image, index) => (
                    <Grid item xs={6} sm={3} key={`${image.name}-${index}`}>
                      <Box className="image-preview-card">
                        <Box
                          component="img"
                          src={image.preview}
                          alt={image.name}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Typography className="image-file-name">
                          {image.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions className="add-dialog-actions">
          <Button onClick={resetModal} className="btn-dialog-cancel">
            {t("mypage.services.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            className="btn-dialog-publish"
            disabled={isSubmitting}
          >
            {editingService
              ? t("mypage.services.update")
              : t("mypage.services.publish")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MyServicesTab;
