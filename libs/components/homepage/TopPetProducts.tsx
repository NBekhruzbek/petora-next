import { Box, Stack } from "@mui/material";
import { useState } from "react";
import TopPetProductsCard, { TopPetProductItem } from "./TopPetProductsCard";

const topPetProductItems: TopPetProductItem[] = [
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
];

const TopPetProducts = () => {
  const [items, setItems] = useState(topPetProductItems);

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
    <Stack className="top-pet-products">
      <Stack className="container">
        <Box className="section-title">
          top pet products
          <img className="hand-icon" src="/img/logo/Union.svg" alt="" />
        </Box>
        <Box className={"desc-text"}>Top Products are based on Likes</Box>

        <Stack className="top-pet-products-grid">
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

export default TopPetProducts;
