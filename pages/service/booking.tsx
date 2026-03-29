import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  ButtonBase,
  IconButton,
  MenuItem,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRef, useState } from "react";
import moment from "moment";
import RelatedServices from "@/libs/components/servicepage/RelatedServices";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";

const Booking = () => {
  const images = [
    "/img/services/training.jpg",
    "/img/services/grooming.jpg",
    "/img/services/walking.jpg",
    "/img/services/boarding.png",
  ];
  const agentProfile = {
    name: "Sophia Kim",
    image: "/img/agents/topAgent1.jpg",
    role: "Dog Trainer • Pet Groomer • Veterinary Assistant",
    experience: "5+ years experience",
    rating: 4.9,
    reviewCount: 124,
    responseTime: "Usually replies within 15 minutes",
    serviceArea: "Seoul area",
    distance: "3.2 km away",
    pricing: "$35 / hour",
    startingPrice: "From $20 per visit",
    phone: "+82 10-2456-7812",
    email: "sophia.kim@petora.co.kr",
    bio: "Sophia works with puppies, adult dogs, and senior pets that need patient, structured care. Her approach is calm, friendly, and confidence-building, with a strong focus on positive reinforcement, safe handling, and clear communication with pet parents. She is especially trusted for leash manners, basic obedience, coat care, and medication support during home visits.",
  };
  const basicInformation = [
    { label: "Agent Name", value: agentProfile.name },
    { label: "Role / Specialty", value: agentProfile.role },
    { label: "Experience", value: agentProfile.experience },
    {
      label: "Approach",
      value: "Friendly, professional, positive reinforcement",
    },
    { label: "Languages", value: "Korean, English" },
  ];
  const certificateImages: Array<{
    title: string;
    image: string;
  }> = [
    {
      title: "Pet Care Accreditation",
      image: "/img/certifications/PACCC-fb-thumb.png",
    },
    {
      title: "Professional Pet Certification",
      image: "/img/certifications/certificate-50_page-0001.jpg",
    },
  ];
  const bookingHighlights = [
    {
      title: "Location",
      value: agentProfile.serviceArea,
      description: `Service coverage includes ${agentProfile.distance} from your selected address.`,
    },
    {
      title: "Pricing",
      value: agentProfile.pricing,
      description: `${agentProfile.startingPrice} depending on service type and pet needs.`,
    },
  ];
  const [selectedImage, setSelectedImage] = useState(0);
  const [openItems, setOpenItems] = useState([false, false, false]);
  const [trainingOption, setTrainingOption] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(312);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(0);

  const toggleDetail = (index: number) => {
    setOpenItems((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack className="booking-section">
      <Box className={"booking-top"}></Box>
      <Stack className="container">
        <Typography className="breadcrumb">
          Home / Services / Booking
        </Typography>

        <Stack className="booking-grid">
          <Stack className="gallery">
            <Stack className="thumbs">
              {images.map((src, index) => (
                <ButtonBase
                  key={src}
                  className={`thumb ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={src} alt={`Thumbnail ${index + 1}`} />
                </ButtonBase>
              ))}
            </Stack>

            <Box className="main-image">
              <img src={images[selectedImage]} alt="Training service" />
            </Box>
          </Stack>

          <Stack className="booking-sidebar">
            <Paper className="booking-card" elevation={0}>
              <Typography className="title">Training</Typography>
              <Typography className="subtitle">
                All training sessions are 60 min
              </Typography>

              <Typography className="price-range">$195.00–$565.00</Typography>

              <Stack className="field">
                <Typography className="field-label">
                  Training Options
                </Typography>
                <TextField
                  className="input"
                  select
                  size="small"
                  value={trainingOption}
                  onChange={(event) => setTrainingOption(event.target.value)}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) =>
                      (selected as string) || "Choose training option",
                    MenuProps: {
                      disablePortal: true,
                      PaperProps: { className: "booking-menu" },
                    },
                  }}
                >
                  <MenuItem value="">Choose training option</MenuItem>
                  <MenuItem value="Standard Training Session">
                    Standard Training Session
                  </MenuItem>
                  <MenuItem value="Training Package">Training Package</MenuItem>
                </TextField>
              </Stack>

              {trainingOption ? (
                <Typography className="price">
                  {trainingOption === "Standard Training Session"
                    ? "$195.00"
                    : "$565.00"}
                </Typography>
              ) : null}

              <Stack className="field">
                <Typography className="field-label">Date</Typography>
                <TextField
                  className="input"
                  type="date"
                  size="small"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  inputRef={dateInputRef}
                  onClick={() => dateInputRef.current?.showPicker?.()}
                />
              </Stack>

              <Stack className="cta-row">
                <Button className="add-btn" variant="contained">
                  Add to cart
                </Button>
                <Button className="pay-btn" variant="contained">
                  Pay
                </Button>
                <Badge
                  className="like-badge"
                  badgeContent={likeCount}
                  overlap="circular"
                  max={99999}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <IconButton
                    className={`heart-btn ${liked ? "liked" : ""}`}
                    aria-label="Add to favorites"
                    aria-pressed={liked}
                    onClick={() => {
                      setLiked((prev) => {
                        const next = !prev;
                        setLikeCount((count) =>
                          Math.max(0, count + (next ? 1 : -1)),
                        );
                        return next;
                      });
                    }}
                  >
                    {liked ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Badge>
              </Stack>
            </Paper>

            <Paper className="details-card" elevation={0}>
              <Accordion
                className="detail-item"
                expanded={openItems[0]}
                onChange={() => toggleDetail(0)}
                disableGutters
                square
              >
                <AccordionSummary
                  className="detail-title"
                  expandIcon={openItems[0] ? <RemoveIcon /> : <AddIcon />}
                >
                  <Typography>Details</Typography>
                </AccordionSummary>
                <AccordionDetails className="detail-body">
                  <Typography>
                    Whether you have a new puppy or your old friend has picked
                    up some bad habits, we’re here to help. Our training team
                    has over 1,000 hours of experience and specializes in
                    positive reinforcement training from puppy basics to
                    advanced obedience.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                className="detail-item"
                expanded={openItems[1]}
                onChange={() => toggleDetail(1)}
                disableGutters
                square
              >
                <AccordionSummary
                  className="detail-title"
                  expandIcon={openItems[1] ? <RemoveIcon /> : <AddIcon />}
                >
                  <Typography>Requirements</Typography>
                </AccordionSummary>
                <AccordionDetails className="detail-body">
                  <Typography>
                    All dogs must be free from parasites and communicable
                    diseases. If a dog poses a risk to others in our care, they
                    will not be accepted at check‑in. We will gladly welcome
                    your dog back once they are healthy.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                className="detail-item"
                expanded={openItems[2]}
                onChange={() => toggleDetail(2)}
                disableGutters
                square
              >
                <AccordionSummary
                  className="detail-title"
                  expandIcon={openItems[2] ? <RemoveIcon /> : <AddIcon />}
                >
                  <Typography>Vaccinations</Typography>
                </AccordionSummary>
                <AccordionDetails className="detail-body">
                  <Typography>
                    We require proof of vaccinations from your veterinarian
                    prior to using any of our services, in compliance with local
                    health guidelines.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Stack>
        </Stack>

        <Stack className="product-detail-tabs-section">
          <Tabs
            className="product-detail-tabs"
            value={value}
            onChange={handleChange}
            variant="fullWidth"
          >
            <Tab
              label={
                <span className="tab-label">
                  <InventoryOutlinedIcon className="tab-icon" />
                  Agent Information
                </span>
              }
            />
            <Tab
              label={
                <span className="tab-label">
                  <RateReviewOutlinedIcon className="tab-icon" />
                  Reviews
                </span>
              }
            />
          </Tabs>

          {value === 0 && (
            <Stack className="detail-tab-panel agent-tab-panel">
              <Stack className="agent-overview-card">
                <Box className="agent-overview-image">
                  <img
                    src={agentProfile.image}
                    alt={`${agentProfile.name} profile`}
                  />
                </Box>

                <Stack className="agent-overview-content">
                  <Typography className="agent-overview-name">
                    {agentProfile.name}
                  </Typography>
                  <Typography className="agent-overview-role">
                    {agentProfile.role}
                  </Typography>

                  <Stack className="agent-overview-metrics">
                    <Box className="agent-metric-chip">
                      {agentProfile.experience}
                    </Box>
                    <Box className="agent-metric-chip">
                      {agentProfile.responseTime}
                    </Box>
                  </Stack>

                  <Stack className="agent-overview-rating">
                    <Rating
                      value={agentProfile.rating}
                      precision={0.1}
                      readOnly
                    />
                    <Typography className="agent-overview-rating-text">
                      {agentProfile.rating.toFixed(1)} rating
                    </Typography>
                    <Typography className="agent-overview-rating-divider">
                      •
                    </Typography>
                    <Typography className="agent-overview-rating-text">
                      {agentProfile.reviewCount} verified bookings
                    </Typography>
                  </Stack>

                  <Typography className="agent-overview-bio">
                    {agentProfile.bio}
                  </Typography>

                  <Stack className="agent-overview-actions">
                    <Typography className="contact-info-title">
                      Contact Information
                    </Typography>
                    <Box className="contact-info-item">
                      <Typography className="contact-info-label">
                        Phone:
                      </Typography>
                      <a
                        href={`tel:${agentProfile.phone.replace(/\s+/g, "")}`}
                        className="contact-info-link"
                      >
                        {agentProfile.phone}
                      </a>
                    </Box>
                    <Box className="contact-info-item">
                      <Typography className="contact-info-label">
                        Email:
                      </Typography>
                      <a
                        href={`mailto:${agentProfile.email}`}
                        className="contact-info-link"
                      >
                        {agentProfile.email}
                      </a>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="agent-detail-grid">
                <Stack className="agent-detail-card">
                  <Typography className="detail-block-title">
                    Basic Information
                  </Typography>
                  <Stack className="detail-info-grid">
                    {basicInformation.map((item) => (
                      <Box key={item.label} className="detail-info-row">
                        <Typography className="detail-info-label">
                          {item.label}
                        </Typography>
                        <Typography className="detail-info-value">
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>

                <Stack className="agent-detail-card compact-info-card">
                  {bookingHighlights.map((item) => (
                    <Box key={item.title} className="compact-info-item">
                      <Box className="compact-info-icon">
                        {item.title === "Location" ? (
                          <PlaceOutlinedIcon />
                        ) : (
                          <SellOutlinedIcon />
                        )}
                      </Box>
                      <Stack className="compact-info-copy">
                        <Typography className="compact-info-title">
                          {item.title}
                        </Typography>
                        <Typography className="compact-info-value">
                          {item.value}
                        </Typography>
                        <Typography className="compact-info-description">
                          {item.description}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack className="agent-detail-card">
                <Typography className="detail-block-title">
                  Certifications
                </Typography>

                {certificateImages.length > 0 ? (
                  <Stack className="certificate-gallery">
                    {certificateImages.map((certificate) => (
                      <Box
                        key={`${certificate.title}`}
                        className="certificate-card"
                      >
                        <Box className="certificate-image-wrap">
                          <img
                            src={certificate.image}
                            alt={certificate.title}
                            className="certificate-image"
                          />
                        </Box>
                        <Typography className="certificate-title">
                          {certificate.title}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box className="certificate-empty-state">
                    <Stack className="certificate-empty-copy">
                      <Typography className="certificate-empty-title">
                        No certificate images uploaded yet
                      </Typography>
                      <Typography className="certificate-empty-text">
                        When the agent uploads official certificates, preview
                        images can be displayed here.
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Stack>
          )}

          {value === 1 && (
            <Stack className="detail-tab-panel review-tab-panel"></Stack>
          )}
        </Stack>
      </Stack>
      <RelatedServices />
    </Stack>
  );
};

export default withLayoutBasic(Booking);
