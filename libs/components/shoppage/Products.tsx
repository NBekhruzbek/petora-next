import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProductsCard, { ProductItem } from "./ProductsCard";

type ShopProductItem = ProductItem & {
  categories: string[];
  petType: string;
  createdAt: string;
};

type SortOption = "new" | "rating" | "most-liked" | "sold" | "price-low";

const initialProducts: ShopProductItem[] = [
  {
    id: "food-1",
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
    categories: ["Foods"],
    petType: "Cats",
    createdAt: "2026-03-18",
  },
  {
    id: "food-2",
    name: "ENCORE - CAT FOOD",
    image: "/img/products/encore.png",
    rating: 4.0,
    reviewCount: 274,
    sold: 329,
    discountedPrice: 400,
    price: 450.54,
    discountPercent: 11,
    likesCount: 982,
    liked: true,
    categories: ["Foods", "Health"],
    petType: "Cats",
    createdAt: "2026-03-10",
  },
  {
    id: "food-3",
    name: "ROYAL CANIN - CARE DIGEST",
    image: "/img/products/royal-canin.png",
    rating: 4.5,
    reviewCount: 618,
    sold: 900,
    discountedPrice: 600,
    price: 630.44,
    discountPercent: 5,
    likesCount: 743,
    liked: false,
    categories: ["Foods", "Health"],
    petType: "Dogs",
    createdAt: "2026-03-14",
  },
  {
    id: "food-4",
    name: "WELLNESS - SIGNATURE SELECTS",
    image: "/img/products/wellness.png",
    rating: 3.0,
    reviewCount: 19,
    sold: 12,
    discountedPrice: 200,
    price: 293.01,
    discountPercent: 32,
    likesCount: 214,
    liked: false,
    categories: ["Foods"],
    petType: "Cats",
    createdAt: "2026-03-04",
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
    discountPercent: 29,
    likesCount: 1560,
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
    discountPercent: 17,
    likesCount: 688,
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
    discountPercent: 16,
    likesCount: 1195,
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
    discountPercent: 32,
    likesCount: 437,
    liked: false,
    categories: ["Clothes"],
    petType: "Dogs",
    createdAt: "2026-03-08",
  },
  {
    id: "food-5",
    name: "BIRD SEED NUTRITION MIX",
    image: "/img/products/fillet.png",
    rating: 4.4,
    reviewCount: 117,
    sold: 188,
    discountedPrice: 70,
    price: 95,
    discountPercent: 26,
    likesCount: 321,
    liked: false,
    categories: ["Foods", "Health"],
    petType: "Birds",
    createdAt: "2026-03-17",
  },
  {
    id: "toy-3",
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
    categories: ["Toys", "Accessories"],
    petType: "Hamsters",
    createdAt: "2026-03-15",
  },
  {
    id: "care-2",
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
    categories: ["Health"],
    petType: "Other",
    createdAt: "2026-03-20",
  },
  {
    id: "wear-2",
    name: "WINTER WALK DOG JACKET",
    image: "/img/products/wellness.png",
    rating: 4.2,
    reviewCount: 94,
    sold: 132,
    discountedPrice: 210,
    price: 260,
    discountPercent: 19,
    likesCount: 294,
    liked: false,
    categories: ["Clothes", "Accessories"],
    petType: "Dogs",
    createdAt: "2026-03-11",
  },
  {
    id: "acc-1",
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
    categories: ["Accessories"],
    petType: "Cats",
    createdAt: "2026-03-13",
  },
  {
    id: "food-6",
    name: "GRAIN FREE PUPPY BITES",
    image: "/img/products/encore.png",
    rating: 4.7,
    reviewCount: 319,
    sold: 502,
    discountedPrice: 145,
    price: 190,
    discountPercent: 24,
    likesCount: 409,
    liked: false,
    categories: ["Foods"],
    petType: "Dogs",
    createdAt: "2026-03-09",
  },
  {
    id: "toy-4",
    name: "BIRD SWING ACTIVITY SET",
    image: "/img/products/royal-canin.png",
    rating: 4.1,
    reviewCount: 61,
    sold: 97,
    discountedPrice: 88,
    price: 118,
    discountPercent: 25,
    likesCount: 187,
    liked: false,
    categories: ["Toys"],
    petType: "Birds",
    createdAt: "2026-03-07",
  },
  {
    id: "acc-2",
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
    categories: ["Accessories", "Other"],
    petType: "Hamsters",
    createdAt: "2026-03-06",
  },
];

