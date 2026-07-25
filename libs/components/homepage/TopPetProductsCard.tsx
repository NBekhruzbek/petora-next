import { KeyboardEvent, MouseEvent } from "react";
import { Box, Rating, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/router";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { Product } from "@/libs/types/product/product";
import { REACT_APP_API_URL, Messages } from "@/libs/config";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import {
  sweetMixinErrorAlert,
  sweetBottomSmallSuccessAlert,
} from "@/libs/sweetAlert";
import { T } from "@/libs/types/common";

interface TopPetProductsProps {
  product: Product;
  getProductsRefetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
}

const formatPrice = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;
const formatCount = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
const productDetailHref = "/shop/detail";

const TopPetProductsCard = (props: TopPetProductsProps) => {
  const { product, getProductsRefetch } = props;
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const discountPercent = product.productDiscount;
  const hasDiscount = discountPercent > 0;
  const currentPrice =
    hasDiscount && product.productPriceAfterDiscount != null
      ? product.productPriceAfterDiscount
      : product.productPrice;
  const myFavorite = Boolean(product?.meLiked?.[0]?.myFavorite);

  /** APOLLO REQUESTS **/

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  /** HANDLERS **/

  const likeProductHandler = async (
    event: MouseEvent<HTMLButtonElement>,
    productId: string,
  ) => {
    // The whole card is a link to the detail page, so keep the like
    // interaction from bubbling up and triggering navigation.
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetProduct({ variables: { input: productId } });

      // Refetch so the local list re-syncs meLiked + productLikes.
      await getProductsRefetch();

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likeProductHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const handleCardClick = () => {
    void router.push(productDetailHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Stack
      className="top-pet-product-card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      <Box className="card-image-wrap">
        <Stack className="like-meta" direction="row">
          <Stack className="meta-item" direction="row">
            <VisibilityOutlinedIcon className="views-icon" />
            <Box className="views-count">
              {formatCount(product.productViews)}
            </Box>
          </Stack>
          <Stack className="meta-item" direction="row">
            <Box
              component="button"
              type="button"
              className="like-toggle"
              onClick={(event: MouseEvent<HTMLButtonElement>) =>
                likeProductHandler(event, product._id)
              }
            >
              {myFavorite ? (
                <FavoriteRoundedIcon className="liked" />
              ) : (
                <FavoriteBorderRoundedIcon className="unliked" />
              )}
            </Box>
            <Box className="like-count">{product.productLikes}</Box>
          </Stack>
        </Stack>
        {product.productPetType ? (
          <Box className="pet-type-badge">{product.productPetType}</Box>
        ) : null}
        <img
          className="product-image"
          src={`${REACT_APP_API_URL}/${product?.productImages[0]}`}
          alt={product.productName}
        />
      </Box>

      <Stack className="card-content">
        <Box className="product-title">{product.productName}</Box>

        <Stack className="rating-row" direction="row" alignItems="center">
          <Rating
            className="star-rating"
            value={product.productRating}
            precision={0.5}
            readOnly
            size="small"
          />
          <Box className="rating-value">{product.productRating.toFixed(1)}</Box>
          <Box className="review-count">
            ({product.productReviews.toLocaleString()} reviews)
          </Box>
          <Box className="rating-sep">·</Box>
          <Box className="sold-count">
            {formatCount(product.productSoldTimes)} sold
          </Box>
        </Stack>

        <Stack className="price-row" direction="row">
          <Box className="discounted-price">{formatPrice(currentPrice)}</Box>
          {hasDiscount ? (
            <>
              <Box className="discount-percent">
                -{discountPercent}% <span className="off-text">OFF</span>
              </Box>
              <Box className="origin-price">
                {formatPrice(product.productPrice)}
              </Box>
            </>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetProductsCard;
