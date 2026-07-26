import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import {
  GET_MEMBER,
  GET_MY_BOOKINGS,
  GET_REVIEWS,
  GET_SERVICE,
} from "@/apollo/user/query";
import {
  CREATE_NEW_BOOKING,
  CREATE_NEW_REVIEW,
  IMAGES_UPLOADER,
  LIKE_TARGET_SERVICE,
} from "@/apollo/user/mutation";
import { Service } from "@/libs/types/service/service";
import { Member } from "@/libs/types/member/member";
import { Review, ReviewStats } from "@/libs/types/review/review";
import { BookedInfo } from "@/libs/types/booking/booking";
import { BookingPetType, BookingStatus } from "@/libs/enums/booking.enum";
import { ReviewGroup } from "@/libs/enums/review.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages, REACT_APP_API_URL } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

// Agents cannot publish per-day opening hours yet, so bookable slots are
// generated across a fixed working window using the service duration.
const WORKING_HOURS = { start: "09:00", end: "18:00" };

const REVIEWS_PER_PAGE = 3;
const REVIEW_PREVIEW_LIMIT = 260;
const MAX_REVIEW_IMAGES = 4;

const PET_TYPE_OPTIONS: { value: BookingPetType; label: string }[] = [
  { value: BookingPetType.DOG, label: "Dog" },
  { value: BookingPetType.CAT, label: "Cat" },
  { value: BookingPetType.BIRD, label: "Bird" },
  { value: BookingPetType.RABBIT, label: "Rabbit" },
  { value: BookingPetType.HAMSTER, label: "Hamster" },
  { value: BookingPetType.OTHER, label: "Other" },
];

const PET_AGE_OPTIONS = [
  { value: "Under 1 year", label: "Under 1 yr" },
  { value: "1–3 years", label: "1–3 yrs" },
  { value: "3–7 years", label: "3–7 yrs" },
  { value: "7+ years", label: "7+ yrs" },
];

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

const formatPrice = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;

// Enum values arrive as tokens ("DAY_CARE", "JEONJU") — render them as words.
const prettifyEnum = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const toClock = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const imageUrl = (path?: string, fallback = "") =>
  path ? `${REACT_APP_API_URL}/${path}` : fallback;

