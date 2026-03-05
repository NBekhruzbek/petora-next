import { Box, Button, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Link from "next/link";

export type TopPetProductItem = {
  id: string;
  name: string;
  image: string;
  rating: number;
  sold: number;
  discountedPrice: number;
  price: number;
  liked?: boolean;
};

type TopPetProductsProps = {
  item: TopPetProductItem;
  onToggleLike?: () => void;
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

const TopPetProductsCard = ({ item, onToggleLike }: TopPetProductsProps) => {
  return (
    <Stack className="top-pet-product-card">
      <Box className="card-image-wrap">
        <Box
          component="button"
          type="button"
          className="like-toggle"
          onClick={onToggleLike}
          aria-label={item.liked ? "Remove from favorites" : "Add to favorites"}
        >
          {item.liked ? (
            <FavoriteRoundedIcon className="liked" />
          ) : (
            <FavoriteBorderRoundedIcon className="unliked" />
          )}
        </Box>
        <img className="product-image" src={item.image} alt={item.name} />
      </Box>

      <Stack className="card-content">
        <Box className="product-title">{item.name}</Box>

        <Stack className="rating-row" direction="row">
          <StarRoundedIcon className="star-icon" />
          <Box className="rating-text">
            ({item.rating.toFixed(1)}) {item.sold.toLocaleString()} Sold
          </Box>
        </Stack>

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
            href="/shop/detail"
          >
            Buy Now
          </Button>
          <Box component="button" type="button" className="cart-btn">
            <ShoppingCartOutlinedIcon />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetProductsCard;
