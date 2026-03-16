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
  Stack,
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

const Booking = () => {
  const images = [
    "/img/services/training.jpg",
    "/img/services/grooming.jpg",
    "/img/services/walking.jpg",
    "/img/services/boarding.png",
  ];
  const [selectedImage, setSelectedImage] = useState(0);
  const [openItems, setOpenItems] = useState([false, false, false]);
  const [trainingOption, setTrainingOption] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(312);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDetail = (index: number) => {
    setOpenItems((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
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
      </Stack>
      <RelatedServices />
    </Stack>
  );
};

export default withLayoutBasic(Booking);
