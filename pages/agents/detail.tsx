import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  MenuItem,
  Pagination,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { NextPage } from "next";

const agent = {
  fullName: "Maria Garcia",
  role: "Pet Groomer • Skin Care Specialist",
  serviceType: "Grooming",
  avatar: "/img/agents/topAgent1.jpg",
  bio: "Maria specialises in breed-specific grooming with 6 years of hands-on experience. She works with all coat types and is particularly skilled with anxious or first-time grooming dogs. Her calm, patient approach makes every session stress-free.",
  experience: "6+ years experience",
  approach: "Gentle, patient, positive reinforcement",
  languages: "Korean, English, Spanish",
  serviceArea: "Gangnam, Seoul",
  responseTime: "Usually replies within 10 minutes",
  rating: 4.9,
  verified: true,
  totalBookings: 214,
  joinDate: "Nov 20, 2025",
  certifications: [
    {
      title: "Pet Care Accreditation",
      image: "/img/certifications/PACCC-fb-thumb.png",
    },
    {
      title: "Professional Grooming Certification",
      image: "/img/certifications/Pet-certification.webp",
    },
  ],
};

const reviewSummary = {
  title: "Client Reviews",
  rating: 4.9,
  totalReviews: 124,
  satisfiedText: "96% of pet parents would recommend Maria",
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
    bookingInfo: "Booked grooming session • Verified booking",
    rating: 5,
    date: "February 18, 2026",
    content:
      "Maria was incredibly patient from the very first session. Our dog used to get anxious during grooming, but she made the whole experience stress-free. The coat was beautifully done and she gave us great tips for at-home maintenance.",
    photos: ["/img/services/grooming.jpg"],
  },
  {
    userName: "Daniel Cho",
    location: "Gangnam",
    bookingInfo: "Booked full spa & trim • Verified booking",
    rating: 5,
    date: "January 30, 2026",
    content:
      "We have an older dog with sensitive skin and Maria handled him with such care. She used the right products for his coat type and explained everything she was doing. We will absolutely be coming back.",
    photos: ["/img/services/grooming.jpg", "/img/services/walking.jpg"],
  },
  {
    userName: "Sora Han",
    location: "Mapo",
    bookingInfo: "Booked puppy first groom • Verified booking",
    rating: 4,
    date: "December 22, 2025",
    content:
      "Very warm and professional with our puppy's first grooming. She took it slow and made sure our pup was comfortable throughout. Would have loved a slightly longer drying step but overall very happy with the result.",
    photos: [],
  },
  {
    userName: "James Lee",
    location: "Yongsan",
    bookingInfo: "Booked breed cut • Verified booking",
    rating: 5,
    date: "November 14, 2025",
    content:
      "Excellent attention to detail. Maria nailed the breed-specific cut perfectly and was clearly knowledgeable about the coat type. The session was calm and our dog seemed relaxed the whole time.",
    photos: ["/img/services/grooming.jpg"],
  },
  {
    userName: "Yuri Kim",
    location: "Songpa",
    bookingInfo: "Booked de-shedding treatment • Verified booking",
    rating: 5,
    date: "October 03, 2025",
    content:
      "The de-shedding treatment was fantastic — our house has noticeably less fur now. Maria was thorough, gentle, and clearly loves what she does. Highly recommend her for any coat type.",
    photos: [],
  },
  {
    userName: "Kevin Moon",
    location: "Seodaemun",
    bookingInfo: "Booked full groom • Verified booking",
    rating: 4,
    date: "September 09, 2025",
    content:
      "Smooth booking process and great communication beforehand. Maria arrived prepared and did a thorough, careful job. Our dog looked great afterward and seemed at ease throughout.",
    photos: [],
  },
];