const Booking = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const serviceId = router.query.id as string | undefined;

  const writeReviewRef = useRef<HTMLDivElement | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [openItems, setOpenItems] = useState([false, false, false, false]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState("");
  const [value, setValue] = useState(0);

  // Booking dialog
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState<BookingPetType | "">("");
  const [petAge, setPetAge] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [petErrors, setPetErrors] = useState({ petName: "", petType: "" });
  const [bookingRef, setBookingRef] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Reviews
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSort, setReviewSort] = useState<ReviewSortOption>("newest");
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [writeReviewRating, setWriteReviewRating] = useState<number | null>(
    null,
  );
  const [writeReviewText, setWriteReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  // The picked files are kept alongside their data-URL preview so the images
  // can be uploaded on submit while still rendering instantly.
  const [reviewImages, setReviewImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const activeReviewSort =
    REVIEW_SORT_OPTIONS.find((option) => option.value === reviewSort) ??
    REVIEW_SORT_OPTIONS[0];

  /** APOLLO REQUESTS **/

  const {
    data: getServiceData,
    loading: getServiceLoading,
    refetch: getServiceRefetch,
  } = useQuery(GET_SERVICE, {
    fetchPolicy: "cache-and-network",
    variables: { input: serviceId },
    skip: !serviceId,
    notifyOnNetworkStatusChange: true,
  });

  const service: Service | undefined = getServiceData?.getService;

  const { data: getAgentData } = useQuery(GET_MEMBER, {
    fetchPolicy: "cache-and-network",
    variables: { input: service?.memberId },
    skip: !service?.memberId,
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
            reviewGroup: ReviewGroup.SERVICE,
            reviewRefId: serviceId,
          },
        },
      },
      skip: !serviceId,
      notifyOnNetworkStatusChange: true,
    },
  );

  // Only the signed-in member's own bookings are readable, so they are used to
  // hide slots they already hold with this agent. Conflicts with other clients
  // are still rejected server-side when the booking is submitted.
  const { data: getMyBookingsData, refetch: getMyBookingsRefetch } = useQuery(
    GET_MY_BOOKINGS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: 1,
          limit: 100,
          sort: "createdAt",
          direction: Direction.DESC,
        },
      },
      skip: !user?._id,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);
  const [createNewBooking] = useMutation(CREATE_NEW_BOOKING);
  const [createNewReview] = useMutation(CREATE_NEW_REVIEW);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const durationMinutes = service?.serviceDurationMinutes || 60;
  const myBookings: BookedInfo[] = getMyBookingsData?.getMyBookings?.list ?? [];

  const takenSlots = useMemo(() => {
    const agentId = service?.memberId;
    if (!agentId) return new Set<string>();
    return new Set(
      myBookings
        .filter(
          (booking) =>
            booking.agentId === agentId &&
            booking.bookingStatus !== BookingStatus.CANCELLED &&
            booking.bookingStatus !== BookingStatus.REJECTED,
        )
        .map((booking) => `${booking.bookingDate}|${booking.bookingTime}`),
    );
  }, [myBookings, service?.memberId]);

  const getAvailableTimeSlots = useCallback(
    (selectedDate: string) => {
      const dayStart = toMinutes(WORKING_HOURS.start);
      const dayEnd = toMinutes(WORKING_HOURS.end);
      const slots: string[] = [];

      // Slots start at intervals equal to the session duration, so a 60 min
      // service gets hourly slots, a 90 min service gets 09:00 / 10:30 / …
      for (
        let start = dayStart;
        start + durationMinutes <= dayEnd;
        start += durationMinutes
      ) {
        const clock = toClock(start);
        if (!takenSlots.has(`${selectedDate}|${clock}`)) slots.push(clock);
      }
      return slots;
    },
    [durationMinutes, takenSlots],
  );

  const availableTimeSlots = useMemo(
    () => getAvailableTimeSlots(date),
    [date, getAvailableTimeSlots],
  );

  const isDateFullyBooked = (day: Moment) =>
    getAvailableTimeSlots(day.format("YYYY-MM-DD")).length === 0;

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

  const agentName = agent?.memberFullName || agent?.memberUserName || "";
  const agentRole =
    agent?.memberSpecialty ||
    agent?.memberServiceTypes?.map(prettifyEnum).filter(Boolean).join(" • ") ||
    prettifyEnum(service?.serviceType);
  // memberExperience is free text and seeded as "0" when unset.
  const agentExperience =
    agent?.memberExperience && agent.memberExperience.trim() !== "0"
      ? `${agent.memberExperience} years experience`
      : "";
  const serviceArea = agent?.memberServiceArea?.length
    ? agent.memberServiceArea.map(prettifyEnum).join(", ")
    : prettifyEnum(service?.serviceLocation);

  /** LIFECYCLES **/

  // Reset the selected gallery image whenever a different service loads.
  useEffect(() => {
    setSelectedImage(0);
  }, [service?._id]);

  // Keep the picked time valid for the currently available slots.
  useEffect(() => {
    setTime((prev) =>
      availableTimeSlots.includes(prev) ? prev : (availableTimeSlots[0] ?? ""),
    );
  }, [availableTimeSlots]);

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

  /** HANDLERS **/

  const toggleDetail = (index: number) => {
    setOpenItems((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const likeServiceHandler = async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (!service?._id) return;

      await likeTargetService({ variables: { input: service._id } });
      await getServiceRefetch({ input: serviceId });

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likeServiceHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const openBookingDialog = async () => {
    // Booking requires a token, so stop guests before they fill in the form.
    if (!user?._id) {
      await sweetMixinErrorAlert(Messages.error2);
      return;
    }
    setBookingStep(1);
    setBookingOpen(true);
  };

  const closeBookingDialog = () => {
    setBookingOpen(false);
    if (bookingStep === 3) {
      setPetName("");
      setPetType("");
      setPetAge("");
      setSpecialNotes("");
      setPetErrors({ petName: "", petType: "" });
      setBookingRef("");
    }
  };

  const handleBookingNext = () => {
    const errors = { petName: "", petType: "" };
    if (!petName.trim()) errors.petName = "Pet name is required";
    if (!petType) errors.petType = "Please select a pet type";
    if (errors.petName || errors.petType) {
      setPetErrors(errors);
      return;
    }
    setPetErrors({ petName: "", petType: "" });
    setBookingStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!service?._id || !petType || !time) return;

    setBookingSubmitting(true);
    try {
      const { data } = await createNewBooking({
        variables: {
          input: {
            serviceId: service._id,
            bookingDate: date,
            bookingTime: time,
            bookingPetType: petType,
            bookingPetName: petName.trim(),
            ...(petAge ? { bookingPetAge: petAge } : {}),
            ...(specialNotes.trim()
              ? { bookingNote: specialNotes.trim() }
              : {}),
          },
        },
      });

      setBookingRef(data?.createNewBooking?.bookingNumber ?? "");
      // Re-sync the booking counter and mark the slot as taken locally.
      await getServiceRefetch({ input: serviceId });
      await getMyBookingsRefetch();
      setBookingStep(3);
    } catch (err: any) {
      // Rejections (e.g. the slot was just taken) are already surfaced by the
      // Apollo error link, so keep the user on the confirm step to retry.
      console.log("ERROR, handleConfirmBooking:", err.message);
    } finally {
      setBookingSubmitting(false);
    }
  };

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
    if (!writeReviewRating || !serviceId) return;
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
            reviewGroup: ReviewGroup.SERVICE,
            reviewRefId: serviceId,
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
      // The service rating / review counter are recomputed server-side.
      await getServiceRefetch({ input: serviceId });
    } catch (err: any) {
      console.log("ERROR, handleWriteReviewSubmit:", err.message);
    } finally {
      setReviewSubmitting(false);
    }
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
    setReviewSort(event.target.value as ReviewSortOption);
    setReviewPage(1);
  };

  if (!service) {
    return (
      <Stack className="booking-section">
        <Box className={"booking-top"}></Box>
        <Stack
          className="container"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "40vh" }}
        >
          {getServiceLoading ? (
            <CircularProgress />
          ) : (
            <Typography>Service not found.</Typography>
          )}
        </Stack>
      </Stack>
    );
  }

  const images = service.serviceImages?.length
    ? service.serviceImages.map((image) => imageUrl(image))
    : ["/img/services/training.jpg"];
  const mainImage = images[selectedImage] ?? images[0];
  const myFavorite = Boolean(service.meLiked?.[0]?.myFavorite);

  const serviceChips = [
    {
      icon: <PlaceOutlinedIcon />,
      label: prettifyEnum(service.serviceLocation),
    },
    { icon: <PetsOutlinedIcon />, label: prettifyEnum(service.serviceType) },
  ];

  const basicInformation = [
    { label: "Agent Name", value: agentName || "—" },
    { label: "Role / Specialty", value: agentRole || "—" },
    { label: "Experience", value: agentExperience || "—" },
    { label: "Approach", value: agent?.memberApproach || "—" },
    { label: "Languages", value: agent?.memberLanguages || "—" },
  ];

  const bookingHighlights = [
    {
      title: "Location",
      value: prettifyEnum(service.serviceLocation),
      description: serviceArea
        ? `Service coverage includes ${serviceArea}.`
        : "Service coverage is confirmed with the agent after booking.",
    },
    {
      title: "Pricing",
      value: `${formatPrice(service.servicePrice)} / session`,
      description: `Each ${prettifyEnum(service.serviceType).toLowerCase()} session runs ${durationMinutes} minutes.`,
    },
  ];

  const certificateImages = (agent?.memberCertificates ?? []).filter(Boolean);

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
                  key={`${src}-${index}`}
                  className={`thumb ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={src} alt={`${service.serviceTitle} ${index + 1}`} />
                </ButtonBase>
              ))}
            </Stack>

            <Box className="main-image">
              <img src={mainImage} alt={service.serviceTitle} />
            </Box>
          </Stack>

          <Stack className="booking-sidebar">
            {/* ── Booking card ── */}
            <Paper className="booking-card" elevation={0}>
              {/* Views is listing metadata rather than a credential, so it sits
                  on the title line instead of in the rating row below. */}
              <Stack
                className="booking-card-head"
                direction="row"
                alignItems="flex-start"
              >
                <Typography className="title">
                  {service.serviceTitle}
                </Typography>
                <Box className="booking-views">
                  <VisibilityOutlinedIcon aria-hidden="true" />
                  <span>
                    {service.serviceViews.toLocaleString()} view
                    {service.serviceViews === 1 ? "" : "s"}
                  </span>
                </Box>
              </Stack>
              <Typography className="subtitle">
                All sessions are {durationMinutes} min
              </Typography>

              {/* Rating */}
              <Stack
                className="booking-rating-row"
                direction="row"
                alignItems="center"
              >
                <Rating
                  value={service.serviceRating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography className="booking-rating-score">
                  {service.serviceRating.toFixed(1)}
                </Typography>
                <Typography className="booking-rating-sep">·</Typography>
                <Typography className="booking-rating-count">
                  {service.serviceReviews.toLocaleString()} reviews
                </Typography>
                <Typography className="booking-rating-sep">·</Typography>
                <Typography className="booking-booking-count">
                  {service.serviceBookings.toLocaleString()} booked
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
                {formatPrice(service.servicePrice)}{" "}
                <span className="price-unit">/ session</span>
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
                  Time ({durationMinutes} min session)
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
                  className={`save-favorites-btn ${myFavorite ? "is-liked" : ""}`}
                  fullWidth
                  startIcon={
                    myFavorite ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )
                  }
                  onClick={likeServiceHandler}
                >
                  {myFavorite ? "Saved to favorites" : "Save to favorites"} ·{" "}
                  {service.serviceLikes}
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
                  <Typography>{service.serviceDescription}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* The three panels below are platform-wide booking policy — the
                  API has no per-service field for them. */}
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
                    All pets must be free from parasites and communicable
                    diseases. If a pet poses a risk to others in our care, they
                    will not be accepted at check‑in. We will gladly welcome
                    your pet back once they are healthy.
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
                    src={imageUrl(
                      agent?.memberImage,
                      "/img/profile/defaultUser.png",
                    )}
                    alt={agentName ? `${agentName} profile` : "Agent profile"}
                  />
                </Box>

                <Stack className="agent-overview-content">
                  <Typography className="agent-overview-name">
                    {agentName || "—"}
                  </Typography>
                  <Typography className="agent-overview-role">
                    {agentRole}
                  </Typography>

                  <Stack className="agent-overview-metrics">
                    {agentExperience && (
                      <Box className="agent-metric-chip">{agentExperience}</Box>
                    )}
                    {agent?.memberResponseTime && (
                      <Box className="agent-metric-chip">
                        {agent.memberResponseTime}
                      </Box>
                    )}
                    <Box className="agent-metric-chip">
                      {agent?.memberServices ?? 0} service
                      {agent?.memberServices === 1 ? "" : "s"} listed
                    </Box>
                  </Stack>

                  <Stack className="agent-overview-rating">
                    <Rating
                      value={agent?.memberRating ?? 0}
                      precision={0.1}
                      readOnly
                    />
                    <Typography className="agent-overview-rating-text">
                      {(agent?.memberRating ?? 0).toFixed(1)} rating
                    </Typography>
                    <Typography className="agent-overview-rating-divider">
                      •
                    </Typography>
                    <Typography className="agent-overview-rating-text">
                      {agent?.memberReviews ?? 0} reviews
                    </Typography>
                  </Stack>

                  <Typography className="agent-overview-bio">
                    {agent?.memberDesc ||
                      "This agent has not added a profile description yet."}
                  </Typography>

                  <Stack className="agent-overview-actions">
                    <Typography className="contact-info-title">
                      Contact Information
                    </Typography>
                    {agent?.memberPhone && (
                      <Box className="contact-info-item">
                        <Typography className="contact-info-label">
                          Phone:
                        </Typography>
                        <a
                          href={`tel:${agent.memberPhone.replace(/\s+/g, "")}`}
                          className="contact-info-link"
                        >
                          {agent.memberPhone}
                        </a>
                      </Box>
                    )}
                    {agent?.memberEmail && (
                      <Box className="contact-info-item">
                        <Typography className="contact-info-label">
                          Email:
                        </Typography>
                        <a
                          href={`mailto:${agent.memberEmail}`}
                          className="contact-info-link"
                        >
                          {agent.memberEmail}
                        </a>
                      </Box>
                    )}
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
                    {certificateImages.map((certificate, index) => (
                      <Box key={certificate} className="certificate-card">
                        <Box className="certificate-image-wrap">
                          <img
                            src={imageUrl(certificate)}
                            alt={`Certificate ${index + 1}`}
                            className="certificate-image"
                          />
                        </Box>
                        <Typography className="certificate-title">
                          Certificate {index + 1}
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

                <Stack className="review-score-row">
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
                      ? `${positivePercent}% of pet parents rated this service 4 stars or higher`
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
                <Stack className="review-cards-header">
                  <Typography className="review-cards-count">
                    {reviewTotal} reviews
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

                {reviews.map((review) => {
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
                    <Box key={review._id} className="review-card">
                      <Stack className="review-card-user">
                        <Box className="review-user-avatar">
                          <img
                            src={imageUrl(
                              reviewer?.memberImage,
                              "/img/profile/defaultUser.png",
                            )}
                            alt={`${reviewerName} avatar`}
                          />
                        </Box>
                        <Stack className="review-user-meta">
                          <Typography className="review-user-name">
                            {reviewerName}
                          </Typography>
                          {reviewer?.memberAddress && (
                            <Typography className="review-user-location">
                              {reviewer.memberAddress}
                            </Typography>
                          )}
                          <Typography className="review-user-purchase">
                            Booked {service.serviceTitle} • Verified booking
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack className="review-card-body">
                        <Stack className="review-card-top">
                          <Rating
                            className="review-card-stars"
                            value={review.reviewRating}
                            precision={0.5}
                            readOnly
                          />
                          <Typography className="review-card-date">
                            {moment(review.createdAt).format("MMMM D, YYYY")}
                          </Typography>
                        </Stack>

                        {photos.length > 0 && (
                          <Stack className="review-photo-list">
                            {photos.map((photo, index) => (
                              <Box
                                key={`${review._id}-photo-${index}`}
                                className="review-photo-item"
                              >
                                <img
                                  src={imageUrl(photo)}
                                  alt={`${reviewerName} review photo ${index + 1}`}
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
                                [review._id]: !prev[review._id],
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
                <img src={mainImage} alt={service.serviceTitle} />
              </Box>
              <Stack gap="2px">
                <Typography className="booking-summary-name">
                  {service.serviceTitle}
                  {agentName ? ` with ${agentName}` : ""}
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
                  {formatPrice(service.servicePrice)} / session
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
                  {PET_TYPE_OPTIONS.map(({ value: petTypeValue, label }) => (
                    <Box
                      key={petTypeValue}
                      className={`pet-chip ${petType === petTypeValue ? "selected" : ""}`}
                      onClick={() => {
                        setPetType(petTypeValue);
                        setPetErrors((p) => ({ ...p, petType: "" }));
                      }}
                    >
                      <span>{label}</span>
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
                  {PET_AGE_OPTIONS.map(({ value: ageValue, label }) => (
                    <Box
                      key={ageValue}
                      className={`pet-chip ${petAge === ageValue ? "selected" : ""}`}
                      onClick={() => setPetAge(ageValue)}
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
                  {service.serviceTitle}
                </Typography>
              </Stack>
              <Stack className="confirm-row">
                <Typography className="confirm-label">Agent</Typography>
                <Typography className="confirm-value">
                  {agentName || "—"}
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
                  {petName} · {prettifyEnum(petType)}
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
                <Typography className="confirm-total-value">
                  {formatPrice(service.servicePrice)}
                </Typography>
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
                disabled={bookingSubmitting}
              >
                Back
              </Button>
              <Button
                className="btn-booking-confirm"
                onClick={handleConfirmBooking}
                disabled={bookingSubmitting}
                fullWidth
              >
                {bookingSubmitting ? "Sending request…" : "Confirm Booking"}
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
            {bookingRef && (
              <Typography className="booking-success-ref">
                Ref: {bookingRef}
              </Typography>
            )}
            <Typography className="booking-success-msg">
              Your request has been sent{agentName ? ` to ${agentName}` : ""}{" "}
              for {moment(date).format("MMMM D, YYYY")} at {time}. The agent
              will review and accept your booking shortly. You'll be notified
              once it's confirmed.
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
