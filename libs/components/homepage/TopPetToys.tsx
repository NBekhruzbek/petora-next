import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import TopPetProductsCard, { TopPetProductItem } from "./TopPetProductsCard";

const topPetToysItems: TopPetProductItem[] = [
  {
    id: "toy-1",
    name: "Dog Toys to Mouth",
    image: "/img/products/dog-toys-to-mouth.png",
    rating: 5.0,
    sold: 1000,
    discountedPrice: 320,
    price: 396,
    liked: false,
  },
  {
    id: "toy-2",
    name: "Basketball and Football Shaped Dog and Cat Toys",
    image: "/img/products/basketball-ball.png",
    rating: 4.0,
    sold: 329,
    discountedPrice: 300,
    price: 328.85,
    liked: true,
  },
  {
    id: "toy-3",
    name: "Bone shaped pet toys",
    image: "/img/products/bone-toy.png",
    rating: 4.5,
    sold: 900,
    discountedPrice: 700,
    price: 778.35,
    liked: false,
  },
  {
    id: "toy-4",
    name: "BALL FOR DOG",
    image: "/img/products/ball-dog.png",
    rating: 3.0,
    sold: 12,
    discountedPrice: 300,
    price: 475.22,
    liked: true,
  },
];

const TopPetToys = () => {
  const [likedById, setLikedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      topPetToysItems.map((item) => [item.id, Boolean(item.liked)]),
    ),
  );

  const items = useMemo(
    () =>
      topPetToysItems.map((item) => ({
        ...item,
        liked: likedById[item.id] ?? false,
      })),
    [likedById],
  );

  const onToggleLike = (id: string) => {
    setLikedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Stack className="top-pet-toys">
      <Stack className="container">
        <Box className="section-title">
          top pet toys
          <img className="hand-icon" src="/img/logo/union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>Top Toys are based on Likes</Box>

        <Stack className="top-pet-toys-grid">
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

export default TopPetToys;
