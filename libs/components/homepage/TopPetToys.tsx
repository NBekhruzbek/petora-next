import { Box, Stack } from "@mui/material";
import { useState } from "react";
import TopPetProductsCard, { TopPetProductItem } from "./TopPetProductsCard";

const topPetToysItems: TopPetProductItem[] = [
  {
    id: "toy-1",
    name: "Dog Toys to Mouth",
    image: "/img/products/dog-toys-to-mouth.png",
    petType: "Dogs",
    rating: 5.0,
    reviewCount: 185,
    sold: 1000,
    discountedPrice: 320,
    price: 396,
    discountPercent: 19,
    likesCount: 1560,
    liked: false,
  },
  {
    id: "toy-2",
    name: "Basketball and Football Shaped Dog and Cat Toys",
    image: "/img/products/basketball-ball.png",
    petType: "Cats",
    rating: 4.0,
    reviewCount: 236,
    sold: 329,
    discountedPrice: 300,
    price: 328.85,
    discountPercent: 9,
    likesCount: 1195,
    liked: true,
  },
  {
    id: "toy-3",
    name: "Bone shaped pet toys",
    image: "/img/products/bone-toy.png",
    petType: "Dogs",
    rating: 4.5,
    reviewCount: 401,
    sold: 900,
    discountedPrice: 700,
    price: 778.35,
    discountPercent: 10,
    likesCount: 688,
    liked: false,
  },
  {
    id: "toy-4",
    name: "BALL FOR DOG",
    image: "/img/products/ball-dog.png",
    petType: "Dogs",
    rating: 3.0,
    reviewCount: 61,
    sold: 12,
    discountedPrice: 300,
    price: 475.22,
    discountPercent: 37,
    likesCount: 187,
    liked: true,
  },
];

const TopPetToys = () => {
  const [items, setItems] = useState(topPetToysItems);

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
