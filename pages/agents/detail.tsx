import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  Pagination,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { NextPage } from "next";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_MEMBER, GET_REVIEWS } from "@/apollo/user/query";
import { CREATE_NEW_REVIEW, IMAGES_UPLOADER } from "@/apollo/user/mutation";
import { Member } from "@/libs/types/member/member";
import { Review, ReviewStats } from "@/libs/types/review/review";
import { ReviewGroup } from "@/libs/enums/review.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages, REACT_APP_API_URL } from "@/libs/config";
import { sweetMixinErrorAlert } from "@/libs/sweetAlert";

const REVIEWS_PER_PAGE = 3;
const REVIEW_PREVIEW_LIMIT = 260;
const MAX_REVIEW_IMAGES = 4;

type ReviewSortOption = "newest" | "highest" | "lowest";

const REVIEW_SORT_OPTIONS: {
  value: ReviewSortOption;
  label: string;
  sort: string;
  direction: Direction;
}[] = [
  {
    value: "newest",
    label: "Newest",
    sort: "createdAt",
    direction: Direction.DESC,
  },
  {
    value: "highest",
    label: "High to Lowest rated",
    sort: "reviewRating",
    direction: Direction.DESC,
  },
  {
    value: "lowest",
    label: "Low to Highest rated",
    sort: "reviewRating",
    direction: Direction.ASC,
  },
];

// `stats.ratingDistribution` always comes back ordered 5 → 1 stars.
const DISTRIBUTION_ROWS = [
  { label: "Excellent", tone: "warm" },
  { label: "Good", tone: "warm" },
  { label: "Average", tone: "cool" },
  { label: "Poor", tone: "cool" },
  { label: "Bad", tone: "cool" },
];

// Enum values arrive as tokens ("DAY_CARE", "GANGNAM") — render them as words.
const prettifyEnum = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const imageUrl = (path?: string, fallback = "") => {
  if (!path) return fallback;
  return /^https?:\/\//.test(path) ? path : `${REACT_APP_API_URL}/${path}`;
};

const DEFAULT_AVATAR = "/img/profile/defaultUser.png";

