import { useState } from "react";
import { AdminAgent } from "@/libs/data/adminMockData";
import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Link from "next/link";

type AgentCardProps = {
  item: AdminAgent;
};

const AgentCard = ({ item }: AgentCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.totalBookings ?? 0);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Stack className="agent-card">
      <Box className="agent-card-img-wrap">
        <img src={item.avatar} alt={item.fullName} className="agent-card-img" />
        <Box className="agent-type-badge">{item.serviceType}</Box>
        <Box
          className={`service-like-btn ${liked ? "is-liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          <Box className="like-count">{likeCount}</Box>
        </Box>
      </Box>

      <Stack className="agent-card-content">
        <Typography className="agent-card-name">{item.fullName}</Typography>
        <Typography className="agent-card-role">{item.role}</Typography>

        <Stack className="agent-card-rating-row" direction="row" alignItems="center">
          <Rating value={item.rating} precision={0.5} readOnly size="small" className="agent-rating-stars" />
          <Typography className="agent-rating-value">{item.rating.toFixed(1)}</Typography>
          <Typography className="agent-rating-sep">·</Typography>
          <Typography className="agent-booking-count">
            {item.totalBookings >= 1000
              ? `${(item.totalBookings / 1000).toFixed(1)}k`
              : item.totalBookings}{" "}
            booked
          </Typography>
        </Stack>

        <Stack className="agent-card-meta" direction="row" alignItems="center">
          <WorkHistoryOutlinedIcon className="agent-meta-icon" />
          <Typography className="agent-meta-text">{item.experience}</Typography>
        </Stack>

        <Stack className="agent-card-meta" direction="row" alignItems="center">
          <LocationOnOutlinedIcon className="agent-meta-icon" />
          <Typography className="agent-meta-text">{item.serviceArea}</Typography>
        </Stack>

        <Button
          className="service-book-btn"
          component={Link}
          href="/agents/detail"
          fullWidth
        >
          View Profile
        </Button>
      </Stack>
    </Stack>
  );
};

export default AgentCard;
