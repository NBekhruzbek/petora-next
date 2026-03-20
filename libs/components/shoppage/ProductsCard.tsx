import { KeyboardEvent, MouseEvent } from "react";
import { Box, Button, Rating, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";
import { useRouter } from "next/router";

export type ProductItem = {
  id: string;
  name: string;
  image: string;
  petType?: string;
  rating: number;
  reviewCount: number;
  sold: number;
  discountedPrice: number;
  price: number;
  liked?: boolean;
};

type ProductsProps = {
  item: ProductItem;
  onToggleLike?: () => void;
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;
const productDetailHref = "/shop/detail";

const ProductsCard = ({ item, onToggleLike }: ProductsProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    void router.push(productDetailHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleLikeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleLike?.();
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
        <Box
          component="button"
          type="button"
          className="like-toggle"
          onClick={handleLikeClick}
          aria-label={item.liked ? "Remove from favorites" : "Add to favorites"}
        >
          {item.liked ? (
            <FavoriteRoundedIcon className="liked" />
          ) : (
            <FavoriteBorderRoundedIcon className="unliked" />
          )}
        </Box>
        {item.petType ? (
          <Box className="pet-type-badge">{item.petType}</Box>
        ) : null}
        <img className="product-image" src={item.image} alt={item.name} />
      </Box>

      <Stack className="card-content">
        <Box className="product-title">{item.name}</Box>

        <Stack className="rating-row" direction="row">
          <Stack className="rating-info" direction="row">
            <Rating
              className="star-rating"
              value={item.rating}
              precision={0.5}
              readOnly
            />
            <Box className="rating-text">
              {item.rating.toFixed(1)} ({item.reviewCount.toLocaleString()}{" "}
              reviews)
            </Box>
          </Stack>
        </Stack>
        <Box className="sold-text">{item.sold.toLocaleString()} Sold</Box>

        <Stack className="price-row" direction="row">
          <Box className="discounted-price">
            {formatPrice(item.discountedPrice)}
          </Box>
          <Box className="origin-price">{formatPrice(item.price)}</Box>
        </Stack>

        <Stack className="actions-row" direction="row">
          <Button
            className="buy-now-btn"
            variant="contained"
            component={Link}
            href={productDetailHref}
            onClick={stopCardClickPropagation}
          >
            Buy Now
          </Button>
          <Button className="cart-btn" onClick={stopCardClickPropagation}>
            <ShoppingCartOutlinedIcon />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductsCard;
