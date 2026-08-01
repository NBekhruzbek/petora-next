import { Box, Stack } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const statRows = [
    { key: "difficulty", value: item.stats.difficulty },
    { key: "ferocious", value: item.stats.ferocious },
    { key: "space", value: item.stats.space },
    { key: "groups", value: item.stats.groups },
  ];

  // The English copy in the data array is the fallback, so an unlisted breed
  // or country still renders instead of showing a raw key.
  const name = t(`discovery.pets.${item.id}.name`, { defaultValue: item.name });
  const description = t(`discovery.pets.${item.id}.desc`, {
    defaultValue: item.description,
  });
  const country = t(`discovery.country.${item.country}`, {
    defaultValue: item.country,
  });

  return (
    <Stack className="discovery-card">
      <Box className="like-icon">
        <Box
          component="button"
          type="button"
          className="like-toggle"
          onClick={onToggleLike}
          aria-label={
            item.liked
              ? t("discovery.removeFavorite")
              : t("discovery.addFavorite")
          }
        >
          {item.liked ? (
            <FavoriteRoundedIcon className="liked" />
          ) : (
            <FavoriteBorderRoundedIcon className="unliked" />
          )}
        </Box>
      </Box>

      <Box className="pet-image-box">
        <img className="pet-image" src={item.image} alt={name} />
      </Box>

      <Box className="pet-title">{name}</Box>

      <Stack className="country-row">
        <PublicRoundedIcon className="country-icon" />
        <Box className="country-text">{country}</Box>
      </Stack>

      <Box className="info-title">{t("discovery.info")}</Box>

      <Stack className="stats-list">
        {statRows.map((stat) => (
          <Box key={stat.key} className="stat-item">
            <Box className="stat-label">{t(`discovery.${stat.key}`)}</Box>
            <Box className="stat-track">
              <Box className="stat-fill" style={{ width: `${stat.value}%` }} />
            </Box>
          </Box>
        ))}
      </Stack>

      <Box className="description-title">{t("discovery.description")}</Box>
      <Box className="description-text">{description}</Box>
    </Stack>
  );
};

export default DiscoveryCard;
