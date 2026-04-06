import { Box, Stack } from "@mui/material";
import { useState } from "react";
import TopPetProductsCard, { TopPetProductItem } from "./TopPetProductsCard";

const topPetFoodItems: TopPetProductItem[] = [
  {
    id: "food-1",
    name: "FILLET 'O' LAKES - KIT CAT",
    image: "/img/products/fillet.png",
    petType: "Cats",
    rating: 5.0,
    reviewCount: 842,
    sold: 1000,
    discountedPrice: 100,
    price: 200,
    discountPercent: 50,
    likesCount: 1240,
    liked: true,
  },
  {
    id: "food-2",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
    petType: "Cats",
    rating: 4.0,
    reviewCount: 274,
    sold: 329,
    discountedPrice: 400,
    price: 450.54,
    discountPercent: 11,
    likesCount: 982,
    liked: true,
  },
  {
    id: "food-3",
    name: "ROYAL CANIN - CARE DIGEST",
    image: "/img/products/royal-canin.png",
    petType: "Dogs",
    rating: 4.5,
    reviewCount: 618,
    sold: 900,
    discountedPrice: 600,
    price: 630.44,
    discountPercent: 5,
    likesCount: 743,
    liked: false,
  },
  {
    id: "food-4",
    name: "WELLNESS - SIGNATURE SELECTS",
    image: "/img/products/wellness.png",
    petType: "Cats",
    rating: 3.0,
    reviewCount: 19,
    sold: 12,
    discountedPrice: 200,
    price: 293.01,
    discountPercent: 32,
    likesCount: 214,
    liked: false,
  },
];

const TopPetFoods = () => {
  const [items, setItems] = useState(topPetFoodItems);

  const onToggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likesCount: Math.max(
                0,
                (item.likesCount ?? 0) + (item.liked ? -1 : 1),
              ),
            }
          : item,
      ),
    );
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
