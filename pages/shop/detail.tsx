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
import { GET_PRODUCT, GET_REVIEWS } from "@/apollo/user/query";
import {
  CREATE_NEW_REVIEW,
  IMAGES_UPLOADER,
  LIKE_TARGET_PRODUCT,
} from "@/apollo/user/mutation";
import { Product } from "@/libs/types/product/product";
import { Review, ReviewStats } from "@/libs/types/review/review";
import { ReviewGroup } from "@/libs/enums/review.enum";
import { Direction } from "@/libs/enums/common.enum";
import { userVar } from "@/apollo/store";
import { REACT_APP_API_URL, Messages } from "@/libs/config";
import {
  sweetMixinErrorAlert,
  sweetBottomSmallSuccessAlert,
} from "@/libs/sweetAlert";
import { addToBasket } from "@/libs/basket";
import { flyToBasket } from "@/libs/flyToBasket";
import moment from "moment";

const REVIEWS_PER_PAGE = 5;
const REVIEW_PREVIEW_LIMIT = 260;
const MAX_REVIEW_IMAGES = 4;

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

const imageUrl = (path?: string, fallback = "") =>
  path ? `${REACT_APP_API_URL}/${path}` : fallback;

const Detail = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const productId = router.query.id as string | undefined;

  const writeReviewRef = useRef<HTMLDivElement | null>(null);
  const mainImageRef = useRef<HTMLImageElement | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);
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

  const { data: getReviewsData, refetch: getReviewsRefetch } = useQuery(
    GET_REVIEWS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: reviewPage,
          limit: REVIEWS_PER_PAGE,
          sort: "createdAt",
          direction: Direction.DESC,
          search: {
            reviewGroup: ReviewGroup.PRODUCT,
            reviewRefId: productId,
          },
        },
      },
      skip: !productId,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const [createNewReview] = useMutation(CREATE_NEW_REVIEW);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const reviews: Review[] = getReviewsData?.getReviews?.list ?? [];
  const reviewStats: ReviewStats | undefined =
    getReviewsData?.getReviews?.stats;
  // The product's own productReviews counter is seeded and can disagree with
  // the review documents, so the panel counts what getReviews actually returns.
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
    if (!writeReviewRating || !productId) return;
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
            reviewGroup: ReviewGroup.PRODUCT,
            reviewRefId: productId,
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
      // The product rating / review counter are recomputed server-side.
      await getProductRefetch({ input: productId });
    } catch (err: any) {
      console.log("ERROR, handleWriteReviewSubmit:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setReviewSubmitting(false);
    }
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

  const addToBasketHandler = async () => {
    if (!product) return;
    addToBasket(product, quantity);
    if (!flyToBasket(mainImageRef.current)) {
      await sweetBottomSmallSuccessAlert("Added to basket!", 700);
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
              <img
                ref={mainImageRef}
                src={mainImage}
                alt={product.productName}
              />
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
                <Button
                  className="add-btn"
                  variant="contained"
                  onClick={addToBasketHandler}
                >
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
                  Product Review
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
                      ? `${positivePercent}% of buyers rated this product 4 stars or higher`
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
                {reviews.length === 0 ? (
                  <Typography className="review-empty-text">
                    This product has no reviews yet.
                  </Typography>
                ) : (
                  reviews.map((review) => {
                    const reviewer = review.memberData;
                    const reviewerName =
                      reviewer?.memberFullName ||
                      reviewer?.memberUserName ||
                      "";
                    const isExpanded = expandedReviews[review._id];
                    const content = review.reviewMessage ?? "";
                    const shouldTruncate =
                      content.length > REVIEW_PREVIEW_LIMIT;
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
                            {reviewer?.createdAt && (
                              // Reviews aren't purchase-gated server-side, so a
                              // "verified buyer" caption would be fiction.
                              <Typography className="review-user-purchase">
                                Member since{" "}
                                {moment(reviewer.createdAt).format("MMMM YYYY")}
                              </Typography>
                            )}
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

                          {reviewContent && (
                            <Typography className="review-card-text">
                              {reviewContent}
                            </Typography>
                          )}

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
                  })
                )}

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
