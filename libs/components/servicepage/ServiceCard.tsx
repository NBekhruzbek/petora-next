import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Link from "next/link";

export type ServiceItem = {
  _id: string;
  serviceName: string;
  category: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviewCount: number;
  likes: number;
  liked?: boolean;
  bookingCount?: number;
};

type ServiceCardProps = {
  item: ServiceItem;
  onToggleLike?: () => void;
};

const ServiceCard = ({ item, onToggleLike }: ServiceCardProps) => {
  const liked = item.liked ?? false;

  return (
    <Stack className="service-card">
      <Box className="service-card-image-wrap">
        <Box className="service-category-badge">{item.category}</Box>
        <Box
          className={`service-like-btn ${liked ? "is-liked" : ""}`}
          onClick={onToggleLike}
        >
          {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          <Box className="like-count">{item.likes}</Box>
        </Box>
        <img
          className="service-card-image"
          src={item.image}
          alt={item.serviceName}
        />
      </Box>

      <Stack className="service-card-content">
        <Typography className="service-card-name">{item.serviceName}</Typography>

        <Stack className="service-price-row" direction="row" alignItems="center">
          <Typography className="service-price">${item.price}</Typography>
          <Typography className="service-price-sep">·</Typography>
          <AccessTimeOutlinedIcon className="duration-icon" />
          <Typography className="service-duration">{item.duration}</Typography>
        </Stack>

        <Stack className="service-location-row" direction="row" alignItems="center">
          <LocationOnOutlinedIcon className="location-icon" />
          <Typography className="service-location">{item.location}</Typography>
        </Stack>

        <Stack className="service-rating-row" direction="row" alignItems="center">
          <Rating
            value={item.rating}
            precision={0.5}
            readOnly
            size="small"
            className="rating-stars"
          />
          <Typography className="rating-value">{item.rating.toFixed(1)}</Typography>
          <Typography className="review-count">({item.reviewCount.toLocaleString()})</Typography>
          {item.bookingCount !== undefined && (
            <>
              <Typography className="service-price-sep">·</Typography>
              <Typography className="service-booking-count">
                {item.bookingCount >= 1000
                  ? `${(item.bookingCount / 1000).toFixed(1)}k`
                  : item.bookingCount} booked
              </Typography>
            </>
          )}
        </Stack>

        <Button
          className="service-book-btn"
          component={Link}
          href="/service/booking"
          fullWidth
        >
          Book Now
        </Button>
      </Stack>
    </Stack>
  );
};

export default ServiceCard;
