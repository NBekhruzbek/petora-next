import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import TextField from "@mui/material/TextField";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import RelatedProducts from "@/libs/components/shoppage/RelatedProducts";
import { GET_PRODUCT } from "@/apollo/user/query";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { Product } from "@/libs/types/product/product";
import { userVar } from "@/apollo/store";
import { REACT_APP_API_URL, Messages } from "@/libs/config";
import { sweetMixinErrorAlert } from "@/libs/sweetAlert";

const formatPrice = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;

const Detail = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const productId = router.query.id as string | undefined;

  // Reviews are not yet exposed by the API, so this section keeps sample
  // content until a review query exists.
  const reviewSummary = {
    title: "Product Review",
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

  const writeReviewRef = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);
  const [writeReviewRating, setWriteReviewRating] = useState<number | null>(
    null,
  );
  const [writeReviewText, setWriteReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  /** APOLLO REQUESTS **/

  const {
    data: getProductData,
    loading: getProductLoading,
    refetch: getProductRefetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "cache-and-network",
    variables: { input: productId },
    skip: !productId,
    notifyOnNetworkStatusChange: true,
  });

  const product: Product | undefined = getProductData?.getProduct;

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  /** LIFECYCLES **/

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

  // Reset the selected gallery image whenever a new product loads.
  useEffect(() => {
    setSelectedImage(0);
  }, [product?._id]);

  /** HANDLERS **/

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

  const handleWriteReviewSubmit = () => {
    if (!writeReviewRating) return;
    setReviewSubmitted(true);
  };

  const likeProductHandler = async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (!product?._id) return;

      await likeTargetProduct({ variables: { input: product._id } });
      await getProductRefetch({ input: productId });
    } catch (err: any) {
      console.log("ERROR, likeProductHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

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

  const reviewPreviewLimit = 260;
  const reviewsPerPage = 5;
  const reviewPageCount = Math.ceil(reviewCards.length / reviewsPerPage);
  const paginatedReviews = reviewCards.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage,
  );

  if (!product) {
    return (
      <Stack className="product-detail-section">
        <Box className={"detail-top"}></Box>
        <Stack
          className="container"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "40vh" }}
        >
          {getProductLoading ? (
            <CircularProgress />
          ) : (
            <Typography>Product not found.</Typography>
          )}
        </Stack>
      </Stack>
    );
  }

  const hasDiscount = product.productDiscount > 0;
  const currentPrice =
    hasDiscount && product.productPriceAfterDiscount != null
      ? product.productPriceAfterDiscount
      : product.productPrice;
  const savings = product.productPrice - currentPrice;
  const myFavorite = Boolean(product?.meLiked?.[0]?.myFavorite);

  const images = product.productImages?.length
    ? product.productImages.map((image) => `${REACT_APP_API_URL}/${image}`)
    : ["/img/products/royal-canin.png"];
  const mainImage = images[selectedImage] ?? images[0];

  const productInformation = [
    { label: "Category", value: product.productType },
    { label: "Pet Type", value: product.productPetType },
    { label: "Brand", value: product.productBrand || "—" },
    { label: "Remaining Quantity", value: String(product.productQuantity) },
  ];

  return (
    <Stack className="product-detail-section">
      <Box className={"detail-top"}></Box>
      <Stack className="container">
        <Typography className="breadcrumb">Home / Shop / Detail</Typography>

        <Stack className="product-detail-grid">
          <Stack className="gallery">
            <Box className="main-image">
              <img src={mainImage} alt={product.productName} />
            </Box>
            <Stack className="thumbs">
              {images.map((src, index) => (
                <ButtonBase
                  key={`${src}-${index}`}
                  className={`thumb ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={src} alt={`${product.productName} ${index + 1}`} />
                </ButtonBase>
              ))}
            </Stack>
          </Stack>

          <Stack className="shopping-sidebar">
            <Paper className="shopping-card" elevation={0}>
              <Typography className="title">{product.productName}</Typography>
              <Box className={"pet-type"}>{product.productPetType}</Box>
              <Stack className="rating-row" direction="row">
                <Stack className="rating-info" direction="row">
                  <Rating
                    className="star-rating"
                    value={product.productRating}
                    precision={0.5}
                    readOnly
                  />
                  <Box className="rating-text">
                    {product.productRating.toFixed(1)}{" "}
                    <span className="reviews">
                      ({product.productReviews.toLocaleString()} reviews)
                    </span>
                  </Box>
                </Stack>
              </Stack>

              <Stack className="price-section">
                <Box className={"price-after-discount"}>
                  {formatPrice(currentPrice)}
                </Box>
                {hasDiscount ? (
                  <>
                    <Box className={"price-before-discount"}>
                      {formatPrice(product.productPrice)}
                    </Box>
                    <Box className={"saving-price"}>
                      Save {formatPrice(savings)}
                    </Box>
                  </>
                ) : null}
              </Stack>

              <Box className={"stock-text"}>
                <VerifiedOutlinedIcon />{" "}
                {product.productQuantity > 0 ? (
                  <>
                    In Stock{" "}
                    <span className="stock-left">
                      (only {product.productQuantity} left!)
                    </span>
                  </>
                ) : (
                  <span className="stock-left">Out of stock</span>
                )}
              </Box>

              <Stack>
                <Typography className="short-desc-title">
                  Short description:
                </Typography>
                <Typography className="short-desc-text">
                  {product.productShortDesc}
                </Typography>
              </Stack>

              <Stack className="quantity-views-likes">
                <Box className={"views-likes"}>
                  {" "}
                  <VisibilityIcon className="view-icon" />{" "}
                  {product.productViews} views
                </Box>
                <Box className={"views-likes"}>
                  {" "}
                  <IconButton
                    className="like-button"
                    aria-label="Add to favorites"
                    aria-pressed={myFavorite}
                    onClick={likeProductHandler}
                  >
                    {myFavorite ? (
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
                  {product.productLikes} likes
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
                    {product.productDesc}
                  </Typography>
                </Stack>

                {product.productBenefits ? (
                  <Stack className="detail-block">
                    <Typography className="detail-block-title">
                      Benefits
                    </Typography>
                    <Typography className="detail-description-text">
                      {product.productBenefits}
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>
            </Stack>
          )}

          {value === 1 && (
            <Stack className="detail-tab-panel review-tab-panel">
              {router.query.writeReview === "true" && (
                <Stack className="write-review-panel" ref={writeReviewRef}>
                  {reviewSubmitted ? (
                    <Stack className="write-review-success">
                      <Typography className="write-review-success-title">
                        ✓ Thank you for your review!
                      </Typography>
                      <Typography className="write-review-success-sub">
                        Your feedback helps other pet owners find the best
                        products.
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
                          placeholder="Share your experience with this product..."
                          value={writeReviewText}
                          onChange={(e) => setWriteReviewText(e.target.value)}
                          className="write-review-textfield"
                        />
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
                    value={product.productRating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography className="review-score-count">
                    {product.productReviews}
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
      <RelatedProducts />
    </Stack>
  );
};

export default withLayoutBasic(Detail);
