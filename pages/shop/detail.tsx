import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Pagination,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import RelatedServices from "@/libs/components/servicepage/RelatedServices";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

const Detail = () => {
  const product = {
    name: "ROYAL CANIN - CARE DIGEST",
    petType: "Dogs",
    rating: 4.5,
    reviewCount: 618,
    discountedPrice: 39.99,
    price: 49.99,
    stockLeft: 7,
    views: 382,
    likes: 232,
  };
  const productInformation = [
    { label: "Category", value: "Cat Food" },
    { label: "Remaining Quantity", value: "12342" },
    { label: "Brand", value: "Kit cat" },
  ];
  const productBenefits = [
    {
      title: "Supports Healthy Skin and Coat",
      description:
        "The Omega-3 and Omega-6 fatty acids promote shiny fur and healthy skin.",
    },
    {
      title: "Boosts Vitality",
      description:
        "Taurine and prebiotic vitamins enhance your cat's energy, vision, and immune health.",
    },
    {
      title: "Optimal Digestion",
      description:
        "The prebiotic content improves gut health for better digestion and nutrient absorption.",
    },
    {
      title: "Irresistible Taste",
      description:
        "The savory flavor and dried fish flakes make mealtime a joy for picky eaters.",
    },
  ];
  const reviewSummary = {
    title: "Product Review",
    rating: 4,
    totalReviews: 245,
    satisfiedText: "More than 200 customers are satisfied",
  };
  const reviewDistribution = [
    { label: "Excellent", percent: 79, tone: "warm" },
    { label: "Good", percent: 10, tone: "warm" },
    { label: "Average", percent: 4, tone: "cool" },
    { label: "Poor", percent: 3, tone: "cool" },
    { label: "Bad", percent: 4, tone: "cool" },
  ];
  const reviewCards = [
    {
      userName: "Astro Ridge",
      location: "United States",
      purchaseInfo: "Verified buyer • Buying for over 1 year",
      rating: 2,
      date: "July 20, 2023",
      content:
        "We have shipped thousands of pet-care orders with this formula, and this is one of the few foods our cats consistently finish. The texture is soft, the flakes smell fresh, and even picky eaters in our home adjusted quickly after just a few meals.",
      photos: [
        "/img/services/grooming.jpg",
        "/img/services/walking.jpg",
        "/img/services/training.jpg",
      ],
    },
    {
      userName: "The Pond Shop",
      location: "United States",
      purchaseInfo: "Verified buyer • Repeat order",
      rating: 3,
      date: "March 29, 2023",
      content:
        "Customer service was smooth and shipping was fast. The product quality feels premium, although one of our cats needed a short transition period before fully enjoying it. After a week, appetite and digestion both looked much better.",
      photos: ["/img/services/boarding.png", "/img/services/day-care.jpg"],
    },
    {
      userName: "Mia Carter",
      location: "Canada",
      purchaseInfo: "Verified buyer • First purchase",
      rating: 5,
      date: "January 11, 2024",
      content:
        "Packaging arrived clean and sealed, portion size is practical, and the ingredient profile gave me confidence. My senior cat usually refuses new food, but this one worked surprisingly well and left no stomach issues.",
      photos: [],
    },
    {
      userName: "Ethan Brooks",
      location: "Australia",
      purchaseInfo: "Verified buyer • Monthly subscriber",
      rating: 4,
      date: "December 03, 2023",
      content:
        "The ingredient balance looks much better than the previous brand we used, and our cats transitioned without any stress. We also noticed less leftover food in the bowls and more consistent energy during the day. Delivery packaging was sturdy and the bag stayed fresh after opening.",
      photos: ["/img/services/training.jpg", "/img/services/day-care.jpg"],
    },
    {
      userName: "Olivia Chen",
      location: "Singapore",
      purchaseInfo: "Verified buyer • Cat parent of 3",
      rating: 5,
      date: "November 18, 2023",
      content:
        "Flavor acceptance was excellent from the first serving. I appreciate that the flakes are easy to mix with other meals and the smell is not overpowering. One of my cats usually has a sensitive stomach, but this food has been gentle so far and the stools stayed normal.",
      photos: ["/img/services/grooming.jpg"],
    },
    {
      userName: "Liam Foster",
      location: "United Kingdom",
      purchaseInfo: "Verified buyer • Reordered twice",
      rating: 4,
      date: "October 02, 2023",
      content:
        "Solid quality overall. The package arrived on time, the food looked fresh, and the feeding instructions were clear. I would have liked a slightly larger value pack option, but for quality and consistency this one has still been worth it for our home.",
      photos: [],
    },
  ];
  const images = [
    "/img/services/training.jpg",
    "/img/services/grooming.jpg",
    "/img/services/walking.jpg",
    "/img/services/boarding.png",
  ];
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(312);
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const reviewPreviewLimit = 260;
  const reviewsPerPage = 5;
  const reviewPageCount = Math.ceil(reviewCards.length / reviewsPerPage);
  const paginatedReviews = reviewCards.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage,
  );

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleReviewPageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setReviewPage(page);
  };

  return (
    <Stack className="product-detail-section">
      <Box className={"detail-top"}></Box>
      <Stack className="container">
        <Typography className="breadcrumb">Home / Shop / Detail</Typography>

        <Stack className="product-detail-grid">
          <Stack className="gallery">
            <Box className="main-image">
              <img src={images[selectedImage]} alt="Training service" />
            </Box>
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
          </Stack>

          <Stack className="shopping-sidebar">
            <Paper className="shopping-card" elevation={0}>
              <Typography className="title">{product.name}</Typography>
              <Box className={"pet-type"}>{product.petType}</Box>
              <Stack className="rating-row" direction="row">
                <Stack className="rating-info" direction="row">
                  <Rating
                    className="star-rating"
                    value={product.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Box className="rating-text">
                    {product.rating.toFixed(1)}{" "}
                    <span className="reviews">
                      ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  </Box>
                </Stack>
              </Stack>

              <Stack className="price-section">
                <Box className={"price-after-discount"}>
                  ${product.discountedPrice.toFixed(2)}
                </Box>
                <Box className={"price-before-discount"}>
                  ${product.price.toFixed(2)}
                </Box>
                <Box className={"saving-price"}>
                  Save ${(product.price - product.discountedPrice).toFixed(2)}
                </Box>
              </Stack>

              <Box className={"stock-text"}>
                <VerifiedOutlinedIcon /> In Stock{" "}
                <span className="stock-left">
                  (only {product.stockLeft} left!)
                </span>
              </Box>

              <Stack>
                <Typography className="short-desc-title">
                  Short description:
                </Typography>
                <Typography className="short-desc-text">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea,
                  rem minus aliquam ullam illo excepturi nihil quas! Maiores
                  provident perspiciatis vero, nesciunt labore tempore.
                </Typography>
              </Stack>

              <Stack className="quantity-views-likes">
                <Box className={"views-likes"}>
                  {" "}
                  <VisibilityIcon className="view-icon" /> {product.views} views
                </Box>
                <Box className={"views-likes"}>
                  {" "}
                  <IconButton
                    className="like-button"
                    aria-label="Add to favorites"
                    aria-pressed={liked}
                    onClick={() => {
                      const nextLiked = !liked;
                      setLiked(nextLiked);
                      setLikeCount((count) =>
                        Math.max(0, count + (nextLiked ? 1 : -1)),
                      );
                    }}
                  >
                    {liked ? (
                      <FavoriteIcon
                        className="heart-icon liked-icon"
                        fontSize="small"
                      />
                    ) : (
                      <FavoriteBorderOutlinedIcon
                        className="heart-icon"
                        fontSize="small"
                      />
                    )}
                  </IconButton>
                  {likeCount} likes
                </Box>
              </Stack>

              <Stack className="cta-row">
                <Stack className="quantity">
                  <Button className="button" onClick={decrease}>
                    <RemoveOutlinedIcon className="dec-inc-icon" />
                  </Button>
                  <span>{quantity}</span>
                  <Button className="button" onClick={increase}>
                    <AddOutlinedIcon className="dec-inc-icon" />
                  </Button>
                </Stack>
                <Button className="add-btn" variant="contained">
                  Add to cart
                </Button>
                <Button className="pay-btn" variant="contained">
                  Pay
                </Button>
              </Stack>
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
                  Product Detail
                </span>
              }
            />
            <Tab
              label={
                <span className="tab-label">
                  <RateReviewOutlinedIcon className="tab-icon" />
                  Review
                </span>
              }
            />
          </Tabs>

          {value === 0 && (
            <Stack className="detail-tab-panel">
              <Stack className="detail-content">
                <Stack className="detail-block">
                  <Typography className="detail-block-title">
                    Information
                  </Typography>
                  <Stack className="detail-info-grid">
                    {productInformation.map((item) => (
                      <Box key={item.label} className="detail-info-row">
                        <Typography className="detail-info-label">
                          {item.label}
                          {" :"}
                        </Typography>
                        <Typography className="detail-info-value">
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>

                <Stack className="detail-block">
                  <Typography className="detail-block-title">
                    Product description
                  </Typography>
                  <Typography className="detail-description-text">
                    Kit Cat Fillet O&apos; Flakes is a premium and complete cat
                    food specially crafted for adult cats over 1 year old. This
                    formula combines savory taste with top-quality dried fish
                    flakes, ensuring a delectable and nutritious meal for your
                    feline friend. Enriched with Omega-3, Omega-6, taurine,
                    prebiotic vitamins, and free from pork or lard, it supports
                    your cat&apos;s overall health and well-being. Each pack is
                    designed for freshness with convenient 1kg bags.
                  </Typography>
                </Stack>

                <Stack className="detail-block">
                  <Typography className="detail-block-title">
                    Benefits
                  </Typography>
                  <Stack className="detail-benefits-list">
                    {productBenefits.map((benefit) => (
                      <Box key={benefit.title} className="detail-benefit-item">
                        <Typography className="detail-benefit-title">
                          {benefit.title}:
                        </Typography>
                        <Typography className="detail-benefit-text">
                          {benefit.description}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}

          {value === 1 && (
            <Stack className="detail-tab-panel review-tab-panel">
              <Stack className="review-summary-panel">
                <Typography className="review-summary-title">
                  {reviewSummary.title}
                </Typography>

                <Stack className="review-score-row">
                  <Rating
                    className="review-rating-stars"
                    value={reviewSummary.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography className="review-score-count">
                    {reviewSummary.totalReviews}
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
                            {review.purchaseInfo}
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
      {/* Other Products may You Like component develop*/}
    </Stack>
  );
};

export default withLayoutBasic(Detail);