const AgentDetail: NextPage = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const agentId = router.query.id as string | undefined;

  const writeReviewRef = useRef<HTMLDivElement | null>(null);
  const [writeReviewRating, setWriteReviewRating] = useState<number | null>(
    null,
  );
  const [writeReviewText, setWriteReviewText] = useState("");
  // The picked files are kept alongside their data-URL preview so the images
  // can be uploaded on submit while still rendering instantly.
  const [reviewImages, setReviewImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [reviewSort, setReviewSort] = useState<ReviewSortOption>("newest");
  const [reviewPage, setReviewPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  // Remote avatars (OAuth photo URLs) can expire — fall back to the initial.
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>(
    {},
  );
  // Index into `certificates` for the fullscreen viewer; null = closed.
  const [certGalleryIndex, setCertGalleryIndex] = useState<number | null>(null);

  const activeReviewSort =
    REVIEW_SORT_OPTIONS.find((option) => option.value === reviewSort) ??
    REVIEW_SORT_OPTIONS[0];

  /** APOLLO REQUESTS **/

  const {
    data: getAgentData,
    loading: getAgentLoading,
    refetch: getAgentRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "cache-and-network",
    variables: { input: agentId },
    skip: !agentId,
    notifyOnNetworkStatusChange: true,
  });

  const agent: Member | undefined = getAgentData?.getMember;

  const { data: getReviewsData, refetch: getReviewsRefetch } = useQuery(
    GET_REVIEWS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: reviewPage,
          limit: REVIEWS_PER_PAGE,
          sort: activeReviewSort.sort,
          direction: activeReviewSort.direction,
          search: {
            reviewGroup: ReviewGroup.AGENT,
            reviewRefId: agentId,
          },
        },
      },
      skip: !agentId,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [createNewReview] = useMutation(CREATE_NEW_REVIEW);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const reviews: Review[] = getReviewsData?.getReviews?.list ?? [];
  const reviewStats: ReviewStats | undefined =
    getReviewsData?.getReviews?.stats;
  const reviewTotal =
    getReviewsData?.getReviews?.metaCounter?.[0]?.total ??
    reviewStats?.totalReviews ??
    0;
  const reviewPageCount = Math.ceil(reviewTotal / REVIEWS_PER_PAGE);
  const reviewDistribution = (reviewStats?.ratingDistribution ?? []).map(
    (entry, index) => ({
      label: DISTRIBUTION_ROWS[index]?.label ?? `${entry.star} stars`,
      tone: DISTRIBUTION_ROWS[index]?.tone ?? "cool",
      percent: entry.percentage,
    }),
  );
  const positivePercent = (reviewStats?.ratingDistribution ?? [])
    .filter((entry) => entry.star >= 4)
    .reduce((sum, entry) => sum + entry.percentage, 0);

  /** LIFECYCLES **/

  useEffect(() => {
    if (router.query.writeReview === "true") {
      setTimeout(() => {
        writeReviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [router.query.writeReview]);

  /** HANDLERS **/

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(
      0,
      MAX_REVIEW_IMAGES - reviewImages.length,
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReviewImages((prev) =>
          prev.length >= MAX_REVIEW_IMAGES
            ? prev
            : [...prev, { file, preview: ev.target?.result as string }],
        );
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWriteReviewSubmit = async () => {
    if (!writeReviewRating || !agentId) return;
    if (!user?._id) {
      await sweetMixinErrorAlert(Messages.error2);
      return;
    }

    setReviewSubmitting(true);
    try {
      let uploadedImages: string[] = [];
      if (reviewImages.length) {
        try {
          const { data } = await imagesUploader({
            variables: {
              files: reviewImages.map((image) => image.file),
              target: "review",
            },
          });
          uploadedImages = (data?.imagesUploader ?? []).filter(Boolean);
        } catch (err: any) {
          // A failed upload shouldn't lose the written review.
          console.log("ERROR, review imagesUploader:", err.message);
        }
      }

      await createNewReview({
        variables: {
          input: {
            reviewGroup: ReviewGroup.AGENT,
            reviewRefId: agentId,
            reviewRating: writeReviewRating,
            ...(writeReviewText.trim()
              ? { reviewMessage: writeReviewText.trim() }
              : {}),
            ...(uploadedImages.length ? { reviewImages: uploadedImages } : {}),
          },
        },
      });

      setReviewSubmitted(true);
      setReviewPage(1);
      await getReviewsRefetch();
      // The agent rating / review counter are recomputed server-side.
      await getAgentRefetch({ input: agentId });
    } catch (err: any) {
      console.log("ERROR, handleWriteReviewSubmit:", err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewSort(e.target.value as ReviewSortOption);
    setReviewPage(1);
  };

  const toggleExpand = (key: string) => {
    setExpandedReviews((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!agent) {
    return (
      <Stack className="agent-detail-page">
        <Box className="agent-detail-top" />
        <Stack
          className="container"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "40vh" }}
        >
          {getAgentLoading ? (
            <CircularProgress />
          ) : (
            <Typography>Agent not found.</Typography>
          )}
        </Stack>
      </Stack>
    );
  }

  // Agent profiles are optional server-side, so every line falls back to the
  // next best field and the row is dropped when nothing is filled in.
  const agentName = agent.memberFullName || agent.memberUserName;
  const serviceTypes = (agent.memberServiceTypes ?? []).map(prettifyEnum);
  const agentRole =
    agent.memberSpecialty ||
    (serviceTypes.length ? serviceTypes.join(" • ") : "Pet Care Agent");
  // memberExperience is free text and seeded as "0" when unset.
  const experienceYears = Number(agent.memberExperience ?? 0);
  const serviceArea = (agent.memberServiceArea ?? [])
    .map(prettifyEnum)
    .join(", ");
  const certificates = (agent.memberCertificates ?? []).filter(Boolean);

  const handleOpenCertificate = (index: number) => setCertGalleryIndex(index);
  const handleCloseCertificate = () => setCertGalleryIndex(null);
  const handlePreviousCertificate = () =>
    setCertGalleryIndex((prev) =>
      prev === null ? prev : prev === 0 ? certificates.length - 1 : prev - 1,
    );
  const handleNextCertificate = () =>
    setCertGalleryIndex((prev) =>
      prev === null ? prev : prev === certificates.length - 1 ? 0 : prev + 1,
    );

  const infoRows: { icon: ReactNode; text: string }[] = [
    {
      icon: <WorkOutlinedIcon className="agent-detail-info-icon" />,
      text: serviceTypes.join(", "),
    },
    {
      icon: <WorkHistoryOutlinedIcon className="agent-detail-info-icon" />,
      text:
        experienceYears > 0
          ? `${experienceYears}+ year${experienceYears === 1 ? "" : "s"} experience`
          : "",
    },
    {
      icon: <FavoriteOutlinedIcon className="agent-detail-info-icon" />,
      text: agent.memberApproach ?? "",
    },
    {
      icon: <TranslateOutlinedIcon className="agent-detail-info-icon" />,
      text: agent.memberLanguages ?? "",
    },
    {
      icon: <LocationOnOutlinedIcon className="agent-detail-info-icon" />,
      text: serviceArea || (agent.memberAddress ?? ""),
    },
    {
      icon: <AccessTimeOutlinedIcon className="agent-detail-info-icon" />,
      text: agent.memberResponseTime ?? "",
    },
  ].filter((row) => row.text);

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
                src={imageUrl(agent.memberImage, DEFAULT_AVATAR)}
                alt={agentName}
                className="agent-detail-avatar"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.getAttribute("src") !== DEFAULT_AVATAR)
                    img.src = DEFAULT_AVATAR;
                }}
              />
            </Box>

            <Typography className="agent-detail-name">{agentName}</Typography>
            <Typography className="agent-detail-role">{agentRole}</Typography>

            <Stack
              className="agent-detail-rating-row"
              direction="row"
              alignItems="center"
            >
              <Rating
                value={agent.memberRating}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography className="agent-detail-rating-score">
                {agent.memberRating.toFixed(1)}
              </Typography>
              <Typography className="agent-detail-rating-sep">·</Typography>
              <Typography className="agent-detail-rating-count">
                {agent.memberReviews.toLocaleString()} review
                {agent.memberReviews === 1 ? "" : "s"}
              </Typography>
            </Stack>

            <Typography className="agent-detail-bio">
              {agent.memberDesc ||
                "This agent has not added a profile description yet."}
            </Typography>

            {infoRows.length > 0 && (
              <Stack className="agent-detail-info-list">
                {infoRows.map((row) => (
                  <Stack
                    key={row.text}
                    className="agent-detail-info-row"
                    direction="row"
                    alignItems="center"
                  >
                    {row.icon}
                    <Typography className="agent-detail-info-text">
                      {row.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            {/* Certifications */}
            {certificates.length > 0 && (
              <Stack className="agent-detail-certs">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className="agent-detail-certs-title-row"
                >
                  <WorkspacePremiumOutlinedIcon className="agent-detail-certs-icon" />
                  <Typography className="agent-detail-certs-title">
                    Certifications
                  </Typography>
                </Stack>
                <Stack className="agent-detail-certs-grid">
                  {certificates.map((certificate, i) => (
                    <Box
                      key={certificate}
                      className="agent-detail-cert-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenCertificate(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleOpenCertificate(i);
                        }
                      }}
                    >
                      <img
                        src={imageUrl(certificate)}
                        alt={`Certificate ${i + 1}`}
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
                    <Typography className="write-review-success-title">
                      ✓ Thank you for your review!
                    </Typography>
                    <Typography className="write-review-success-sub">
                      Your feedback helps other pet owners find the best agent.
                    </Typography>
                  </Stack>
                ) : (
                  <>
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
                      <Stack
                        className="write-review-images-row"
                        direction="row"
                        flexWrap="wrap"
                      >
                        {reviewImages.map((image, i) => (
                          <Box key={i} className="write-review-img-preview">
                            <img src={image.preview} alt={`upload-${i}`} />
                            <Box
                              className="write-review-img-remove"
                              onClick={() => removeReviewImage(i)}
                            >
                              ✕
                            </Box>
                          </Box>
                        ))}
                        {reviewImages.length < MAX_REVIEW_IMAGES && (
                          <label className="write-review-img-upload">
                            <input
                              hidden
                              type="file"
                              accept="image/png, image/jpeg"
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
                        disabled={!writeReviewRating || reviewSubmitting}
                        onClick={handleWriteReviewSubmit}
                        startIcon={<RateReviewOutlinedIcon />}
                      >
                        {reviewSubmitting ? "Submitting…" : "Submit Review"}
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            )}

            <Stack className="review-summary-panel">
              <Typography className="review-summary-title">
                Client Reviews
              </Typography>

              <Stack
                className="review-score-row"
                direction="row"
                alignItems="center"
              >
                <Rating
                  className="review-rating-stars"
                  value={reviewStats?.averageRating ?? 0}
                  precision={0.1}
                  readOnly
                />
                <Typography className="review-score-count">
                  {(reviewStats?.averageRating ?? 0).toFixed(1)}
                </Typography>
              </Stack>

              <Box className="review-satisfied-box">
                <SentimentSatisfiedAltOutlinedIcon className="review-satisfied-icon" />
                <Typography className="review-satisfied-text">
                  {reviewTotal > 0
                    ? `${positivePercent}% of pet parents rated ${agentName} 4 stars or higher`
                    : "No reviews yet — be the first to share your experience"}
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
              <Stack
                className="review-cards-header"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography className="review-cards-count">
                  {reviewTotal} review{reviewTotal === 1 ? "" : "s"}
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
                  {REVIEW_SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              {reviews.length === 0 ? (
                <Typography className="review-empty-text">
                  This agent has no reviews yet.
                </Typography>
              ) : (
                reviews.map((review) => {
                  const reviewer = review.memberData;
                  const reviewerName =
                    reviewer?.memberFullName || reviewer?.memberUserName || "";
                  const isExpanded = expandedReviews[review._id];
                  const content = review.reviewMessage ?? "";
                  const shouldTruncate = content.length > REVIEW_PREVIEW_LIMIT;
                  const reviewContent =
                    shouldTruncate && !isExpanded
                      ? `${content.slice(0, REVIEW_PREVIEW_LIMIT).trimEnd()}...`
                      : content;
                  const photos = review.reviewImages ?? [];

                  return (
                    <Stack key={review._id} className="review-card">
                      <Stack
                        className="review-card-header"
                        direction="row"
                        alignItems="center"
                      >
                        <Box className="review-card-avatar">
                          {reviewer?.memberImage &&
                          !brokenAvatars[review._id] ? (
                            <img
                              src={imageUrl(reviewer.memberImage)}
                              alt={`${reviewerName} avatar`}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setBrokenAvatars((prev) => ({
                                  ...prev,
                                  [review._id]: true,
                                }))
                              }
                            />
                          ) : (
                            reviewerName.charAt(0).toUpperCase()
                          )}
                        </Box>
                        <Stack className="review-card-user-info">
                          <Typography className="review-card-username">
                            {reviewerName}
                          </Typography>
                          {reviewer?.memberAddress && (
                            <Typography className="review-card-location">
                              {reviewer.memberAddress}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>

                      {reviewer?.createdAt && (
                        <Typography className="review-card-booking-info">
                          Member since{" "}
                          {moment(reviewer.createdAt).format("MMMM YYYY")}
                        </Typography>
                      )}

                      <Stack
                        className="review-card-rating-row"
                        direction="row"
                        alignItems="center"
                      >
                        <Rating
                          value={review.reviewRating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography className="review-card-date">
                          {moment(review.createdAt).format("MMMM D, YYYY")}
                        </Typography>
                      </Stack>

                      {reviewContent && (
                        <Typography className="review-card-content">
                          {reviewContent}
                        </Typography>
                      )}

                      {shouldTruncate && (
                        <Typography
                          className="review-toggle-btn"
                          onClick={() => toggleExpand(review._id)}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </Typography>
                      )}

                      {photos.length > 0 && (
                        <Stack className="review-card-photos" direction="row">
                          {photos.map((photo, i) => (
                            <img
                              key={`${review._id}-photo-${i}`}
                              src={imageUrl(photo)}
                              alt={`Review photo ${i + 1}`}
                              className="review-card-photo"
                            />
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  );
                })
              )}

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

      <Dialog
        className="agent-cert-dialog"
        open={certGalleryIndex !== null}
        onClose={handleCloseCertificate}
        maxWidth="lg"
        transitionDuration={{ enter: 280, exit: 200 }}
        PaperProps={{ className: "agent-cert-dialog-paper" }}
      >
        {certGalleryIndex !== null ? (
          <Stack className="agent-cert-dialog-body">
            <IconButton
              onClick={handleCloseCertificate}
              className="agent-cert-dialog-close"
            >
              <CloseRoundedIcon />
            </IconButton>

            {certificates.length > 1 ? (
              <IconButton
                onClick={handlePreviousCertificate}
                className="agent-cert-dialog-nav prev"
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            ) : null}

            <Stack className="agent-cert-stage">
              <img
                key={certificates[certGalleryIndex]}
                className="agent-cert-stage-image"
                src={imageUrl(certificates[certGalleryIndex])}
                alt={`Certificate ${certGalleryIndex + 1}`}
                draggable={false}
              />
            </Stack>

            {certificates.length > 1 ? (
              <IconButton
                onClick={handleNextCertificate}
                className="agent-cert-dialog-nav next"
              >
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            ) : null}

            {certificates.length > 1 ? (
              <Typography className="agent-cert-dialog-counter">
                {certGalleryIndex + 1} / {certificates.length}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </Dialog>
    </Stack>
  );
};

export default withLayoutBasic(AgentDetail);
