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
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CATEGORIES = [
  "All",
  "Grooming",
  "Boarding",
  "Walking",
  "Training",
  "Vet",
  "Hotel",
];
const SORT_OPTIONS = ["Newest", "Popular", "Highest Rated"];

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Premium Dog Grooming",
    category: "Grooming",
    price: "₩45,000",
    duration: "1 hour",
    rating: 4.8,
    bookings: 128,
    status: "active",
    description:
      "Full grooming service including bath, haircut, nail trim, and ear cleaning.",
    tags: ["Dog", "Bath", "Haircut"],
    image: "🐕",
  },
  {
    id: 2,
    name: "Cat Boarding Suite",
    category: "Boarding",
    price: "₩65,000/night",
    duration: "Overnight",
    rating: 4.9,
    bookings: 89,
    status: "active",
    description:
      "Luxury cat boarding with private rooms, webcam monitoring, and playtime.",
    tags: ["Cat", "Luxury", "Overnight"],
    image: "🐈",
  },
  {
    id: 3,
    name: "Daily Dog Walking",
    category: "Walking",
    price: "₩25,000",
    duration: "1 hour",
    rating: 4.7,
    bookings: 256,
    status: "active",
    description:
      "1-hour professional dog walking with GPS tracking and photo updates.",
    tags: ["Dog", "Exercise", "Outdoor"],
    image: "🦮",
  },
  {
    id: 4,
    name: "Puppy Training Course",
    category: "Training",
    price: "₩120,000",
    duration: "8 weeks",
    rating: 4.6,
    bookings: 45,
    status: "paused",
    description: "8-week basic obedience training for puppies aged 3-6 months.",
    tags: ["Puppy", "Obedience", "Course"],
    image: "🐶",
  },
  {
    id: 5,
    name: "Pet Health Checkup",
    category: "Vet",
    price: "₩80,000",
    duration: "45 minutes",
    rating: 4.9,
    bookings: 167,
    status: "active",
    description:
      "Comprehensive health examination with blood work and vaccination.",
    tags: ["Health", "Checkup", "Vaccination"],
    image: "🏥",
  },
  {
    id: 6,
    name: "Pet Hotel Deluxe",
    category: "Hotel",
    price: "₩95,000/night",
    duration: "Overnight",
    rating: 4.8,
    bookings: 73,
    status: "active",
    description:
      "5-star pet hotel with room service, grooming, and outdoor activities.",
    tags: ["Luxury", "Hotel", "Activities"],
    image: "🏨",
  },
];

