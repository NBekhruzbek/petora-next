import { Box, Stack, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

export type FreeBoardNewsCardType = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  views: number;
  likes: number;
};

type FreeBoardNewsCardProps = {
  item: FreeBoardNewsCardType;
};

const DESCRIPTION_LIMIT = 80;

const FreeBoardNewsCard = ({ item }: FreeBoardNewsCardProps) => {
  const shortDescription =
    item.description.length > DESCRIPTION_LIMIT
      ? `${item.description.slice(0, DESCRIPTION_LIMIT).trim()}...`
      : item.description;

  return (
    <Stack className="free-board-news-card">
      <Box className="free-board-news-media">
        <img
          className="free-board-news-image"
          src={item.image}
          alt={item.title}
        />
        <Box className="free-board-news-date">{item.date}</Box>
      </Box>

      <Stack className="free-board-news-body">
        <Typography className="free-board-news-title">{item.title}</Typography>

        <Typography className="free-board-news-description">
          {shortDescription}
        </Typography>

        <Stack className="free-board-news-meta">
          <Box className="free-board-news-stat">
            <VisibilityOutlinedIcon />
            <span>{item.views.toLocaleString()}</span>
          </Box>

          <Box className="free-board-news-stat">
            <FavoriteBorderRoundedIcon />
            <span>{item.likes.toLocaleString()}</span>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FreeBoardNewsCard;
