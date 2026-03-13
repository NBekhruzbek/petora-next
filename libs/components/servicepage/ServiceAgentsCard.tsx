import { Box, Button, Rating, Stack } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Link from "next/link";
import { useState } from "react";

export type AgentItem = {
  _id: string;
  name: string;
  serviceType: string;
  image: string;
  desc: string;
  likes: number;
  rating: number;
  bookings: number;
};

type AgentsCardProps = {
  item: AgentItem;
};

const ServiceAgentsCard = ({ item }: AgentsCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });
  };

  return (
    <Stack className="agents-card">
      <Stack className="agent-media">
        <Box className="agent-image-wrap">
          <img className="agent-image" src={item.image} alt={item.name} />
        </Box>
        <Box
          className={`like-fab ${liked ? "is-liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          <Box className="like-count">{likeCount}</Box>
        </Box>
      </Stack>

      <Stack className="agent-content">
        <Stack className="name-row">
          <Box className="agent-name">{item.name}</Box>
          <Box className="bookings-row">Bookings: {item.bookings}</Box>
        </Stack>
        <Box className="agent-email">{item.serviceType}</Box>
        <Stack className="rating-row">
          <Rating
            value={item.rating}
            precision={0.5}
            readOnly
            className="rating-stars"
          />
          <Box className="rating-value">{item.rating.toFixed(1)}</Box>
        </Stack>
        <Box className="agent-desc">{item.desc}</Box>

        <Stack className="agent-actions">
          <Button
            className="message-btn"
            variant="outlined"
            component={Link}
            href="/service"
            startIcon={<ChatBubbleOutlineRoundedIcon />}
          >
            Booking
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ServiceAgentsCard;
