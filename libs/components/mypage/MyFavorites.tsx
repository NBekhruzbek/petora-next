import React, { ChangeEvent, useRef, useState } from "react";
import { Box, Pagination, PaginationItem, Stack, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProductsCard, { ProductItem } from "../shoppage/ProductsCard";
import ServiceCard, { ServiceItem } from "../servicepage/ServiceCard";

const FAV_PRODUCTS: ProductItem[] = [
  {
    id: "fav-p-1",
    name: "FILLET 'O' LAKES - KIT CAT",
    image: "/img/products/fillet.png",
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
    id: "fav-p-2",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
    rating: 4.0,
    reviewCount: 274,
    sold: 329,
    discountedPrice: 400,
    price: 450,
    discountPercent: 11,
    likesCount: 982,
    liked: true,
  },
  {
    id: "fav-p-3",
    name: "KITTY FEATHER PLAY SET",
    image: "/img/products/bone-toy.png",
    rating: 4.7,
    reviewCount: 401,
    sold: 540,
    discountedPrice: 85,
    price: 120,
    discountPercent: 29,
    likesCount: 1560,
    liked: true,
  },
  {
    id: "fav-p-4",
    name: "PAW & COAT CARE BUNDLE",
    image: "/img/products/dog-toys-to-mouth.png",
    rating: 4.8,
    reviewCount: 185,
    sold: 220,
    discountedPrice: 260,
    price: 310,
    discountPercent: 16,
    likesCount: 1195,
    liked: true,
  },
  {
    id: "fav-p-5",
    name: "HAMSTER TUNNEL PLAY KIT",
    image: "/img/products/encore.png",
    rating: 4.6,
    reviewCount: 164,
    sold: 241,
    discountedPrice: 110,
    price: 145,
    discountPercent: 24,
    likesCount: 574,
    liked: true,
  },
  {
    id: "fav-p-6",
    name: "PET VITAMIN DAILY DROPS",
    image: "/img/products/royal-canin.png",
    rating: 4.9,
    reviewCount: 433,
    sold: 611,
    discountedPrice: 175,
    price: 220,
    discountPercent: 20,
    likesCount: 863,
    liked: true,
  },
  {
    id: "fav-p-7",
    name: "CAT TRAVEL FEEDER BOWL",
    image: "/img/products/fillet.png",
    rating: 4.5,
    reviewCount: 248,
    sold: 387,
    discountedPrice: 98,
    price: 130,
    discountPercent: 25,
    likesCount: 515,
    liked: true,
  },
  {
    id: "fav-p-8",
    name: "SMALL PET CARRY CASE",
    image: "/img/products/wellness.png",
    rating: 4.3,
    reviewCount: 102,
    sold: 164,
    discountedPrice: 230,
    price: 290,
    discountPercent: 21,
    likesCount: 266,
    liked: true,
  },
  {
    id: "fav-p-9",
    name: "ROYAL CANIN - CARE DIGEST",
    image: "/img/products/royal-canin.png",
    rating: 4.5,
    reviewCount: 618,
    sold: 900,
    discountedPrice: 600,
    price: 630,
    discountPercent: 5,
    likesCount: 743,
    liked: true,
  },
  {
    id: "fav-p-10",
    name: "PUPPY CHEW STARTER PACK",
    image: "/img/products/basketball-ball.png",
    rating: 4.3,
    reviewCount: 236,
    sold: 470,
    discountedPrice: 150,
    price: 180,
    discountPercent: 17,
    likesCount: 688,
    liked: true,
  },
  {
    id: "fav-p-11",
    name: "BIRD SEED NUTRITION MIX",
    image: "/img/products/fillet.png",
    rating: 4.4,
    reviewCount: 117,
    sold: 188,
    discountedPrice: 70,
    price: 95,
    discountPercent: 26,
    likesCount: 321,
    liked: true,
  },
  {
    id: "fav-p-12",
    name: "EVERYDAY PET HOODIE",
    image: "/img/products/wellness.png",
    rating: 4.1,
    reviewCount: 88,
    sold: 156,
    discountedPrice: 95,
    price: 140,
    discountPercent: 32,
    likesCount: 437,
    liked: true,
  },
  {
    id: "fav-p-13",
    name: "WINTER WALK DOG JACKET",
    image: "/img/products/wellness.png",
    rating: 4.2,
    reviewCount: 94,
    sold: 132,
    discountedPrice: 210,
    price: 260,
    discountPercent: 19,
    likesCount: 294,
    liked: true,
  },
];

const FAV_SERVICES: ServiceItem[] = [
  {
    _id: "fav-s-1",
    serviceName: "Premium Dog Grooming",
    category: "Grooming",
    image: "/img/services/grooming.jpg",
    price: 50,
    duration: "45 min",
    location: "Seoul",
    rating: 4.4,
    reviewCount: 128,
    likes: 121,
    liked: true,
  },
  {
    _id: "fav-s-2",
    serviceName: "Daily Dog Walk – 1 hr",
    category: "Walking",
    image: "/img/services/walking.jpg",
    price: 25,
    duration: "60 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 256,
    likes: 201,
    liked: true,
  },
  {
    _id: "fav-s-3",
    serviceName: "Cat Overnight Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 65,
    duration: "per night",
    location: "Daegu",
    rating: 4.9,
    reviewCount: 89,
    likes: 312,
    liked: true,
  },
  {
    _id: "fav-s-4",
    serviceName: "Dog Home Boarding",
    category: "Boarding",
    image: "/img/services/boarding.png",
    price: 55,
    duration: "per night",
    location: "Suwon",
    rating: 4.6,
    reviewCount: 143,
    likes: 187,
    liked: true,
  },
  {
    _id: "fav-s-5",
    serviceName: "Basic Obedience Training",
    category: "Training",
    image: "/img/services/grooming.jpg",
    price: 90,
    duration: "60 min",
    location: "Seoul",
    rating: 4.8,
    reviewCount: 211,
    likes: 321,
    liked: true,
  },
  {
    _id: "fav-s-6",
    serviceName: "Full Day Pet Day Care",
    category: "Day Care",
    image: "/img/services/boarding.png",
    price: 45,
    duration: "8 hrs",
    location: "Busan",
    rating: 4.6,
    reviewCount: 172,
    likes: 143,
    liked: true,
  },
  {
    _id: "fav-s-7",
    serviceName: "Vet Check-Up & Vaccines",
    category: "Veterinary",
    image: "/img/services/grooming.jpg",
    price: 80,
    duration: "30 min",
    location: "Seoul",
    rating: 4.7,
    reviewCount: 304,
    likes: 267,
    liked: true,
  },
];

const PRODUCT_LIMIT = 12;
const SERVICE_LIMIT = 6;

const MyFavorites = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState(FAV_PRODUCTS);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);

  const productsTopRef = useRef<HTMLDivElement | null>(null);
  const servicesTopRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProductPageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setProductPage(page);
    if (!productsTopRef.current) return;
    const scrollTarget =
      window.scrollY + productsTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const handleServicePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setServicePage(page);
    if (!servicesTopRef.current) return;
    const scrollTarget =
      window.scrollY + servicesTopRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  const toggleProductLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              liked: !p.liked,
              likesCount: Math.max(0, (p.likesCount ?? 0) + (p.liked ? -1 : 1)),
            }
          : p,
      ),
    );
  };

  const productTotalPages = Math.max(1, Math.ceil(products.length / PRODUCT_LIMIT));
  const productStart = (productPage - 1) * PRODUCT_LIMIT;
  const pagedProducts = products.slice(productStart, productStart + PRODUCT_LIMIT);

  const serviceTotalPages = Math.max(1, Math.ceil(FAV_SERVICES.length / SERVICE_LIMIT));
  const serviceStart = (servicePage - 1) * SERVICE_LIMIT;
  const pagedServices = FAV_SERVICES.slice(serviceStart, serviceStart + SERVICE_LIMIT);

  return (
    <Stack className="my-favorites-container" spacing={3}>
      <Box className="my-favorites-tabs-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="my favorites tabs"
        >
          <Tab label="Products" />
          <Tab label="Services" />
        </Tabs>
      </Box>

      <Box className="my-favorites-tab-content">
        {activeTab === 0 && (
          <Stack className="fav-products-wrap" ref={productsTopRef}>
            <Stack className="fav-products-grid">
              {pagedProducts.map((product) => (
                <ProductsCard
                  key={product.id}
                  item={product}
                  onToggleLike={() => toggleProductLike(product.id)}
                />
              ))}
            </Stack>
            {products.length > PRODUCT_LIMIT && (
              <Stack className="pagination-section">
                <Pagination
                  count={productTotalPages}
                  page={productPage}
                  renderItem={(item) => (
                    <PaginationItem
                      components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                      color="primary"
                    />
                  )}
                  onChange={handleProductPageChange}
                />
              </Stack>
            )}
          </Stack>
        )}

        {activeTab === 1 && (
          <Stack className="fav-services-wrap" ref={servicesTopRef}>
            <Stack className="fav-agents-grid">
              {pagedServices.map((service) => (
                <ServiceCard key={service._id} item={service} />
              ))}
            </Stack>
            {FAV_SERVICES.length > SERVICE_LIMIT && (
              <Stack className="pagination-section">
                <Pagination
                  count={serviceTotalPages}
                  page={servicePage}
                  renderItem={(item) => (
                    <PaginationItem
                      components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                      color="primary"
                    />
                  )}
                  onChange={handleServicePageChange}
                />
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default MyFavorites;
