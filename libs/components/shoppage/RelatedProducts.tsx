import { Box, Stack } from "@mui/material";
import ProductsCard, { ProductItem } from "./ProductsCard";
import { useState } from "react";

type ShopProductItem = ProductItem & {
  categories: string[];
  petType: string;
  createdAt: string;
};

const initialProducts: ShopProductItem[] = [
  {
    id: "food-3",
    name: "ROYAL CANIN - CARE DIGEST",
    image: "/img/products/royal-canin.png",
    rating: 4.5,
    reviewCount: 618,
    sold: 900,
    discountedPrice: 600,
    price: 630.44,
    liked: false,
    categories: ["Foods", "Health"],
    petType: "Dogs",
    createdAt: "2026-03-14",
  },
  {
    id: "toy-1",
    name: "KITTY FEATHER PLAY SET",
    image: "/img/products/bone-toy.png",
    rating: 4.7,
    reviewCount: 401,
    sold: 540,
    discountedPrice: 85,
    price: 120,
    liked: true,
    categories: ["Toys"],
    petType: "Dogs",
    createdAt: "2026-03-19",
  },
  {
    id: "toy-2",
    name: "PUPPY CHEW STARTER PACK",
    image: "/img/products/basketball-ball.png",
    rating: 4.3,
    reviewCount: 236,
    sold: 470,
    discountedPrice: 150,
    price: 180,
    liked: false,
    categories: ["Toys", "Accessories"],
    petType: "Cats",
    createdAt: "2026-03-16",
  },
  {
    id: "care-1",
    name: "PAW & COAT CARE BUNDLE",
    image: "/img/products/dog-toys-to-mouth.png",
    rating: 4.8,
    reviewCount: 185,
    sold: 220,
    discountedPrice: 260,
    price: 310,
    liked: true,
    categories: ["Health", "Accessories"],
    petType: "Dogs",
    createdAt: "2026-03-12",
  },
  {
    id: "wear-1",
    name: "EVERYDAY PET HOODIE",
    image: "/img/products/wellness.png",
    rating: 4.1,
    reviewCount: 88,
    sold: 156,
    discountedPrice: 95,
    price: 140,
    liked: false,
    categories: ["Clothes"],
    petType: "Dogs",
    createdAt: "2026-03-08",
  },
];

const RelatedProducts = () => {
  const [products, setProducts] = useState(initialProducts);

  const toggleProductLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, liked: !product.liked }
          : product,
      ),
    );
  };
  return (
    <Stack className="related-products">
      <Stack className="container">
        <Box className={"related-products-title"}>
          Other Products may You Like <img src="/img/logo/Union.svg" alt="" />
        </Box>
        <Stack className="product-cards">
          {initialProducts.map((product) => {
            return (
              <ProductsCard
                key={product.id}
                item={product}
                onToggleLike={() => toggleProductLike(product.id)}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RelatedProducts;
