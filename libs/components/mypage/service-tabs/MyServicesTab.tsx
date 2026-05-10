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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (images.length === 0) {
      alert("Please upload at least 1 image");
      return;
    }

    // TODO: Submit form data and images to backend
    console.log("Publishing service:", formData, images);
    resetModal();
  };

  const resetModal = () => {
    setShowAddModal(false);
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
          sx={{ minWidth: 140 }}
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
          startIcon={<AddIcon />}
          className="btn-add-service"
          onClick={() => setShowAddModal(true)}
        >
          Add New Service
        </Button>
      </Stack>

      {/* Service Cards Grid */}
      <Grid container spacing={3}>
        {filtered.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <Stack
              className={`service-card ${service.status === "paused" ? "paused" : ""}`}
            >
              <Box className="agent-media">
                <Box className="agent-image-wrap">
                  <span className="thumb-emoji">{service.image}</span>
                </Box>
              </Box>

              <Stack className="agent-content" spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className="name-row"
                >
                  <Typography className="agent-name">{service.name}</Typography>
                  <Box className="bookings-row">
                    Bookings: {service.bookings}
                  </Box>
                </Stack>

                <Typography className="agent-service-type">
                  {service.category}
                </Typography>
                <Typography className="service-price">
                  {service.price}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
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

                {/* Management Actions (Subtle) */}
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="flex-end"
                  sx={{ mt: 1, pt: 1, borderTop: "1px solid #f3f4f6" }}
                >
                  <IconButton size="small" title="Edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Duplicate">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Pause">
                    <PauseCircleIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Delete" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Add New Service Modal */}
      <Dialog
        className="qna-dialog add-service-dialog"
        open={showAddModal}
        onClose={resetModal}
        fullWidth
        maxWidth="sm"
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
              <PetsIcon sx={{ color: "#6F2CFF" }} />
              <span>Create New Service</span>
            </Stack>
            <IconButton size="small" onClick={resetModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent className="add-dialog-content" sx={{ pt: 2 }}>
          <Stack spacing={3}>
            {/* Service Title */}
            <TextField
              fullWidth
              label="Service Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Premium Dog Grooming"
              variant="outlined"
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your service..."
              multiline
              rows={3}
              variant="outlined"
            />

            {/* Duration */}
            <TextField
              fullWidth
              label="Service Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 60"
              variant="outlined"
            />

            {/* Price */}
            <TextField
              fullWidth
              label="Price (₩)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 45000"
              variant="outlined"
            />

            {/* Image Upload */}
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 600, color: "#1f2937" }}>
                Service Images (Min 1, Max 4)
              </Typography>

              {imageError && <Alert severity="error">{imageError}</Alert>}

              {/* Upload Zone */}
              <Box
                sx={{
                  border: "2px dashed #6F2CFF",
                  borderRadius: "12px",
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  bgcolor: "#f9f5ff",
                  "&:hover": {
                    bgcolor: "#f3e8ff",
                    borderColor: "#7c3aed",
                  },
                }}
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
                <label
                  htmlFor="image-upload"
                  style={{ cursor: "pointer", display: "block" }}
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 40, color: "#6F2CFF", mb: 1 }}
                  />
                  <Typography
                    sx={{ fontWeight: 600, color: "#6F2CFF", mb: 0.5 }}
                  >
                    Click to upload images
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
                    or drag and drop
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 1 }}>
                    {images.length}/4 images selected
                  </Typography>
                </label>
              </Box>

              {/* Uploaded Images Preview */}
              {images.length > 0 && (
                <Grid container spacing={2}>
                  {images.map((image, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          paddingBottom: "100%",
                          bgcolor: "#f3f4f6",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={URL.createObjectURL(image)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid #f3f4f6" }}>
          <Button onClick={resetModal} sx={{ color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            sx={{
              background: "linear-gradient(135deg, #7c3aed, #6F2CFF)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Publish Service
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MyServicesTab;
