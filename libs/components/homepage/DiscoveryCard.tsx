import { Box, Stack } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import Link from "next/link";

export type DiscoveryCardItem = {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  liked?: boolean;
  stats: {
    difficulty: number;
    ferocious: number;
    space: number;
    groups: number;
  };
};

type DiscoveryCardProps = {
  item: DiscoveryCardItem;
  onToggleLike?: () => void;
};

const DiscoveryCard = ({ item, onToggleLike }: DiscoveryCardProps) => {
  const statRows = [
    { label: "Difficulty in raising", value: item.stats.difficulty },
    { label: "Ferocious", value: item.stats.ferocious },
    { label: "Space", value: item.stats.space },
    { label: "Groups", value: item.stats.groups },
  ];

  return (
    <Stack className="discovery-card">
      <Box className="like-icon">
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
      </Box>

      <Box className="pet-image-box">
        <img className="pet-image" src={item.image} alt={item.name} />
      </Box>

      <Box className="pet-title">{item.name}</Box>

      <Stack className="country-row">
        <PublicRoundedIcon className="country-icon" />
        <Box className="country-text">{item.country}</Box>
      </Stack>

      <Box className="info-title">Information</Box>

      <Stack className="stats-list">
        {statRows.map((stat) => (
          <Box key={stat.label} className="stat-item">
            <Box className="stat-label">{stat.label}</Box>
            <Box className="stat-track">
              <Box className="stat-fill" style={{ width: `${stat.value}%` }} />
            </Box>
          </Box>
        ))}
      </Stack>

      <Box className="description-title">Description</Box>
      <Box className="description-text">{item.description}</Box>

      <Link href="/discovery" className="learn-more-link">
        Learn More
      </Link>
    </Stack>
  );
};

export default DiscoveryCard;
