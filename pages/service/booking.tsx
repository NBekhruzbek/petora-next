import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Pagination,
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
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import moment, { Moment } from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import RelatedServices from "@/libs/components/servicepage/RelatedServices";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

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
    bookingCount: 312,
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
  const reviewSummary = {
    title: "Client Reviews",
    rating: 4.9,
    totalReviews: 124,
    satisfiedText: "96% of pet parents would book Sophia again",
  };
  const reviewDistribution = [
    { label: "Excellent", percent: 82, tone: "warm" },
    { label: "Good", percent: 11, tone: "warm" },
    { label: "Average", percent: 4, tone: "cool" },
    { label: "Poor", percent: 2, tone: "cool" },
    { label: "Bad", percent: 1, tone: "cool" },
  ];
  const reviewCards = [
    {
      userName: "Mina Park",
      location: "Seoul",
      bookingInfo: "Booked puppy training • Verified booking",
      rating: 5,
      date: "February 18, 2026",
      content:
        "Sophia was patient from the very first session and gave us simple routines we could actually follow at home. Our puppy became calmer on walks within two weeks, and we also appreciated the clear updates after every visit. Sophia was patient from the very first session and gave us simple routines we could actually follow at home. Our puppy became calmer on walks within two weeks, and we also appreciated the clear updates after every visit",
      photos: ["/img/services/training.jpg", "/img/services/walking.jpg"],
    },
    {
      userName: "Daniel Cho",
      location: "Gangnam",
      bookingInfo: "Booked grooming + medication support • Verified booking",
      rating: 5,
      date: "January 30, 2026",
      content:
        "We have an older dog who gets nervous with new people, but Sophia handled him gently and professionally. Grooming was neat, medication instructions were followed exactly, and she kept us informed the whole time.",
      photos: ["/img/services/grooming.jpg"],
    },
    {
      userName: "Sora Han",
      location: "Mapo",
      bookingInfo: "Booked pet sitting • Verified booking",
      rating: 4,
      date: "December 22, 2025",
      content:
        "Very dependable and warm with our dog. We especially liked the photo updates and the fact that she noticed small behavior changes right away. Would have loved a slightly longer first meet-and-greet, but the service itself was excellent.",
      photos: [],
    },
    {
      userName: "James Lee",
      location: "Yongsan",
      bookingInfo: "Booked obedience sessions • Verified booking",
      rating: 5,
      date: "November 14, 2025",
      content:
        "Sophia helped us work through leash pulling and basic recall in a realistic, encouraging way. The sessions felt structured, not rushed, and she explained what to practice between visits so we kept making progress.",
      photos: ["/img/services/day-care.jpg", "/img/services/training.jpg"],
    },
    {
      userName: "Yuri Kim",
      location: "Songpa",
      bookingInfo: "Booked senior pet care • Verified booking",
      rating: 5,
      date: "October 03, 2025",
      content:
        "Kind, punctual, and clearly experienced with senior dogs. She was careful with mobility issues and made our family feel comfortable leaving our pet in her care. We will definitely rebook.",
      photos: [],
    },
    {
      userName: "Kevin Moon",
      location: "Seodaemun",
      bookingInfo: "Booked home visit support • Verified booking",
      rating: 4,
      date: "September 09, 2025",
      content:
        "Communication was smooth and professional throughout. Sophia arrived on time, followed our care notes closely, and left a very detailed summary after the visit. Overall a very trustworthy experience.",
      photos: [],
    },
  ];

  const serviceChips = [
    { icon: <PlaceOutlinedIcon />, label: "At your location" },
    { icon: <EventAvailableOutlinedIcon />, label: "Mon – Sat" },
  ];

  // Training session length — drives how many time slots fit in a day
  const SERVICE_DURATION_MINUTES = 60;
  const WORKING_HOURS = { start: "09:00", end: "18:00" };
  // Slots start at intervals equal to the session duration (1h session -> hourly slots, etc.)
  const SLOT_STEP_MINUTES = SERVICE_DURATION_MINUTES;

  // Mock: intervals already reserved by other clients, keyed by date (YYYY-MM-DD)
  const bookedSlots: Record<string, { start: string; end: string }[]> = {
    [moment().format("YYYY-MM-DD")]: [
      { start: "10:00", end: "11:00" },
      { start: "14:00", end: "15:00" },
    ],
    [moment().add(1, "day").format("YYYY-MM-DD")]: [
      { start: "09:00", end: "18:00" },
    ],
    [moment().add(3, "day").format("YYYY-MM-DD")]: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:30" },
    ],
  };

  const toMinutes = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  };

  const getAvailableTimeSlots = (selectedDate: string) => {
    const dayStart = toMinutes(WORKING_HOURS.start);
    const dayEnd = toMinutes(WORKING_HOURS.end);
    const booked = bookedSlots[selectedDate] ?? [];
    const slots: string[] = [];

    for (
      let start = dayStart;
      start + SERVICE_DURATION_MINUTES <= dayEnd;
      start += SLOT_STEP_MINUTES
    ) {
      const end = start + SERVICE_DURATION_MINUTES;
      const overlaps = booked.some(
        (b) => start < toMinutes(b.end) && end > toMinutes(b.start),
      );
      if (!overlaps) {
        const h = Math.floor(start / 60)
          .toString()
          .padStart(2, "0");
        const m = (start % 60).toString().padStart(2, "0");
        slots.push(`${h}:${m}`);
      }
    }
    return slots;
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [openItems, setOpenItems] = useState([false, false, false, false]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState("");

  const availableTimeSlots = useMemo(() => getAvailableTimeSlots(date), [date]);

  const isDateFullyBooked = (day: Moment) =>
    getAvailableTimeSlots(day.format("YYYY-MM-DD")).length === 0;

  useEffect(() => {
    if (!availableTimeSlots.includes(time)) {
      setTime(availableTimeSlots[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(312);

  // Booking dialog
  const device = useDeviceDetect();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [bookingRef] = useState(
    `BK-${Math.floor(10000 + Math.random() * 90000)}`,
  );
  const [petErrors, setPetErrors] = useState({ petName: "", petType: "" });

  const openBookingDialog = () => {
    setBookingStep(1);
    setBookingOpen(true);
  };
  const closeBookingDialog = () => {
    setBookingOpen(false);
  };

  const handleBookingNext = () => {
    const errors = { petName: "", petType: "" };
    if (!petName.trim()) errors.petName = "Pet name is required";
    if (!petType.trim()) errors.petType = "Please select a pet type";
    if (errors.petName || errors.petType) {
      setPetErrors(errors);
      return;
    }
    setPetErrors({ petName: "", petType: "" });
    setBookingStep(2);
  };

  const handleConfirmBooking = () => setBookingStep(3);
  const router = useRouter();
  const writeReviewRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const [writeReviewRating, setWriteReviewRating] = useState<number | null>(
    null,
  );
  const [writeReviewText, setWriteReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReviewImages((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (router.query.writeReview === "true") {
      setValue(1);
      setTimeout(() => {
        writeReviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [router.query.writeReview]);

  const handleWriteReviewSubmit = () => {
    if (!writeReviewRating) return;
    setReviewSubmitted(true);
  };
  const [reviewPage, setReviewPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [reviewSort, setReviewSort] = useState("newest");
  const reviewPreviewLimit = 260;
  const reviewsPerPage = 3;
  const sortedReviewCards = [...reviewCards].sort((a, b) => {
    const dateDiff =
      moment(b.date, "MMMM DD, YYYY").valueOf() -
      moment(a.date, "MMMM DD, YYYY").valueOf();

    if (reviewSort === "highest") {
      return b.rating - a.rating || dateDiff;
    }

    if (reviewSort === "lowest") {
      return a.rating - b.rating || dateDiff;
    }

    return dateDiff;
  });
  const reviewPageCount = Math.ceil(sortedReviewCards.length / reviewsPerPage);
  const paginatedReviews = sortedReviewCards.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage,
  );

  const toggleDetail = (index: number) => {
    setOpenItems((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleReviewPageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setReviewPage(page);
  };
  const handleReviewSortChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setReviewSort(event.target.value);
    setReviewPage(1);
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
            {/* ── Booking card ── */}
            <Paper className="booking-card" elevation={0}>
              <Typography className="title">Training</Typography>
              <Typography className="subtitle">
                All training sessions are 60 min
              </Typography>

              {/* Rating */}
              <Stack
                className="booking-rating-row"
                direction="row"
                alignItems="center"
              >
                <Rating
                  value={agentProfile.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography className="booking-rating-score">
                  {agentProfile.rating.toFixed(1)}
                </Typography>
                <Typography className="booking-rating-sep">·</Typography>
                <Typography className="booking-rating-count">
                  {agentProfile.reviewCount} reviews
                </Typography>
                <Typography className="booking-rating-sep">·</Typography>
                <Typography className="booking-booking-count">
                  {agentProfile.bookingCount.toLocaleString()} booked
                </Typography>
              </Stack>

              {/* Service chips */}
              <Stack className="booking-chips" direction="row" flexWrap="wrap">
                {serviceChips.map((chip) => (
                  <Box key={chip.label} className="booking-chip">
                    {chip.icon}
                    <span>{chip.label}</span>
                  </Box>
                ))}
              </Stack>

              {/* Price */}
              <Typography className="price-display">
                $195 <span className="price-unit">/ session</span>
              </Typography>

              {/* Date */}
              <Stack className="date-time-row" direction="row" gap={2}>
                <Stack className="field" flex={1}>
                  <Typography className="field-label">Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      className="input"
                      value={moment(date)}
                      onChange={(newValue) => {
                        if (newValue) setDate(newValue.format("YYYY-MM-DD"));
                      }}
                      minDate={moment()}
                      shouldDisableDate={isDateFullyBooked}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Stack>

              {/* Time slots */}
              <Stack className="field">
                <Typography className="field-label">
                  Time ({SERVICE_DURATION_MINUTES} min session)
                </Typography>
                {availableTimeSlots.length > 0 ? (
                  <Stack
                    className="time-slot-list"
                    direction="row"
                    flexWrap="wrap"
                    gap="8px"
                  >
                    {availableTimeSlots.map((slot) => (
                      <Box
                        key={slot}
                        className={`time-slot-chip ${time === slot ? "selected" : ""}`}
                        onClick={() => setTime(slot)}
                      >
                        <span>{slot}</span>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography className="no-slots-text">
                    No available times for this date
                  </Typography>
                )}
              </Stack>

              {/* CTAs */}
              <Stack className="cta-row">
                <Button
                  className="book-now-btn"
                  variant="contained"
                  fullWidth
                  onClick={openBookingDialog}
                  disabled={!time}
                >
                  Book Now
                </Button>
                <Button
                  className={`save-favorites-btn ${liked ? "is-liked" : ""}`}
                  fullWidth
                  startIcon={
                    liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />
                  }
                  onClick={() => {
                    setLiked((prev) => {
                      setLikeCount((c) => Math.max(0, c + (prev ? -1 : 1)));
                      return !prev;
                    });
                  }}
                >
                  {liked ? "Saved to favorites" : "Save to favorites"} ·{" "}
                  {likeCount}
                </Button>
              </Stack>
            </Paper>

            {/* ── Details accordion card ── */}
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

              <Accordion
                className="detail-item"
                expanded={openItems[3]}
                onChange={() => toggleDetail(3)}
                disableGutters
                square
              >
                <AccordionSummary
                  className="detail-title"
                  expandIcon={openItems[3] ? <RemoveIcon /> : <AddIcon />}
                >
                  <Typography>Cancellation Policy</Typography>
                </AccordionSummary>
                <AccordionDetails className="detail-body">
                  <Typography>
                    Free cancellation up to 24 hours before the session.
                    Cancellations within 24 hours are subject to a 50% charge.
                    No-shows are charged in full.
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
            <Stack className="detail-tab-panel review-tab-panel">
              {/* ── Write Review (only visible when navigated from completed booking) ── */}
              {router.query.writeReview === "true" && (
                <Stack className="write-review-panel" ref={writeReviewRef}>
                  {reviewSubmitted ? (
                    <Stack className="write-review-success">
                      <Typography className="write-review-success-title">
                        ✓ Thank you for your review!
                      </Typography>
                      <Typography className="write-review-success-sub">
                        Your feedback helps other pet owners find the best care.
                      </Typography>
                    </Stack>
                  ) : (
                    <>
                      {/* Left: title + rating */}
                      <Stack className="write-review-left">
                        <Typography className="write-review-panel-title">
                          Write a Review
                        </Typography>
                        <Stack className="write-review-rating-row">
                          <Typography className="write-review-label">
                            Your Rating
                          </Typography>
                          <Rating
                            value={writeReviewRating}
                            onChange={(_e, val) => setWriteReviewRating(val)}
                            className="write-review-stars"
                          />
                        </Stack>
                      </Stack>
                      {/* Right: textarea + images + submit */}
                      <Stack className="write-review-right">
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          placeholder="Share your experience with this service..."
                          value={writeReviewText}
                          onChange={(e) => setWriteReviewText(e.target.value)}
                          className="write-review-textfield"
                        />

                        {/* Image upload */}
                        <Stack
                          className="write-review-images-row"
                          direction="row"
                          flexWrap="wrap"
                        >
                          {reviewImages.map((src, i) => (
                            <Box key={i} className="write-review-img-preview">
                              <img src={src} alt={`upload-${i}`} />
                              <Box
                                className="write-review-img-remove"
                                onClick={() => removeReviewImage(i)}
                              >
                                ✕
                              </Box>
                            </Box>
                          ))}
                          {reviewImages.length < 4 && (
                            <label className="write-review-img-upload">
                              <input
                                hidden
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleReviewImageUpload}
                              />
                              <Box className="write-review-img-upload-icon">
                                +
                              </Box>
                              <Typography className="write-review-img-upload-text">
                                Add Photo
                              </Typography>
                            </label>
                          )}
                        </Stack>

                        <Button
                          className="write-review-submit-btn"
                          disabled={!writeReviewRating}
                          onClick={handleWriteReviewSubmit}
                        >
                          Submit Review
                        </Button>
                      </Stack>
                    </>
                  )}
                </Stack>
              )}

              <Stack className="review-summary-panel">
                <Typography className="review-summary-title">
                  {reviewSummary.title}
                </Typography>

                <Stack className="review-score-row">
                  <Rating
                    className="review-rating-stars"
                    value={reviewSummary.rating}
                    precision={0.1}
                    readOnly
                  />
                  <Typography className="review-score-count">
                    {reviewSummary.rating.toFixed(1)}
                  </Typography>
                </Stack>

                <Box className="review-satisfied-box">
                  <SentimentSatisfiedAltOutlinedIcon className="review-satisfied-icon" />
                  <Typography className="review-satisfied-text">
                    {reviewSummary.satisfiedText}
                  </Typography>
                </Box>

                <Stack className="review-distribution-list">
                  {reviewDistribution.map((item) => (
                    <Box key={item.label} className="review-distribution-row">
                      <Typography className="review-distribution-label">
                        {item.label}
                      </Typography>
                      <Box className="review-distribution-track">
                        <Box
                          className={`review-distribution-fill ${item.tone}`}
                          sx={{ width: `${item.percent}%` }}
                        />
                      </Box>
                      <Typography className="review-distribution-value">
                        {item.percent}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack className="review-cards-panel">
                <Stack className="review-cards-header">
                  <Typography className="review-cards-count">
                    {sortedReviewCards.length} reviews
                  </Typography>
                  <TextField
                    className="review-sort-field"
                    select
                    size="small"
                    value={reviewSort}
                    onChange={handleReviewSortChange}
                    SelectProps={{
                      MenuProps: {
                        disablePortal: true,
                        PaperProps: { className: "review-sort-menu" },
                      },
                    }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="highest">High to Lowest rated</MenuItem>
                    <MenuItem value="lowest">Low to Highest rated</MenuItem>
                  </TextField>
                </Stack>

                {paginatedReviews.map((review) => {
                  const reviewKey = `${review.userName}-${review.date}`;
                  const isExpanded = expandedReviews[reviewKey];
                  const shouldTruncate =
                    review.content.length > reviewPreviewLimit;
                  const reviewContent =
                    shouldTruncate && !isExpanded
                      ? `${review.content.slice(0, reviewPreviewLimit).trimEnd()}...`
                      : review.content;

                  return (
                    <Box key={reviewKey} className="review-card">
                      <Stack className="review-card-user">
                        <Box className="review-user-avatar">
                          <img
                            src="/img/profile/defaultUser.png"
                            alt={`${review.userName} avatar`}
                          />
                        </Box>
                        <Stack className="review-user-meta">
                          <Typography className="review-user-name">
                            {review.userName}
                          </Typography>
                          <Typography className="review-user-location">
                            {review.location}
                          </Typography>
                          <Typography className="review-user-purchase">
                            {review.bookingInfo}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack className="review-card-body">
                        <Stack className="review-card-top">
                          <Rating
                            className="review-card-stars"
                            value={review.rating}
                            precision={0.5}
                            readOnly
                          />
                          <Typography className="review-card-date">
                            {review.date}
                          </Typography>
                        </Stack>

                        {review.photos.length > 0 && (
                          <Stack className="review-photo-list">
                            {review.photos.map((photo, index) => (
                              <Box
                                key={`${review.userName}-photo-${index}`}
                                className="review-photo-item"
                              >
                                <img
                                  src={photo}
                                  alt={`${review.userName} review photo ${index + 1}`}
                                />
                              </Box>
                            ))}
                          </Stack>
                        )}

                        <Typography className="review-card-text">
                          {reviewContent}
                        </Typography>

                        {shouldTruncate && (
                          <Button
                            className="review-card-toggle"
                            onClick={() =>
                              setExpandedReviews((prev) => ({
                                ...prev,
                                [reviewKey]: !prev[reviewKey],
                              }))
                            }
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  );
                })}

                {reviewPageCount > 1 && (
                  <Pagination
                    className="review-pagination"
                    count={reviewPageCount}
                    page={reviewPage}
                    onChange={handleReviewPageChange}
                    shape="rounded"
                  />
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
      <RelatedServices />

      {/* ── Booking Dialog ── */}
      <Dialog
        open={bookingOpen}
        onClose={bookingStep === 3 ? closeBookingDialog : undefined}
        fullScreen={device === "mobile"}
        className="booking-dialog"
        PaperProps={{ className: "booking-dialog-paper" }}
      >
        {/* Header */}
        <Stack
          className="booking-dialog-header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack gap="2px">
            <Typography className="booking-dialog-title">
              {bookingStep === 1 && "Pet Details"}
              {bookingStep === 2 && "Confirm Booking"}
              {bookingStep === 3 && "Request Submitted"}
            </Typography>
            {bookingStep < 3 && (
              <Typography className="booking-dialog-step">
                Step {bookingStep} of 2
              </Typography>
            )}
          </Stack>
          <IconButton
            className="booking-dialog-close"
            onClick={closeBookingDialog}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Step 1 — Pet Details */}
        {bookingStep === 1 && (
          <Stack className="booking-dialog-body">
            <Stack
              className="booking-service-summary"
              direction="row"
              alignItems="center"
              gap="12px"
            >
              <Box className="booking-summary-img">
                <img src={images[selectedImage]} alt="service" />
              </Box>
              <Stack gap="2px">
                <Typography className="booking-summary-name">
                  Training with {agentProfile.name}
                </Typography>
                <Stack direction="row" alignItems="center" gap="10px">
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="5px"
                    className="booking-summary-meta"
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" />
                    <span>{moment(date).format("MMM D, YYYY")}</span>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="5px"
                    className="booking-summary-meta"
                  >
                    <AccessTimeOutlinedIcon fontSize="small" />
                    <span>{time}</span>
                  </Stack>
                </Stack>
                <Typography className="booking-summary-price">
                  $195 / session
                </Typography>
              </Stack>
            </Stack>

            <Divider className="booking-dialog-divider" />

            <Stack gap="14px">
              <Stack
                direction="row"
                alignItems="center"
                gap="8px"
                className="booking-section-label"
              >
                <PetsOutlinedIcon fontSize="small" />
                <Typography>Tell us about your pet</Typography>
              </Stack>

              <Stack className="booking-field">
                <Typography className="booking-field-label">
                  Your Pet's Name *
                </Typography>
                <TextField
                  size="small"
                  placeholder="e.g. Max, Luna, Buddy…"
                  value={petName}
                  onChange={(e) => {
                    setPetName(e.target.value);
                    setPetErrors((p) => ({ ...p, petName: "" }));
                  }}
                  error={!!petErrors.petName}
                  helperText={petErrors.petName}
                  className="booking-input"
                />
              </Stack>

              <Stack className="booking-field">
                <Typography className="booking-field-label">
                  Pet Type *
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="8px">
                  {["Dog", "Cat", "Bird", "Rabbit", "Other"].map((value) => (
                    <Box
                      key={value}
                      className={`pet-chip ${petType === value ? "selected" : ""}`}
                      onClick={() => {
                        setPetType(value);
                        setPetErrors((p) => ({ ...p, petType: "" }));
                      }}
                    >
                      <span>{value}</span>
                    </Box>
                  ))}
                </Stack>
                {petErrors.petType && (
                  <Typography className="booking-chip-error">
                    {petErrors.petType}
                  </Typography>
                )}
              </Stack>

              <Stack className="booking-field">
                <Typography className="booking-field-label">Pet Age</Typography>
                <Stack direction="row" flexWrap="wrap" gap="8px">
                  {[
                    { value: "Under 1 year", label: "Under 1 yr" },
                    { value: "1–3 years", label: "1–3 yrs" },
                    { value: "3–7 years", label: "3–7 yrs" },
                    { value: "7+ years", label: "7+ yrs" },
                  ].map(({ value, label }) => (
                    <Box
                      key={value}
                      className={`pet-chip ${petAge === value ? "selected" : ""}`}
                      onClick={() => setPetAge(value)}
                    >
                      <span>{label}</span>
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack className="booking-field">
                <Typography className="booking-field-label">
                  Special Requests / Notes
                </Typography>
                <TextField
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Any allergies, behavioral notes, or special care instructions…"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="booking-input booking-notes-input"
                  inputProps={{ style: { textAlign: "left" } }}
                />
              </Stack>
            </Stack>

            <Button
              className="btn-booking-next"
              endIcon={<ArrowForwardIcon />}
              onClick={handleBookingNext}
              fullWidth
            >
              Continue to Confirm
            </Button>
          </Stack>
        )}

        {/* Step 2 — Confirm */}
        {bookingStep === 2 && (
          <Stack className="booking-dialog-body">
            <Stack className="booking-confirm-card">
              <Typography className="confirm-section-title">
                Booking Summary
              </Typography>

              <Stack className="confirm-row">
                <Typography className="confirm-label">Service</Typography>
                <Typography className="confirm-value">
                  Training Session
                </Typography>
              </Stack>
              <Stack className="confirm-row">
                <Typography className="confirm-label">Agent</Typography>
                <Typography className="confirm-value">
                  {agentProfile.name}
                </Typography>
              </Stack>
              <Stack className="confirm-row">
                <Typography className="confirm-label">Date</Typography>
                <Typography className="confirm-value">
                  {moment(date).format("MMMM D, YYYY")}
                </Typography>
              </Stack>
              <Stack className="confirm-row">
                <Typography className="confirm-label">Time</Typography>
                <Typography className="confirm-value">{time}</Typography>
              </Stack>
              <Stack className="confirm-row">
                <Typography className="confirm-label">Pet</Typography>
                <Typography className="confirm-value">
                  {petName} · {petType}
                  {petAge ? ` · ${petAge}` : ""}
                </Typography>
              </Stack>
              {specialNotes && (
                <Stack className="confirm-row confirm-row-notes">
                  <Typography className="confirm-label">Notes</Typography>
                  <Typography className="confirm-value confirm-notes">
                    {specialNotes}
                  </Typography>
                </Stack>
              )}
              <Divider className="booking-dialog-divider" />
              <Stack className="confirm-row confirm-price-row">
                <Typography className="confirm-total-label">Total</Typography>
                <Typography className="confirm-total-value">$195</Typography>
              </Stack>
            </Stack>

            <Stack className="booking-confirm-policy">
              <Typography>
                Free cancellation up to 24 hours before the session.
              </Typography>
            </Stack>

            <Stack direction="row" gap="10px">
              <Button
                className="btn-booking-back"
                onClick={() => setBookingStep(1)}
              >
                Back
              </Button>
              <Button
                className="btn-booking-confirm"
                onClick={handleConfirmBooking}
                fullWidth
              >
                Confirm Booking
              </Button>
            </Stack>
          </Stack>
        )}

        {/* Step 3 — Pending */}
        {bookingStep === 3 && (
          <Stack className="booking-dialog-body booking-success-body">
            <Box className="booking-pending-badge">Pending</Box>
            <Typography className="booking-success-title">
              Booking Request Sent!
            </Typography>
            <Typography className="booking-success-ref">
              Ref: {bookingRef}
            </Typography>
            <Typography className="booking-success-msg">
              Your request has been sent to {agentProfile.name} for{" "}
              {moment(date).format("MMMM D, YYYY")} at {time}. The agent will
              review and accept your booking shortly. You'll be notified once
              it's confirmed.
            </Typography>
            <Button
              className="btn-booking-done"
              onClick={closeBookingDialog}
              fullWidth
            >
              Done
            </Button>
          </Stack>
        )}
      </Dialog>
    </Stack>
  );
};

export default withLayoutBasic(Booking);
