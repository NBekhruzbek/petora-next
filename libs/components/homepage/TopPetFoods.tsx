import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import TopPetProductsCard, { TopPetProductItem } from "./TopPetProductsCard";

const topPetFoodItems: TopPetProductItem[] = [
  {
    id: "food-1",
    name: "FILLET 'O' LAKES - KIT CAT",
    image: "/img/products/fillet.png",
    rating: 5.0,
    sold: 1000,
    discountedPrice: 100,
    price: 200,
    liked: true,
  },
  {
    id: "food-2",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
    rating: 4.0,
    sold: 329,
    discountedPrice: 400,
    price: 450.54,
    liked: true,
  },
  {
    id: "food-3",
    name: "ROYAL CANIN - CARE DIGEST",
    image: "/img/products/royal-canin.png",
    rating: 4.5,
    sold: 900,
    discountedPrice: 600,
    price: 630.44,
    liked: false,
  },
  {
    id: "food-4",
    name: "WELLNESS - SIGNATURE SELECTS",
    image: "/img/products/wellness.png",
    rating: 3.0,
    sold: 12,
    discountedPrice: 200,
    price: 293.01,
    liked: false,
  },
];

const TopPetFoods = () => {
  const [likedById, setLikedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      topPetFoodItems.map((item) => [item.id, Boolean(item.liked)]),
    ),
  );

  const items = useMemo(
    () =>
      topPetFoodItems.map((item) => ({
        ...item,
        liked: likedById[item.id] ?? false,
      })),
    [likedById],
  );

  const onToggleLike = (id: string) => {
    setLikedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Stack className="top-pet-foods">
      <Stack className="container">
        <Box className="section-title">
          top pet foods
          <img className="hand-icon" src="/img/logo/union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>Top Foods are based on Likes</Box>

        <Stack className="top-pet-foods-grid">
          {items.map((item) => (
            <TopPetProductsCard
              key={item.id}
              item={item}
              onToggleLike={() => onToggleLike(item.id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopPetFoods;