const AgentDetail: NextPage = () => {
  const router = useRouter();
  const writeReviewRef = useRef<HTMLDivElement | null>(null);
  const [writeReviewRating, setWriteReviewRating] = useState<number | null>(null);
  const [writeReviewText, setWriteReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewPage, setReviewPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const reviewPreviewLimit = 260;
  const reviewsPerPage = 3;

  useEffect(() => {
    if (router.query.writeReview === "true") {
      setTimeout(() => {
        writeReviewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [router.query.writeReview]);

  const handleWriteReviewSubmit = () => {
    if (!writeReviewRating) return;
    setReviewSubmitted(true);
  };

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

  const sortedReviewCards = [...reviewCards].sort((a, b) => {
    const dateDiff =
      moment(b.date, "MMMM DD, YYYY").valueOf() -
      moment(a.date, "MMMM DD, YYYY").valueOf();
    if (reviewSort === "highest") return b.rating - a.rating || dateDiff;
    if (reviewSort === "lowest") return a.rating - b.rating || dateDiff;
    return dateDiff;
  });

  const reviewPageCount = Math.ceil(sortedReviewCards.length / reviewsPerPage);
  const paginatedReviews = sortedReviewCards.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage,
  );

  const handleReviewSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewSort(e.target.value);
    setReviewPage(1);
  };

  const toggleExpand = (key: string) => {
    setExpandedReviews((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Stack className="agent-detail-page">
      <Box className="agent-detail-top" />
      <Stack className="container">
        <Typography className="agent-detail-breadcrumb">
          Home / Agents / Profile
        </Typography>

        <Stack className="agent-detail-grid">
          {/* ── Left: Profile ── */}
          <Stack className="agent-detail-profile">
            <Box className="agent-detail-avatar-wrap">
              <img
                src={agent.avatar}
                alt={agent.fullName}
                className="agent-detail-avatar"
              />
              {agent.verified && (
                <Box className="agent-detail-verified">
                  <VerifiedIcon sx={{ fontSize: 14 }} />
                  Verified
                </Box>
              )}
            </Box>

            <Typography className="agent-detail-name">{agent.fullName}</Typography>
            <Typography className="agent-detail-role">{agent.role}</Typography>

            <Stack className="agent-detail-rating-row" direction="row" alignItems="center">
              <Rating value={agent.rating} precision={0.1} readOnly size="small" />
              <Typography className="agent-detail-rating-score">
                {agent.rating.toFixed(1)}
              </Typography>
              <Typography className="agent-detail-rating-sep">·</Typography>
              <Typography className="agent-detail-rating-count">
                {reviewSummary.totalReviews} reviews
              </Typography>
            </Stack>

            <Typography className="agent-detail-bio">{agent.bio}</Typography>

            <Stack className="agent-detail-info-list">
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <WorkOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.serviceType}</Typography>
              </Stack>
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <WorkHistoryOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.experience}</Typography>
              </Stack>
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <FavoriteOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.approach}</Typography>
              </Stack>
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <TranslateOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.languages}</Typography>
              </Stack>
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <LocationOnOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.serviceArea}</Typography>
              </Stack>
              <Stack className="agent-detail-info-row" direction="row" alignItems="center">
                <AccessTimeOutlinedIcon className="agent-detail-info-icon" />
                <Typography className="agent-detail-info-text">{agent.responseTime}</Typography>
              </Stack>
            </Stack>

            {/* Certifications */}
            {agent.certifications.length > 0 && (
              <Stack className="agent-detail-certs">
                <Stack direction="row" spacing={1} alignItems="center" className="agent-detail-certs-title-row">
                  <WorkspacePremiumOutlinedIcon className="agent-detail-certs-icon" />
                  <Typography className="agent-detail-certs-title">Certifications</Typography>
                </Stack>
                <Stack className="agent-detail-certs-grid">
                  {agent.certifications.map((cert, i) => (
                    <Box key={i} className="agent-detail-cert-card">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="agent-detail-cert-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>

          {/* ── Right: Reviews ── */}
          <Stack className="agent-detail-reviews">

            {/* ── Write Review (visible when navigated from completed booking) ── */}
            {router.query.writeReview === "true" && (
              <Stack className="write-review-panel" ref={writeReviewRef}>
                {reviewSubmitted ? (
                  <Stack className="write-review-success">
                    <Typography className="write-review-success-title">✓ Thank you for your review!</Typography>
                    <Typography className="write-review-success-sub">Your feedback helps other pet owners find the best agent.</Typography>
                  </Stack>
                ) : (
                  <>
                    <Stack className="write-review-left">
                      <Typography className="write-review-panel-title">Write a Review</Typography>
                      <Stack className="write-review-rating-row">
                        <Typography className="write-review-label">Your Rating</Typography>
                        <Rating
                          value={writeReviewRating}
                          onChange={(_e, val) => setWriteReviewRating(val)}
                          className="write-review-stars"
                        />
                      </Stack>
                    </Stack>
                    <Stack className="write-review-right">
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Share your experience with this agent..."
                        value={writeReviewText}
                        onChange={(e) => setWriteReviewText(e.target.value)}
                        className="write-review-textfield"
                      />
                      <Stack className="write-review-images-row" direction="row" flexWrap="wrap">
                        {reviewImages.map((src, i) => (
                          <Box key={i} className="write-review-img-preview">
                            <img src={src} alt={`upload-${i}`} />
                            <Box className="write-review-img-remove" onClick={() => removeReviewImage(i)}>
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
                            <Box className="write-review-img-upload-icon">+</Box>
                            <Typography className="write-review-img-upload-text">Add Photo</Typography>
                          </label>
                        )}
                      </Stack>
                      <Button
                        className="write-review-submit-btn"
                        disabled={!writeReviewRating}
                        onClick={handleWriteReviewSubmit}
                        startIcon={<RateReviewOutlinedIcon />}
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

              <Stack className="review-score-row" direction="row" alignItems="center">
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
              <Stack className="review-cards-header" direction="row" justifyContent="space-between" alignItems="center">
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
                const shouldTruncate = review.content.length > reviewPreviewLimit;
                const reviewContent =
                  shouldTruncate && !isExpanded
                    ? `${review.content.slice(0, reviewPreviewLimit).trimEnd()}...`
                    : review.content;

                return (
                  <Stack key={reviewKey} className="review-card">
                    <Stack className="review-card-header" direction="row" alignItems="center">
                      <Box className="review-card-avatar">
                        {review.userName.charAt(0)}
                      </Box>
                      <Stack className="review-card-user-info">
                        <Typography className="review-card-username">
                          {review.userName}
                        </Typography>
                        <Typography className="review-card-location">
                          {review.location}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography className="review-card-booking-info">
                      {review.bookingInfo}
                    </Typography>

                    <Stack className="review-card-rating-row" direction="row" alignItems="center">
                      <Rating value={review.rating} precision={0.5} readOnly size="small" />
                      <Typography className="review-card-date">{review.date}</Typography>
                    </Stack>

                    <Typography className="review-card-content">{reviewContent}</Typography>

                    {shouldTruncate && (
                      <Typography
                        className="review-toggle-btn"
                        onClick={() => toggleExpand(reviewKey)}
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </Typography>
                    )}

                    {review.photos.length > 0 && (
                      <Stack className="review-card-photos" direction="row">
                        {review.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Review photo ${i + 1}`}
                            className="review-card-photo"
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                );
              })}

              {reviewPageCount > 1 && (
                <Stack className="review-pagination">
                  <Pagination
                    count={reviewPageCount}
                    page={reviewPage}
                    onChange={(_e, page) => setReviewPage(page)}
                    color="primary"
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(AgentDetail);