const MyServicesTab = () => {
  const [category, setCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceStatuses, setServiceStatuses] = useState<
    Record<number, string>
  >({});

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");

  const filtered = MOCK_SERVICES.filter((s) => {
    return category === "All" || s.category === category;
  });

  const getServiceStatus = (service: (typeof MOCK_SERVICES)[number]) => {
    return serviceStatuses[service.id] || service.status;
  };

  const formatPrice = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const openAddModal = () => {
    setEditingServiceId(null);
    setFormData({ title: "", description: "", duration: "", price: "" });
    setImages([]);
    setImageError("");
    setShowAddModal(true);
  };

  const openEditModal = (service: (typeof MOCK_SERVICES)[number]) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.name,
      description: service.description,
      duration: service.duration,
      price: formatPrice(service.price),
    });
    setImages([]);
    setImageError("");
    setShowAddModal(true);
  };

  const updateServiceStatus = (serviceId: number, status: string) => {
    setServiceStatuses((prev) => ({ ...prev, [serviceId]: status }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? formatPrice(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = images.length + newFiles.length;

    if (totalImages > 4) {
      setImageError("Maximum 4 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const handlePublish = () => {
    if (!formData.title.trim()) {
      alert("Please enter service title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter description");
      return;
    }
    if (!formData.duration) {
      alert("Please enter service duration");
      return;
    }
    if (!formData.price) {
      alert("Please enter price");
      return;
    }
    if (!editingServiceId && images.length === 0) {
      alert("Please upload at least 1 image");
      return;
    }

    // TODO: Submit form data and images to backend
    console.log(
      editingServiceId ? "Updating service:" : "Publishing service:",
      { serviceId: editingServiceId, ...formData },
      images,
    );
    resetModal();
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEditingServiceId(null);
    setFormData({ title: "", description: "", duration: "", price: "" });
    setImages([]);
    setImageError("");
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
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c} sx={{ color: "#000 !important" }}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <Box flex={1} />
        <Button
          variant="contained"
          className="btn-add-service"
          onClick={openAddModal}
        >
          Add New Service
        </Button>
      </Stack>

      {/* Services List */}
      <Stack spacing={1.5} className="services-list">
        {filtered.map((service) => {
          const serviceStatus = getServiceStatus(service);

          return (
            <Stack
              key={service.id}
              direction="row"
              alignItems="center"
              className={`service-row ${serviceStatus}`}
            >
              <Box className="service-row-media">
                <span className="thumb-emoji">{service.image}</span>
              </Box>

              <Stack className="service-row-main" spacing={0.75}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                  className="service-row-title-line"
                >
                  <Typography className="agent-name">{service.name}</Typography>
                  <Box className={`service-status ${serviceStatus}`}>
                    {serviceStatus}
                  </Box>
                </Stack>
                <Typography className="service-description">
                  {service.description}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className="service-tags"
                >
                  <Typography className="agent-service-type">
                    {service.category}
                  </Typography>
                  {service.tags.slice(0, 2).map((tag) => (
                    <Box className="service-tag" key={tag}>
                      {tag}
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                className="service-row-metrics"
              >
                <Stack className="metric-block">
                  <Typography className="metric-label">Price</Typography>
                  <Typography className="service-price">
                    {service.price}
                  </Typography>
                </Stack>
                <Stack className="metric-block">
                  <Typography className="metric-label">Rating</Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    className="rating-row"
                  >
                    <Rating
                      value={service.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography className="rating-value">
                      {service.rating}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack className="metric-block">
                  <Typography className="metric-label">Bookings</Typography>
                  <Typography className="bookings-row">
                    {service.bookings}
                  </Typography>
                </Stack>
              </Stack>

              <Stack className="service-row-actions" spacing={1}>
                <Button
                  className="service-action-tab edit"
                  onClick={() => openEditModal(service)}
                >
                  Edit
                </Button>
                <Stack direction="row" className="service-status-tabs">
                  {["active", "paused", "deleted"].map((status) => (
                    <Button
                      key={status}
                      className={`status-tab ${status} ${
                        serviceStatus === status ? "selected" : ""
                      }`}
                      onClick={() => updateServiceStatus(service.id, status)}
                    >
                      {status === "paused" ? "Pause" : status}
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
                  {editingServiceId ? "Edit Service" : "Create New Service"}
                </span>
                <Typography className="add-dialog-subtitle">
                  {editingServiceId
                    ? "Update the selected offer details."
                    : "Publish a bookable offer for pet owners."}
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
                label="Service Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Premium Dog Grooming"
                variant="outlined"
                className="add-service-field wide"
              />

              <TextField
                fullWidth
                label="Service Duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="1 hour"
                variant="outlined"
                className="add-service-field"
              />

              <TextField
                fullWidth
                label="Price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="45000"
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
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Bath, haircut, nail trim, and ear cleaning."
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
                <Typography>Service Images</Typography>
                <Chip
                  label={
                    editingServiceId
                      ? `${images.length}/4 replacement`
                      : `${images.length}/4 selected`
                  }
                  className="image-count-chip"
                />
              </Stack>

              {imageError && <Alert severity="error">{imageError}</Alert>}

              <Box
                className={`upload-dropzone ${
                  images.length >= 4 ? "disabled" : ""
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                  disabled={images.length >= 4}
                />
                <label htmlFor="image-upload">
                  <Box className="upload-icon-wrap">
                    <CloudUploadIcon />
                  </Box>
                  <Stack spacing={0.25} className="upload-copy">
                    <Typography className="upload-title">
                      Upload service photos
                    </Typography>
                    <Typography className="upload-note">
                      {editingServiceId
                        ? "JPG, PNG, or WEBP. Upload only if you want to replace photos."
                        : "JPG, PNG, or WEBP. Add at least one image."}
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
                          src={URL.createObjectURL(image)}
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            className="btn-dialog-publish"
          >
            {editingServiceId ? "Update Service" : "Publish Service"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MyServicesTab;