const petTypes = ["All", "Dogs", "Cats", "Birds", "Hamsters", "Other"];

const categories = [
  "All",
  "Foods",
  "Toys",
  "Clothes",
  "Health",
  "Accessories",
  "Other",
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isPetTypeOpen, setIsPetTypeOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLikedOpen, setIsLikedOpen] = useState(true);
  const [likedSelected, setLikedSelected] = useState(false);
  const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [productSearch, setProductSearch] = useState({
    page: 1,
    limit: 12,
  });
  const productsTopRef = useRef<HTMLDivElement | null>(null);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
    }
  };

  const toggleCategoryOpen = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  const togglePriceOpen = () => {
    setIsPriceOpen((prev) => !prev);
  };

  const togglePetTypeOpen = () => {
    setIsPetTypeOpen((prev) => !prev);
  };

  const togglePetType = (name: string) => {
    if (name === "All") {
      setSelectedPetTypes([]);
      return;
    }

    setSelectedPetTypes((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const toggleCategory = (name: string) => {
    if (name === "All") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const toggleLikedOpen = () => {
    setIsLikedOpen((prev) => !prev);
  };

  const toggleLikedSelected = () => {
    setLikedSelected((prev) => !prev);
  };

  const searchProductHandler = () => {
    setSearchText((prev) => prev.trim());
  };

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setProductSearch((prev) => ({ ...prev, page }));

    if (!productsTopRef.current) return;

    const scrollTarget =
      window.scrollY + productsTopRef.current.getBoundingClientRect().top - 210;

    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: "smooth",
    });
  };

  const toggleProductLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              liked: !product.liked,
              likesCount: Math.max(
                0,
                (product.likesCount ?? 0) + (product.liked ? -1 : 1),
              ),
            }
          : product,
      ),
    );
  };

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    const normalizedSearch = searchText.trim().toLowerCase();

    return products.filter((product) => {
      const matchesPrice =
        product.discountedPrice >= minPrice &&
        product.discountedPrice <= maxPrice;
      const matchesPetType =
        selectedPetTypes.length === 0 ||
        selectedPetTypes.includes(product.petType);
      const matchesCategory =
        selectedCategories.length === 0 ||
        product.categories.some((category) =>
          selectedCategories.includes(category),
        );
      const matchesLiked = !likedSelected || Boolean(product.liked);
      const searchableText = [
        product.name,
        product.petType,
        ...product.categories,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return (
        matchesPrice &&
        matchesPetType &&
        matchesCategory &&
        matchesLiked &&
        matchesSearch
      );
    });
  }, [
    likedSelected,
    priceRange,
    products,
    searchText,
    selectedCategories,
    selectedPetTypes,
  ]);

  const sortedProducts = useMemo(() => {
    const next = [...filteredProducts];

    switch (sortBy) {
      case "rating":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "most-liked":
        next.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case "sold":
        next.sort((a, b) => b.sold - a.sold);
        break;
      case "price-low":
        next.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "new":
      default:
        next.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return next;
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    setProductSearch((prev) => ({ ...prev, page: 1 }));
  }, [
    likedSelected,
    priceRange,
    searchText,
    selectedCategories,
    selectedPetTypes,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / productSearch.limit),
  );

  useEffect(() => {
    if (productSearch.page > totalPages) {
      setProductSearch((prev) => ({ ...prev, page: totalPages }));
    }
  }, [productSearch.page, totalPages]);

  const startIndex = (productSearch.page - 1) * productSearch.limit;
  const pagedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productSearch.limit,
  );

  return (
    <Stack className="products-section">
      <Stack className="container">
        <Box className="title">Products</Box>
        <Stack className="products-main">
          <Stack className="category">
            <Box className="search-box">
              <Input
                placeholder="Search here"
                disableUnderline
                className="text-field"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchProductHandler();
                  }
                }}
              />
              <Button className="search-button" onClick={searchProductHandler}>
                <SearchIcon />
              </Button>
            </Box>
            <Divider className="divider" />

            <Stack className="price-section category-section">
              <Stack className="category-header" onClick={togglePriceOpen}>
                <Typography className="category-title">Price range</Typography>
                <Box
                  className={`category-toggle ${isPriceOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack
                className={`category-list ${isPriceOpen ? "is-open" : ""}`}
              >
                <Box className="price-range">
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    min={0}
                    max={1000}
                    valueLabelDisplay="off"
                    className="price-line"
                  />

                  <Typography className="selected-price">
                    ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider className="divider" />

            <Stack className="category-section">
              <Stack className="category-header" onClick={togglePetTypeOpen}>
                <Typography className="category-title">PetTypes</Typography>
                <Box
                  className={`category-toggle ${isPetTypeOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack
                className={`category-list ${isPetTypeOpen ? "is-open" : ""}`}
              >
                {petTypes.map((petType) => {
                  const isSelected =
                    petType === "All"
                      ? selectedPetTypes.length === 0
                      : selectedPetTypes.includes(petType);

                  return (
                    <Stack
                      key={petType}
                      className={`category-option ${
                        isSelected ? "is-selected" : ""
                      }`}
                      onClick={() => togglePetType(petType)}
                    >
                      <Box className="category-checkbox" aria-hidden="true" />
                      <Typography className="category-label">
                        {petType}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>

            <Divider className="divider" />

            <Stack className="category-section">
              <Stack className="category-header" onClick={toggleCategoryOpen}>
                <Typography className="category-title">Category</Typography>
                <Box
                  className={`category-toggle ${
                    isCategoryOpen ? "is-open" : ""
                  }`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack
                className={`category-list ${isCategoryOpen ? "is-open" : ""}`}
              >
                {categories.map((category) => {
                  const isSelected =
                    category === "All"
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(category);

                  return (
                    <Stack
                      key={category}
                      className={`category-option ${
                        isSelected ? "is-selected" : ""
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <Box className="category-checkbox" aria-hidden="true" />
                      <Typography className="category-label">
                        {category}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
            <Divider className="divider" />

            <Stack className="liked-products-section">
              <Stack className="likes-header" onClick={toggleLikedOpen}>
                <Typography className="likes-title">Likes</Typography>
                <Box
                  className={`likes-toggle ${isLikedOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </Stack>
              <Stack className={`likes-list ${isLikedOpen ? "is-open" : ""}`}>
                <Stack
                  className={`likes-option ${
                    likedSelected ? "is-selected" : ""
                  }`}
                  onClick={toggleLikedSelected}
                >
                  <Box className="likes-checkbox" aria-hidden="true" />
                  <Typography className="likes-label">
                    Liked Products
                  </Typography>
                </Stack>
                <Divider className="likes-divider" />
              </Stack>
            </Stack>
          </Stack>

          <Stack className="sorting-products" ref={productsTopRef}>
            <Box className="filter-section-wrap">
              <Select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="filter-section"
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { className: "filter-menu" },
                  MenuListProps: { className: "filter-menu-list" },
                }}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="rating">Highest rating</MenuItem>
                <MenuItem value="most-liked">Most Liked</MenuItem>
                <MenuItem value="sold">Best selling</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
              </Select>
            </Box>

            <Stack className="products-cards">
              {pagedProducts.length !== 0 ? (
                pagedProducts.map((product) => (
                  <ProductsCard
                    key={product.id}
                    item={product}
                    onToggleLike={() => toggleProductLike(product.id)}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    width: "800px",
                    height: "800px",
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/img/icons/no-data.png"
                    alt="No products found"
                    style={{ width: 450, height: 450, marginTop: "120px" }}
                  />
                </Box>
              )}

              <Stack className="pagination-section">
                {pagedProducts.length !== 0 ? (
                  <Pagination
                    count={totalPages}
                    page={productSearch.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                        color="primary"
                      />
                    )}
                    onChange={paginationHandler}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Products;
