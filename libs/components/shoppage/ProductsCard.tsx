import { KeyboardEvent, MouseEvent, useRef } from "react";
import { Box, Button, Rating, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { Product } from "@/libs/types/product/product";
import { userVar } from "@/apollo/store";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { REACT_APP_API_URL, Messages } from "@/libs/config";
import {
  sweetMixinErrorAlert,
  sweetBottomSmallSuccessAlert,
} from "@/libs/sweetAlert";
import { addToBasket } from "@/libs/basket";
import { flyToBasket } from "@/libs/flyToBasket";
import { T } from "@/libs/types/common";

interface ProductsCardProps {
  product: Product;
  getProductsRefetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
  // Fallback like state for lists where every item is known to be favorited
  // (e.g. the favorites page) and the API doesn't return a per-member meLiked.
  defaultFavorite?: boolean;
}

const formatPrice = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;
const formatCount = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
const productDetailHref = "/shop/detail";

const ProductsCard = ({
  product,
  getProductsRefetch,
  defaultFavorite,
}: ProductsCardProps) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const imageRef = useRef<HTMLImageElement>(null);

  const discountPercent = product.productDiscount;
  const hasDiscount = discountPercent > 0;
  const currentPrice =
    hasDiscount && product.productPriceAfterDiscount != null
      ? product.productPriceAfterDiscount
      : product.productPrice;
  const myFavorite =
    product?.meLiked?.[0]?.myFavorite ?? Boolean(defaultFavorite);
  const detailLink = `${productDetailHref}?id=${product._id}`;

  /** APOLLO REQUESTS **/

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  /** HANDLERS **/

  const likeProductHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    // The whole card is a link to the detail page, so keep the like
    // interaction from bubbling up and triggering navigation.
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetProduct({ variables: { input: product._id } });

      // Refetch so the list re-syncs meLiked + productLikes.
      await getProductsRefetch();

      await sweetBottomSmallSuccessAlert("Success!", 700);
    } catch (err: any) {
      console.log("ERROR, likeProductHandler:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const addToBasketHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToBasket(product);
    if (!flyToBasket(imageRef.current)) {
      await sweetBottomSmallSuccessAlert("Added to basket!", 700);
    }
  };

  const handleCardClick = () => {
    void router.push(detailLink);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const stopCardClickPropagation = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement>,
  ) => {
    event.stopPropagation();
  };

  return (
    <Stack
      className="product-card"
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
              onClick={likeProductHandler}
              aria-label={
                myFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {myFavorite ? (
                <FavoriteRoundedIcon className="liked" />
              ) : (
                <FavoriteBorderRoundedIcon className="unliked" />
              )}
            </Box>
            <Box className="like-count">
              {formatCount(product.productLikes)}
            </Box>
          </Stack>
        </Stack>
        {product.productPetType ? (
          <Box className="pet-type-badge">{product.productPetType}</Box>
        ) : null}
        <img
          ref={imageRef}
          className="product-image"
          src={`${REACT_APP_API_URL}/${product?.productImages?.[0]}`}
          alt={product.productName}
        />
      </Box>

      <Stack className="card-content">
        <Box className="product-title">{product.productName}</Box>

        <Stack className="rating-row" direction="row">
          <Stack className="rating-info" direction="row">
            <Rating
              className="star-rating"
              value={product.productRating}
              precision={0.5}
              readOnly
            />
            <Box className="rating-text">
              {product.productRating.toFixed(1)} (
              {product.productReviews.toLocaleString()} reviews)
            </Box>
          </Stack>
        </Stack>
        <Box className="sold-text">
          {product.productSoldTimes.toLocaleString()} Sold
        </Box>

        <Stack className="price-row" direction="row">
          <Box className="discounted-price">{formatPrice(currentPrice)}</Box>
          {hasDiscount ? (
            <>
              <Box className="discount-percent">-{discountPercent}%</Box>
              <Box className="origin-price">
                {formatPrice(product.productPrice)}
              </Box>
            </>
          ) : null}
        </Stack>

        <Stack className="actions-row" direction="row">
          <Button
            className="buy-now-btn"
            variant="contained"
            component={Link}
            href={detailLink}
            onClick={stopCardClickPropagation}
          >
            See Product
          </Button>
          <Button
            className="cart-btn"
            onClick={addToBasketHandler}
            aria-label={`Add ${product.productName} to basket`}
          >
            <ShoppingCartOutlinedIcon />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductsCard;
